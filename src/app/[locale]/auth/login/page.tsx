'use client';

/**
 * Login page — magic link only.
 *
 * Google OAuth is intentionally omitted until OAuth credentials are
 * configured in Supabase. All UI strings are hardcoded (no next-intl
 * dependency) so the page never crashes due to missing translations.
 *
 * useSearchParams() is called directly in the page component — this is
 * the correct pattern for a 'use client' page in Next.js App Router.
 * Do NOT extract it into a sub-component wrapped in Suspense; that
 * pattern causes React 19 to unmount the entire tree on this route.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/en/dashboard';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect already-authenticated users
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => { if (data.user) router.replace(next); })
      .catch(() => { /* env vars absent in dev — ignore */ });
  }, [router, next]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const { error } = await createClient().auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${window.location.origin}/en/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      setStatus('sent');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  // ─── Styles (plain objects — no CSS variable dependency on this page) ─────────
  const S = {
    page: {
      minHeight: '100vh',
      background: '#0a0a0f',
      backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 35%, rgba(41,121,255,0.08) 0%, transparent 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    } as React.CSSProperties,

    card: {
      width: '100%',
      maxWidth: 400,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px',
      padding: '40px 36px',
      boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
    } as React.CSSProperties,

    input: {
      display: 'block',
      width: '100%',
      padding: '11px 14px',
      borderRadius: '10px',
      background: 'rgba(255,255,255,0.06)',
      border: `1.5px solid ${status === 'error' ? '#FF1744' : 'rgba(255,255,255,0.12)'}`,
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box' as const,
      marginBottom: status === 'error' ? '6px' : '16px',
      caretColor: '#00C853',
      fontFamily: 'inherit',
    } as React.CSSProperties,

    btn: {
      display: 'block',
      width: '100%',
      padding: '12px 16px',
      borderRadius: '10px',
      background: status === 'sending' ? 'rgba(0,200,83,0.55)' : '#00C853',
      border: 'none',
      color: '#ffffff',
      fontSize: '15px',
      fontWeight: 700,
      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
      boxShadow: status === 'sending' ? 'none' : '0 4px 20px rgba(0,200,83,0.25)',
      transition: 'background 0.15s',
      fontFamily: 'inherit',
      letterSpacing: '0.01em',
    } as React.CSSProperties,
  };

  return (
    <div style={S.page}>
      <div style={S.card}>

        {/* ── Brand header ───────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none" style={{ display: 'block', margin: '0 auto 12px' }}>
            <rect width="32" height="32" rx="8" fill="#0a0a0f"/>
            <rect width="32" height="32" rx="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            <polyline points="4,24 10,14 16,18 22,8 28,12" fill="none" stroke="#2979FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="28" cy="12" r="2.5" fill="#FF1744"/>
          </svg>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: '5px' }}>
            GeoWire
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Recession Intelligence
          </div>
        </div>

        {/* ── Heading ────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Sign in to GeoWire
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>
            Enter your email to receive a secure sign-in link
          </p>
        </div>

        {/* ── Sent confirmation ───────────────────────────────────────────── */}
        {status === 'sent' ? (
          <div style={{
            textAlign: 'center',
            padding: '24px 16px',
            borderRadius: '12px',
            background: 'rgba(0,200,83,0.08)',
            border: '1px solid rgba(0,200,83,0.22)',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✉️</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#00C853', marginBottom: '8px' }}>
              Check your inbox
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>
              We sent a sign-in link to <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{email}</strong>.
              Click it to sign in — no password needed.
            </div>
          </div>
        ) : (
          /* ── Magic link form ─────────────────────────────────────────── */
          <form onSubmit={handleSubmit} noValidate>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              Email address
            </label>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={S.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,200,83,0.5)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = status === 'error' ? '#FF1744' : 'rgba(255,255,255,0.12)'; }}
            />

            {status === 'error' && (
              <div style={{ fontSize: '12px', color: '#FF1744', marginBottom: '14px', lineHeight: 1.4 }}>
                {errorMsg}
              </div>
            )}

            <button type="submit" disabled={status === 'sending'} style={S.btn}>
              {status === 'sending' ? 'Sending…' : 'Send Magic Link'}
            </button>
          </form>
        )}

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <p style={{
          marginTop: '20px',
          marginBottom: 0,
          fontSize: '12px',
          color: 'rgba(255,255,255,0.22)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          No password needed — we&apos;ll email you a secure link.
        </p>
      </div>
    </div>
  );
}
