/**
 * GET /api/v1/recession-score
 *
 * Fetches all 13 FRED indicators, runs the GeoWire scoring engine,
 * and returns a composite recession probability with per-model breakdown.
 *
 * Rate limiting:
 *  - Authenticated users are checked against profiles.api_calls_today
 *  - Free tier: 10 calls/day · Pro/Analyst: 500 calls/day
 *  - Unauthenticated requests are allowed (no rate limit) — the dashboard
 *    redirect handles auth protection; the API stays publicly readable
 *    for the gauge's initial client-side fetch.
 *
 * Response shape: CompositeResult (see src/lib/scoring/engine.ts)
 * Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200
 */

import { NextResponse } from 'next/server';
import { fetchAllIndicators } from '@/lib/data/fred';
import { runScoringEngine } from '@/lib/scoring/engine';
import { createClient } from '@/lib/supabase/server';
import { checkAndIncrementRateLimit } from '@/lib/auth/rateLimit';

export async function GET() {
  try {
    // ── Rate limiting (authenticated requests only) ──────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const limit = await checkAndIncrementRateLimit(user.id);

      if (!limit.allowed) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: `Daily limit of ${
              limit.tier === 'free' ? 10 : 500
            } API calls reached. Resets at ${limit.resetAt}.`,
            resetAt: limit.resetAt,
            tier: limit.tier,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.tier === 'free' ? '10' : '500',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': limit.resetAt,
              'Retry-After': String(
                Math.ceil((new Date(limit.resetAt).getTime() - Date.now()) / 1000),
              ),
            },
          },
        );
      }
    }

    // ── Scoring engine ────────────────────────────────────────────────────────
    const { series, dataSource, fetchedAt, errors } = await fetchAllIndicators();

    if (Object.keys(errors).length > 0) {
      console.warn('[api/v1/recession-score] Some series had errors:', errors);
    }

    const result = runScoringEngine(series, fetchedAt, dataSource);

    return NextResponse.json(
      { ...result, seriesErrors: Object.keys(errors).length > 0 ? errors : undefined },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      },
    );
  } catch (err) {
    console.error('[api/v1/recession-score] Fatal error:', err);
    return NextResponse.json(
      { error: 'Scoring engine error', message: String(err) },
      { status: 500 },
    );
  }
}
