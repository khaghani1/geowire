/**
 * Rate limiting helpers for /api/v1/recession-score.
 *
 * Uses the Supabase admin client (service role) to read/write
 * profiles.api_calls_today and profiles.api_calls_reset_at.
 * The counter resets once per calendar day (UTC).
 */

import { createAdminClient } from '@/lib/supabase/server';
import { getTierPermissions, type Tier } from '@/lib/auth/permissions';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  tier: Tier;
  resetAt: string;
}

interface ProfileRow {
  tier: string;
  api_calls_today: number;
  api_calls_reset_at: string;
}

/**
 * Check the current user's daily rate limit and increment if allowed.
 * Returns { allowed: true } with remaining calls, or { allowed: false }
 * when the daily limit is exceeded.
 *
 * If the profile row is missing it is auto-created with free tier defaults.
 */
export async function checkAndIncrementRateLimit(
  userId: string,
): Promise<RateLimitResult> {
  const admin = createAdminClient();

  // ── Fetch profile ─────────────────────────────────────────────────────────
  const { data: profile, error } = await admin
    .from('profiles')
    .select('tier, api_calls_today, api_calls_reset_at')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    console.error('[rateLimit] profile fetch error:', error.message);
    // Fail open — don't block legitimate users due to DB errors
    return { allowed: true, remaining: 9, tier: 'free', resetAt: new Date().toISOString() };
  }

  // ── Auto-create missing profile ───────────────────────────────────────────
  if (!profile) {
    const now = new Date().toISOString();
    await admin.from('profiles').insert({ id: userId });
    return { allowed: true, remaining: 9, tier: 'free', resetAt: now };
  }

  const tier = (profile.tier ?? 'free') as Tier;
  const { apiCallsPerDay } = getTierPermissions(tier);

  // ── Daily reset check ─────────────────────────────────────────────────────
  const now = new Date();
  const resetAt = new Date(profile.api_calls_reset_at);
  const msPerDay = 24 * 60 * 60 * 1000;
  const needsReset = now.getTime() - resetAt.getTime() >= msPerDay;

  let callsToday = profile.api_calls_today;

  if (needsReset) {
    const nowIso = now.toISOString();
    await admin
      .from('profiles')
      .update({ api_calls_today: 0, api_calls_reset_at: nowIso })
      .eq('id', userId);
    callsToday = 0;
  }

  // ── Limit check ───────────────────────────────────────────────────────────
  if (callsToday >= apiCallsPerDay) {
    return {
      allowed: false,
      remaining: 0,
      tier,
      resetAt: new Date(resetAt.getTime() + msPerDay).toISOString(),
    };
  }

  // ── Increment ─────────────────────────────────────────────────────────────
  await admin
    .from('profiles')
    .update({ api_calls_today: callsToday + 1 })
    .eq('id', userId);

  return {
    allowed: true,
    remaining: apiCallsPerDay - callsToday - 1,
    tier,
    resetAt: new Date(resetAt.getTime() + msPerDay).toISOString(),
  };
}
