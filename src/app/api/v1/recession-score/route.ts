/**
 * GET /api/v1/recession-score
 *
 * Fetches all 13 FRED indicators, runs the GeoWire scoring engine,
 * and returns a composite recession probability with per-model breakdown.
 *
 * Response shape: CompositeResult (see src/lib/scoring/engine.ts)
 * Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200
 */

import { NextResponse } from 'next/server';
import { fetchAllIndicators } from '@/lib/data/fred';
import { runScoringEngine } from '@/lib/scoring/engine';

export async function GET() {
  try {
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
      }
    );
  } catch (err) {
    console.error('[api/v1/recession-score] Fatal error:', err);
    return NextResponse.json(
      { error: 'Scoring engine error', message: String(err) },
      { status: 500 }
    );
  }
}
