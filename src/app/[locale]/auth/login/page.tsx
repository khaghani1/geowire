'use client';

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
  const [oauthLoading, setOauthLoading] = useState(false);

  // If already logged in, redirect immediately
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(next);
    });
  }, [router, next]);

  // ── Magic link ─────────────────────────────────────────────────────────────
  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('sending');
    setErrorMsg('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/en/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('sent');
    }
  }

  // ── Google OAuth ───────────────────────────────────────────────────────────
  async function handleGoogle() {
    setOauthLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/en/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // OAuth redirects away — no need to reset loading state
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>

        {/* Logo + wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>📡</div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            GeoWire
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            marginTop: '4px',
          }}>
            Recession Intelligence Platform
          </div>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '17px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          Sign in to your account
        </h1>

        {/* Google OAuth button */}
        <button
          type="button"
          disabled={oauthLoading}
          onClick={handleGoogle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: '8px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
            cursor: oauthLoading ? 'not-allowed' : 'pointer',
            opacity: oauthLoading ? 0.6 : 1,
            transition: 'opacity 0.15s, border-color 0.15s',
            marginBottom: '16px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          {oauthLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        {/* Magic link form */}
        {status === 'sent' ? (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            borderRadius: '8px',
            background: 'rgba(0,200,83,0.08)',
            border: '1px solid rgba(0,200,83,0.2)',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✉️</div>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--green)',
              fontFamily: 'var(--font-body)',
              marginBottom: '4px',
            }}>
              Check your inbox
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.5,
            }}>
              We sent a magic link to <strong>{email}</strong>.<br />
              Click it to sign in — no password needed.
            </div>
          </div>
        ) : (
          <form onSubmit={handleMagicLink}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              marginBottom: '6px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                border: `1px solid ${status === 'error' ? 'var(--red)' : 'var(--border-medium)'}`,
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '8px',
                transition: 'border-color 0.15s',
              }}
            />

            {status === 'error' && (
              <div style={{
                fontSize: '12px',
                color: 'var(--red)',
                fontFamily: 'var(--font-body)',
                marginBottom: '8px',
              }}>
                {errorMsg || 'Something went wrong. Try again.'}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'var(--accent)',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                opacity: status === 'sending' ? 0.65 : 1,
                transition: 'opacity 0.15s',
                letterSpacing: '0.02em',
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Magic Link'}
            </button>
          </form>
        )}

        {/* Footer note */}
        <p style={{
          marginTop: '20px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          By signing in you agree to the GeoWire Terms of Service.
          <br />No password required — we use secure magic links.
        </p>
      </div>
    </div>
  );
}
