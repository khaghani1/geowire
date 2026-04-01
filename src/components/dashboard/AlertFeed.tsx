'use client';

import { Skeleton } from '@/components/ui/Skeleton';

// ─── Alert data ───────────────────────────────────────────────────────────────

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  timestamp: string;
  summary: string;
}

const HARDCODED_ALERTS: Alert[] = [
  {
    id: 'oil-shock-2026',
    severity: 'critical',
    title: 'Hamilton Oil-Shock Threshold Breached',
    timestamp: 'Apr 1, 2026 · 09:14',
    summary: 'WTI crude has exceeded its 36-month maximum. Hamilton NOPI model signals elevated recession risk within 12 months.',
  },
  {
    id: 'yield-un-inversion',
    severity: 'high',
    title: 'Yield Curve Un-Inverting — Watch for Bear Steepener',
    timestamp: 'Mar 31, 2026 · 16:30',
    summary: '10Y-3M spread turned positive (+0.60%). Historical pattern: recession often arrives after the curve steepens from inversion.',
  },
  {
    id: 'sahm-below-threshold',
    severity: 'medium',
    title: 'Sahm Rule at 0.43pp — Below 0.50 Trigger',
    timestamp: 'Mar 28, 2026 · 12:00',
    summary: 'SAHMCURRENT sits at 0.43pp. The 0.50pp recession trigger has not been crossed, but the trend warrants monitoring.',
  },
  {
    id: 'credit-spreads-stable',
    severity: 'low',
    title: 'HY Spreads Stable Below 3.0%',
    timestamp: 'Mar 27, 2026 · 08:00',
    summary: 'ICE BofA HY OAS at 2.96%. Credit markets remain complacent relative to equity and rates signals.',
  },
  {
    id: 'philly-fed-positive',
    severity: 'low',
    title: 'Philadelphia Fed Leading Index Positive for 3rd Month',
    timestamp: 'Mar 25, 2026 · 10:00',
    summary: 'USSLIND (Philadelphia Fed Leading Index) remains positive at +0.42%, providing a countervailing signal to yield curve models.',
  },
  {
    id: 'tariff-escalation',
    severity: 'high',
    title: 'New Tariff Tranche Expands to Industrial Inputs',
    timestamp: 'Mar 22, 2026 · 14:45',
    summary: 'The latest tariff round covers steel, aluminum, and electronic components — increasing supply-chain inflation risk.',
  },
  {
    id: 'gdp-revision',
    severity: 'medium',
    title: 'Q4 2025 Real GDP Revised Up to +2.1% Annualized',
    timestamp: 'Mar 20, 2026 · 09:30',
    summary: 'The BEA revision reduces recession probability near-term. However, leading indicators continue to soften.',
  },
  {
    id: 'michigan-sentiment',
    severity: 'medium',
    title: 'Michigan Consumer Sentiment Falls to 74.0',
    timestamp: 'Mar 14, 2026 · 10:00',
    summary: 'Consumers increasingly cite inflation and trade uncertainty. Sentiment is a coincident indicator of economic stress.',
  },
];

// ─── Color helpers ────────────────────────────────────────────────────────────

function severityStyles(severity: AlertSeverity): { bg: string; text: string; label: string } {
  switch (severity) {
    case 'critical': return { bg: 'rgba(255,23,68,0.15)', text: '#FF1744', label: 'CRITICAL' };
    case 'high':     return { bg: 'rgba(255,109,0,0.15)', text: '#FF6D00', label: 'HIGH' };
    case 'medium':   return { bg: 'rgba(255,214,0,0.12)', text: '#FFD600', label: 'MEDIUM' };
    case 'low':      return { bg: 'rgba(0,200,83,0.10)', text: '#00C853', label: 'LOW' };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AlertFeedProps {
  isLoading?: boolean;
}

export function AlertFeed({ isLoading = false }: AlertFeedProps) {
  return (
    <div style={{ padding: '16px' }}>
      <div className="gw-panel-label" style={{ marginBottom: '10px' }}>
        Alert Feed
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
          {HARDCODED_ALERTS.map((alert, i) => {
            const s = severityStyles(alert.severity);
            return (
              <div
                key={alert.id}
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
                    {s.label}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-data)', whiteSpace: 'nowrap' }}>
                    {alert.timestamp}
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
                  {alert.title}
                </div>
                {/* Summary */}
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.45,
                }}>
                  {alert.summary}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
