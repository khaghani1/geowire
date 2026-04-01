/**
 * GET /[locale]/auth/callback
 *
 * Supabase auth callback handler.
 * Exchanges the code or OTP token from the URL for a user session,
 * then redirects to the 'next' param (defaults to /en/dashboard).
 *
 * Called by:
 *  - Magic link emails (code in query string)
 *  - Google OAuth flow (code + state in query string)
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? `/${locale}/dashboard`;

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ensure 'next' is a relative path to prevent open-redirect attacks
      const redirectPath = next.startsWith('/') ? next : `/${locale}/dashboard`;
      return NextResponse.redirect(`${origin}${redirectPath}`);
    }

    console.error('[auth/callback] Code exchange error:', error.message);
  }

  // Auth failed — redirect to login with error indicator
  return NextResponse.redirect(
    `${origin}/${locale}/auth/login?error=auth_failed`,
  );
}
