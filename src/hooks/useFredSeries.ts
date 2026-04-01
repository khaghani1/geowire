'use client';

import { useQueries } from '@tanstack/react-query';
import { ALLOWED_SERIES } from '@/lib/data/seed/indicators';
import type { FredSeriesResult } from '@/lib/data/fred';

/**
 * Parallel React Query hook for all 13 FRED series.
 * Uses useQueries (not waterfall) — all requests fire simultaneously.
 * staleTime: 60s to avoid re-fetching on every render.
 */
export function useFredSeries() {
  return useQueries({
    queries: ALLOWED_SERIES.map((seriesId) => ({
      queryKey: ['fred-series', seriesId],
      queryFn: async (): Promise<FredSeriesResult> => {
        const res = await fetch(`/api/v1/fred/${seriesId}`);
        if (!res.ok) throw new Error(`FRED fetch failed for ${seriesId}: ${res.status}`);
        return res.json() as Promise<FredSeriesResult>;
      },
      staleTime: 60_000,
      retry: 1,
    })),
  });
}

/** Map useFredSeries results to a keyed record for easy lookup */
export function buildSeriesMap(
  results: ReturnType<typeof useFredSeries>
): Record<string, FredSeriesResult> {
  const map: Record<string, FredSeriesResult> = {};
  results.forEach((result, i) => {
    if (result.data) {
      map[ALLOWED_SERIES[i]] = result.data;
    }
  });
  return map;
}
