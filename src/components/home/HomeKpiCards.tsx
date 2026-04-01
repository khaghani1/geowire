'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { GlassCard } from '@/components/ui/GlassCard';

// ── Types matching CompositeResult from scoring engine ────────────────────────

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
  confidence: string;
  signal: string;
  models: ModelResult[];
  chauvetPigerProb: number | null;
  divergenceWarning: boolean;
  fetchedAt: string;
  dataSource: string;
}

// ── Signal → accent color mapping ────────────────────────────────────────────

function signalToAccent(signal: string): string {
  switch (signal) {
    case 'recession':
    case 'warning':
      return 'var(--red)';
    case 'elevated':
      return 'var(--amber)';
    default:
      return 'var(--green, #4caf50)';
  }
}

function signalToLabel(signal: string): string {
  switch (signal) {
    case 'recession':
      return 'RECESSION';
    case 'warning':
      return 'WARNING';
    case 'elevated':
      return 'ELEVATED';
    default:
      return 'LOW RISK';
  }
}

// ── Shimmer placeholder ──────────────────────────────────────────────────────

function KpiSkeleton() {
  return (
    <GlassCard style={{ padding: '20px 20px 16px' }}>
      <div style={{ width: '60%', height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />
      <div style={{ width: '40%', height: 32, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 10 }} />
      <div style={{ width: '50%', height: 10, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
    </GlassCard>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function HomeKpiCards() {
  const t = useTranslations('home');
  const [data, setData] = useState<RecessionScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchScore() {
      try {
        const res = await fetch('/api/v1/recession-score', { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchScore();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
    );
  }

  // Format timestamp
  const timestamp = data?.fetchedAt
    ? new Date(data.fetchedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Apr 2026';

  // Live recession probability
  const probability = data ? `${data.probability.toFixed(1)}%` : t('kpi.recessionProbability.value');
  const signalLabel = data ? signalToLabel(data.signal) : t('kpi.recessionProbability.sublabel');
  const recAccent = data ? signalToAccent(data.signal) : 'var(--amber)';
  const isStatic = error || !data;

  return (
    <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {/* Recession Probability — LIVE */}
      <KpiCard
        label={t('kpi.recessionProbability.label')}
        value={probability}
        sublabel={`${signalLabel} · 12-month horizon`}
        accentColor={recAccent}
        timestamp={isStatic ? `${timestamp} (static)` : `As of ${timestamp}`}
      />

      {/* Oil Price Impact — static for now */}
      <KpiCard
        label={t('kpi.oilPriceImpact.label')}
        value={t('kpi.oilPriceImpact.value')}
        sublabel={t('kpi.oilPriceImpact.sublabel')}
        accentColor="var(--red)"
        timestamp={`As of ${timestamp}`}
      />

      {/* Supply Chain Stress — static for now */}
      <KpiCard
        label={t('kpi.supplyChainStress.label')}
        value={t('kpi.supplyChainStress.value')}
        sublabel={t('kpi.supplyChainStress.sublabel')}
        accentColor="var(--amber)"
        timestamp={`As of ${timestamp}`}
      />

      {/* Market Sentiment — static for now */}
      <KpiCard
        label={t('kpi.marketSentiment.label')}
        value={t('kpi.marketSentiment.value')}
        sublabel={t('kpi.marketSentiment.sublabel')}
        accentColor="var(--red)"
        timestamp={`As of ${timestamp}`}
      />
    </div>
  );
}

// ── KPI card sub-component ───────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sublabel,
  accentColor,
  timestamp,
}: {
  label: string;
  value: string;
  sublabel: string;
  accentColor: string;
  timestamp: string;
}) {
  return (
    <GlassCard
      accentColor={accentColor}
      className="kpi-enter"
      style={{ padding: '20px 20px 16px' }}
    >
      <div style={{
        fontSize: '12px',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '10px',
      }}>
        {label}
      </div>
      <div className="data-value" style={{
        fontSize: '36px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: 1,
        marginBottom: '6px',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        marginBottom: '4px',
      }}>
        {sublabel}
      </div>
      <div style={{
        fontSize: '10px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-data)',
        opacity: 0.6,
      }}>
        {timestamp}
      </div>
    </GlassCard>
  );
}
