/**
 * GET /api/v1/fred/[seriesId]
 *
 * Proxies individual FRED series requests. Validates seriesId against
 * the allowed list to prevent arbitrary FRED API proxying.
 *
 * Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchSeries } from '@/lib/data/fred';
import { ALLOWED_SERIES } from '@/lib/data/seed/indicators';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ seriesId: string }> }
) {
  const { seriesId } = await params;

  if (!ALLOWED_SERIES.includes(seriesId as (typeof ALLOWED_SERIES)[number])) {
    return NextResponse.json(
      {
        error: 'Unknown series ID',
        allowed: ALLOWED_SERIES,
      },
      { status: 400 }
    );
  }

  try {
    const result = await fetchSeries(seriesId);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (err) {
    console.error(`[api/v1/fred/${seriesId}] Error:`, err);
    return NextResponse.json(
      { error: 'Failed to fetch series data' },
      { status: 500 }
    );
  }
}
