'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tier } from '@/lib/auth/permissions';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  tier: Tier;
  api_calls_today: number;
  api_calls_reset_at: string;
}

export interface UseProfileResult {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

/**
 * Client-side hook that reads the current Supabase session and the
 * corresponding profile row (tier, api_calls_today, etc.).
 *
 * Returns null for both user and profile when unauthenticated.
 */
export function useProfile(): UseProfileResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('tier, api_calls_today, api_calls_reset_at')
          .eq('id', user.id)
          .maybeSingle<Profile>();

        if (!error && data) {
          setProfile(data);
        } else {
          // Fallback: profile not created yet (race between trigger and first load)
          setProfile({ tier: 'free', api_calls_today: 0, api_calls_reset_at: new Date().toISOString() });
        }
      }

      setLoading(false);
    }

    load();

    // Keep user state in sync with auth changes (sign-in / sign-out events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading };
}
