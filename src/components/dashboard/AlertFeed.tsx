'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/Skeleton';

// ─── Alert data ───────────────────────────────────────────────────────────────

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

// Alert IDs match the keys in en.json → alertFeed.alerts.*
const ALERT_ORDER: { id: string; severity: AlertSeverity }[] = [
  { id: 'oilShock2026',         severity: 'critical' },
  { id: 'yieldUnInversion',     severity: 'high' },
  { id: 'sahmBelowThreshold',   severity: 'medium' },
  { id: 'creditSpreadsStable',  severity: 'low' },
  { id: 'phillyFedPositive',    severity: 'low' },
  { id: 'tariffEscalation',     severity: 'high' },
  { id: 'gdpRevision',          severity: 'medium' },
  { id: 'michiganSentiment',    severity: 'medium' },
];

// ─── Color helpers ────────────────────────────────────────────────────────────

function severityStyles(severity: AlertSeverity): { bg: string; text: string } {
  switch (severity) {
    case 'critical': return { bg: 'rgba(255,23,68,0.15)',  text: '#FF1744' };
    case 'high':     return { bg: 'rgba(255,109,0,0.15)', text: '#FF6D00' };
    case 'medium':   return { bg: 'rgba(255,214,0,0.12)', text: '#FFD600' };
    case 'low':      return { bg: 'rgba(0,200,83,0.10)',  text: '#00C853' };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AlertFeedProps {
  isLoading?: boolean;
}

export function AlertFeed({ isLoading = false }: AlertFeedProps) {
  const t = useTranslations('alertFeed');

  return (
    <div style={{ padding: '16px' }}>
      <div className="gw-panel-label" style={{ marginBottom: '10px' }}>
        {t('panelLabel')}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={68} borderRadius="8px" />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: '420px',
            overflowY: 'auto',
            paddingRight: '2px',
          }}
        >
          {ALERT_ORDER.map(({ id, severity }) => {
            const s = severityStyles(severity);
            return (
              <div
                key={id}
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                }}
              >
                {/* Top row: badge + timestamp */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '5px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '1px 6px',
                    borderRadius: '3px',
                    background: s.bg,
                    color: s.text,
                    fontSize: '9.5px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-data)',
                    letterSpacing: '0.08em',
                  }}>
                    {t(`severity.${severity}`)}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-data)', whiteSpace: 'nowrap' }}>
                    {t(`alerts.${id}.timestamp`)}
                  </span>
                </div>
                {/* Title */}
                <div style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1.3,
                  marginBottom: '4px',
                }}>
                  {t(`alerts.${id}.title`)}
                </div>
                {/* Summary */}
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.45,
                }}>
                  {t(`alerts.${id}.summary`)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
