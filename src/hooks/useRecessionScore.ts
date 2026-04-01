'use client';

import { useQuery } from '@tanstack/react-query';
import type { CompositeResult } from '@/lib/scoring/engine';

/** Response shape from /api/v1/recession-score (extends CompositeResult) */
export type RecessionScoreResponse = CompositeResult & {
  seriesErrors?: Record<string, string>;
};

/**
 * React Query hook for /api/v1/recession-score.
 * Refetches every 5 minutes. staleTime: 60s.
 */
export function useRecessionScore() {
  return useQuery<RecessionScoreResponse>({
    queryKey: ['recession-score'],
    queryFn: async () => {
      const res = await fetch('/api/v1/recession-score');
      if (!res.ok) throw new Error(`Recession score fetch failed: ${res.status}`);
      return res.json() as Promise<RecessionScoreResponse>;
    },
    staleTime: 60_000,
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  });
}
