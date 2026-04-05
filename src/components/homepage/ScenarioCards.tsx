'use client';

import { useTranslations } from 'next-intl';

// ─── Scenario data keys ──────────────────────────────────────────────────────

type ScenarioKey = 'contained' | 'partial' | 'fullClosure' | 'diplomatic';

interface ScenarioConfig {
  key: ScenarioKey;
  borderColor: string;
  glowColor: string;
}

const SCENARIOS: ScenarioConfig[] = [
  { key: 'contained',    borderColor: '#00C853', glowColor: 'rgba(0,200,83,0.15)' },
  { key: 'partial',      borderColor: '#FFB300', glowColor: 'rgba(255,179,0,0.15)' },
  { key: 'fullClosure',  borderColor: '#FF1744', glowColor: 'rgba(255,23,68,0.15)' },
  { key: 'diplomatic',   borderColor: '#00C853', glowColor: 'rgba(0,200,83,0.15)' },
];

const METRIC_KEYS = ['oilRange', 'shippingStress', 'inflationImpulse', 'recessionDelta'] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function ScenarioCards() {
  const t = useTranslations('scenarios');

  return (
    <div>
      {/* Section heading */}
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '6px',
        letterSpacing: '-0.01em',
        textAlign: 'center',
      }}>
        {t('heading')}
      </h2>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '20px',
        lineHeight: 1.5,
      }}>
        {t('subheading')}
      </p>

      {/* Card grid */}
      <div className="scenario-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}>
        {SCENARIOS.map((scenario) => (
          <ScenarioCard key={scenario.key} config={scenario} t={t} />
        ))}
      </div>

      {/* Hamilton attribution */}
      <p style={{
        fontSize: '11px',
        color: 'var(--text-secondary)',
        opacity: 0.5,
        textAlign: 'center',
        marginTop: '12px',
        fontFamily: 'var(--font-body)',
        lineHeight: 1.4,
      }}>
        Projected ranges based on Hamilton (2003) oil price elasticity model
      </p>

      {/* Responsive: 2x2 on tablet, 1 col on phone */}
      <style>{`
        @media (max-width: 1024px) {
          .scenario-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .scenario-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Individual card ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ScenarioCard({ config, t }: { config: ScenarioConfig; t: any }) {
  const { key, borderColor, glowColor } = config;

  return (
    <div
      className="scenario-card"
      style={{
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: `3px solid ${borderColor}`,
        padding: '16px',
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}`;
        e.currentTarget.style.borderColor = `${borderColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Scenario name */}
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '14px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '12px',
        lineHeight: 1.3,
      }}>
        {t(`${key}.name`)}
      </h3>

      {/* Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
        {METRIC_KEYS.map((metricKey) => (
          <div key={metricKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              flexShrink: 0,
            }}>
              {t(metricKey)}
            </span>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-data)',
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-primary)',
              fontWeight: 600,
              textAlign: 'right',
            }}>
              {t(`${key}.${metricKey}`)}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <p style={{
        fontSize: '11.5px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        lineHeight: 1.5,
        opacity: 0.75,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        paddingTop: '10px',
        margin: 0,
      }}>
        {t(`${key}.summary`)}
      </p>
    </div>
  );
}
