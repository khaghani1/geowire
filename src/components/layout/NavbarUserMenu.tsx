'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

/**
 * Auth-aware section of the Navbar.
 * Logged out:  "Sign In" button  →  /en/auth/login
 * Logged in:   Avatar + email + <details> dropdown with Dashboard / Sign Out
 */
export function NavbarUserMenu() {
  const router = useRouter();
  const t = useTranslations('nav');
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      setLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/en');
  }

  // Placeholder while session loads — prevents layout shift
  if (!loaded) {
    return (
      <span style={{
        display: 'inline-block',
        width: 80,
        height: 28,
        borderRadius: '6px',
        background: 'var(--bg-tertiary)',
        opacity: 0.5,
      }} />
    );
  }

  // ── Unauthenticated ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <a
        href="/en/auth/login"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 14px',
          borderRadius: '6px',
          background: 'var(--accent)',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
      >
        {t('signIn')}
      </a>
    );
  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  const email = user.email ?? 'User';
  const initial = email[0].toUpperCase();

  return (
    <details style={{ position: 'relative' }}>
      <summary style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        cursor: 'pointer',
        listStyle: 'none',
        padding: '4px 8px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-tertiary)',
        transition: 'border-color 0.15s',
      }}>
        {/* Avatar */}
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
        }}>
          {initial}
        </div>
        {/* Email (truncated) */}
        <span style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          maxWidth: 120,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {email}
        </span>
        <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>▾</span>
      </summary>

      {/* Dropdown */}
      <div style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        minWidth: 180,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: '10px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        zIndex: 100,
      }}>
        <a
          href="/en/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
            transition: 'background 0.1s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-tertiary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
        >
          <span>📊</span> {t('userDashboard')}
        </a>
        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <button
          type="button"
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 14px',
            fontSize: '13px',
            color: 'var(--red)',
            fontFamily: 'var(--font-body)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 0.1s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,23,68,0.08)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <span>🚪</span> {t('signOut')}
        </button>
      </div>
    </details>
  );
}
