'use client';

import { useTranslations } from 'next-intl';

/**
 * PaywallOverlay
 *
 * Glassmorphic blur overlay rendered on top of locked content.
 * Usage: wrap any JSX in <PaywallOverlay> to blur it for free-tier users.
 *
 * <div style={{ position: 'relative' }}>
 *   <LockedContent />
 *   {isLocked && <PaywallOverlay />}
 * </div>
 */

interface PaywallOverlayProps {
  /** CTA link — defaults to '#' until pricing page exists */
  upgradeHref?: string;
}

export function PaywallOverlay({ upgradeHref = '#' }: PaywallOverlayProps) {
  const t = useTranslations('paywall');

  return (
    <div
      aria-label={t('ariaLabel')}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        background: 'rgba(10,10,18,0.55)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        zIndex: 10,
      }}
    >
      {/* Lock icon */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'rgba(41,121,255,0.18)',
        border: '1px solid rgba(41,121,255,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
      }}>
        🔒
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginBottom: '4px',
        }}>
          {t('title')}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.4,
          maxWidth: 160,
        }}>
          {t('body')}
        </div>
      </div>

      {/* Upgrade CTA */}
      <a
        href={upgradeHref}
        style={{
          display: 'inline-block',
          marginTop: '2px',
          padding: '6px 16px',
          borderRadius: '6px',
          background: 'var(--accent)',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          boxShadow: '0 0 12px rgba(41,121,255,0.4)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
      >
        {t('cta')}
      </a>
    </div>
  );
}
