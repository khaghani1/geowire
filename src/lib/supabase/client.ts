import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client.
 * Call inside Client Components or custom hooks.
 * Reads/writes the session via cookies (handled by @supabase/ssr).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
