'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { GlassCard } from '@/components/ui/GlassCard';

// ── Types ────────────────────────────────────────────────────────────────────

interface ModelResult {
  model: string;
  name: string;
  probability: number;
  signal: string;
  inputValue: number | null;
  triggered: boolean;
  status: string;
}

interface RecessionScoreResponse {
  probability: number;
  models: ModelResult[];
  fetchedAt: string;
}

// ── Model → factor mapping ───────────────────────────────────────────────────

interface FactorDisplay {
  name: string;
  status: string;
  indicator: '🔴' | '🟡' | '🟢';
}

function modelToFactor(model: ModelResult): FactorDisplay {
  const indicator: '🔴' | '🟡' | '🟢' =
    model.triggered ? '🔴' :
    model.signal === 'elevated' || model.signal === 'warning' ? '🟡' :
    '🟢';

  return {
    name: model.name.replace(' (NOPI)', '').replace(' Signal', ''),
    status: model.status,
    indicator,
  };
}

// ── Static fallback (updated to current reality) ─────────────────────────────

const STATIC_FACTORS: FactorDisplay[] = [
  { name: 'NY Fed Probit', status: 'Low probability', indicator: '🟢' },
  { name: 'Sahm Rule', status: 'Not triggered', indicator: '🟢' },
  { name: 'Hamilton NOPI', status: 'Not triggered', indicator: '🟢' },
  { name: 'Philadelphia Fed Leading', status: 'Positive', indicator: '🟢' },
  { name: 'Credit Spread', status: 'Normal', indicator: '🟢' },
  { name: 'Composite Score', status: 'Low risk', indicator: '🟢' },
];

// ── Component ────────────────────────────────────────────────────────────────

export function HomeRecessionFactors() {
  const t = useTranslations('home');
  const [factors, setFactors] = useState<FactorDisplay[]>(STATIC_FACTORS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchScore() {
      try {
        const res = await fetch('/api/v1/recession-score', { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: RecessionScoreResponse = await res.json();
        if (!cancelled && json.models?.length > 0) {
          setFactors(json.models.map(modelToFactor));
          setIsLive(true);
        }
      } catch {
        // Keep static fallback
      }
    }

    fetchScore();
    return () => { cancelled = true; };
  }, []);

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
        {t('recessionFactors')}
      </h2>
      <GlassCard style={{ padding: '8px 0' }}>
        {factors.map((factor, i) => (
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
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-data)',
              }}>
                {factor.status}
              </span>
              <span style={{ fontSize: '14px' }} aria-label={factor.status}>
                {factor.indicator}
              </span>
            </div>
          </div>
        ))}
        {!isLive && (
          <div style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            opacity: 0.5,
            padding: '4px 20px 8px',
            fontFamily: 'var(--font-data)',
          }}>
            Static values — live data loading
          </div>
        )}
      </GlassCard>
    </div>
  );
}
