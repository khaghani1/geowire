'use client';

import { useRecessionScore } from '@/hooks/useRecessionScore';
import { GlassCard } from '@/components/ui/GlassCard';
import type { SignalLevel } from '@/lib/scoring/engine';

// ─── Display mapping ────────────────────────────────────────────────────────

interface FactorDisplay {
  name: string;
  status: string;
  signal: SignalLevel;
  color: string;
  indicator: string;
}

function signalToColor(signal: SignalLevel): string {
  switch (signal) {
    case 'low': return '#00C853';
    case 'elevated': return '#FFB300';
    case 'warning': return '#FF6D00';
    case 'recession': return '#FF1744';
    default: return '#00C853';
  }
}

function signalToIndicator(signal: SignalLevel): string {
  switch (signal) {
    case 'low': return '🟢';
    case 'elevated': return '🟡';
    case 'warning': return '🟠';
    case 'recession': return '🔴';
    default: return '🟢';
  }
}

// ─── Static fallback ────────────────────────────────────────────────────────

const STATIC_FACTORS: FactorDisplay[] = [
  { name: 'NY Fed Probit', status: 'Low probability', signal: 'low', color: '#00C853', indicator: '🟢' },
  { name: 'Sahm Rule', status: 'Not triggered', signal: 'low', color: '#00C853', indicator: '🟢' },
  { name: 'Hamilton NOPI', status: 'Not triggered', signal: 'low', color: '#00C853', indicator: '🟢' },
  { name: 'Philadelphia Fed Leading', status: 'Positive', signal: 'low', color: '#00C853', indicator: '🟢' },
  { name: 'Credit Spread', status: 'Normal', signal: 'low', color: '#00C853', indicator: '🟢' },
  { name: 'Composite Score', status: 'Low risk', signal: 'low', color: '#00C853', indicator: '🟢' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function RecessionFactorsLive() {
  const { data, isLoading, isError } = useRecessionScore();

  // Determine data source label
  const dataSourceLabel = isError || !data
    ? 'seed'
    : data.dataSource === 'live' ? 'live' : 'cached';

  // Build factors from API data or use static fallback
  let factors: FactorDisplay[];

  if (data?.models && data.models.length > 0) {
    factors = data.models.map((model) => {
      const signal = model.signal as SignalLevel;
      return {
        name: model.name.replace(' (NOPI)', '').replace(' Signal', ''),
        status: model.status,
        signal,
        color: signalToColor(signal),
        indicator: signalToIndicator(signal),
      };
    });
  } else {
    factors = STATIC_FACTORS;
  }

  return (
    <div>
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: '16px',
        letterSpacing: '-0.01em',
      }}>
        Recession Factors
      </h2>

      <GlassCard style={{ padding: '8px 0' }}>
        {/* Loading shimmer */}
        {isLoading && !data && (
          <div style={{ padding: '8px 20px' }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: '36px',
                  marginBottom: '6px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.03)',
                }}
              />
            ))}
          </div>
        )}

        {/* Factor rows */}
        {(!isLoading || data) && factors.map((factor, i) => (
          <div
            key={factor.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 20px',
              borderBottom: i === factors.length - 1 ? 'none' : '1px solid var(--border-subtle)',
            }}
          >
            <span style={{
              fontSize: '14px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
            }}>
              {factor.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '12px',
                color: factor.color,
                fontFamily: 'var(--font-data)',
                fontWeight: 500,
              }}>
                {factor.status}
              </span>
              <span style={{ fontSize: '14px' }} aria-label={factor.status}>
                {factor.indicator}
              </span>
            </div>
          </div>
        ))}

        {/* Data source micro-label */}
        <div style={{
          fontSize: '10px',
          color: 'var(--text-secondary)',
          opacity: 0.5,
          padding: '6px 20px 8px',
          fontFamily: 'var(--font-data)',
        }}>
          Data: {dataSourceLabel}
        </div>
      </GlassCard>
    </div>
  );
}
