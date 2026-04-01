/**
 * proxy.ts  ←  Next.js 16 middleware file (NOT middleware.ts)
 *
 * Responsibilities (in order):
 *  1. Refresh the Supabase session cookie on every request.
 *  2. Protect /[locale]/dashboard — redirect unauthenticated visitors to login.
 *  3. Hand off to next-intl middleware for locale routing.
 *
 * Routes NOT protected: /, /auth/*, /api/*
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

// ── next-intl middleware instance ─────────────────────────────────────────────
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// ── Protected path prefixes (after locale is stripped) ────────────────────────
const PROTECTED_PATHS = ['/dashboard'];

export async function proxy(request: NextRequest) {
  // ── Step 1: Refresh Supabase session ────────────────────────────────────────
  // Capture cookies that Supabase wants to update after session refresh.
  const pendingCookies: Array<{
    name: string;
    value: string;
    options?: Record<string, unknown>;
  }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          pendingCookies.push(...cookiesToSet);
        },
      },
    },
  );

  // getUser() validates + refreshes the JWT — do NOT use getSession() here
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Step 2: Route protection ─────────────────────────────────────────────────
  const { pathname } = request.nextUrl;
  const localePattern = `^/(${locales.join('|')})`;
  const pathWithoutLocale = pathname.replace(new RegExp(localePattern), '');

  const isProtected = PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p));

  if (isProtected && !user) {
    const localeMatch = pathname.match(new RegExp(localePattern));
    const locale = localeMatch ? localeMatch[1] : defaultLocale;
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Step 3: next-intl locale middleware ──────────────────────────────────────
  const response = intlMiddleware(request);

  // Merge any refreshed Supabase session cookies onto the intl response
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(
      name,
      value,
      options as Parameters<typeof response.cookies.set>[2],
    );
  });

  return response;
}

export const config = {
  matcher: [
    // Skip static files, images, and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt).*)',
  ],
};
