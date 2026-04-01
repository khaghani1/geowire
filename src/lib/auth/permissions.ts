// ─── Tier types ───────────────────────────────────────────────────────────────

export type Tier = 'free' | 'pro' | 'analyst';

export interface TierPermissions {
  /** Number of scoring models visible out of 6 */
  visibleModels: number;
  /** React Query refetchInterval in ms */
  refreshInterval: number;
  /** Max API calls per calendar day */
  apiCallsPerDay: number;
  /** Whether full article list is shown */
  allArticles: boolean;
}

// ─── Tier configuration ───────────────────────────────────────────────────────

const TIER_CONFIG: Record<Tier, TierPermissions> = {
  free: {
    visibleModels: 2,
    refreshInterval: 30 * 60 * 1000, // 30 min
    apiCallsPerDay: 10,
    allArticles: false,
  },
  pro: {
    visibleModels: 6,
    refreshInterval: 5 * 60 * 1000, // 5 min
    apiCallsPerDay: 500,
    allArticles: true,
  },
  analyst: {
    visibleModels: 6,
    refreshInterval: 5 * 60 * 1000, // 5 min
    apiCallsPerDay: 500,
    allArticles: true,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTierPermissions(tier: Tier): TierPermissions {
  return TIER_CONFIG[tier] ?? TIER_CONFIG.free;
}

/**
 * Returns true if the user's tier allows viewing a model at zero-based index.
 * Free: index 0–1 visible. Pro/Analyst: all 6.
 */
export function canViewModel(tier: Tier, modelIndex: number): boolean {
  return modelIndex < getTierPermissions(tier).visibleModels;
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case 'free': return 'Free Plan';
    case 'pro': return 'Pro';
    case 'analyst': return 'Analyst';
  }
}
