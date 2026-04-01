'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChangeItem {
  id: string;
  label: string;
  current: string;
  delta: string;
  context: string;
  direction: 'improving' | 'worsening' | 'neutral';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDelta(prev: number, curr: number, unit: string): { delta: string; direction: 'improving' | 'worsening' | 'neutral' } {
  const diff = curr - prev;
  const absDiff = Math.abs(diff);

  if (absDiff < 0.001) return { delta: 'unchanged', direction: 'neutral' };

  const arrow = diff > 0 ? '↑' : '↓';
  let formatted: string;

  if (unit === 'Percent' || unit === '%') {
    formatted = `${arrow} ${absDiff.toFixed(2)}pp to ${curr.toFixed(2)}%`;
  } else if (unit.includes('Dollar') || unit.includes('$')) {
    formatted = `${arrow} $${absDiff.toFixed(2)} to $${curr.toFixed(2)}`;
  } else {
    formatted = `${arrow} ${absDiff.toFixed(2)} to ${curr.toFixed(2)}`;
  }

  return { delta: formatted, direction: diff > 0 ? 'worsening' : 'improving' };
}

// Series-specific context notes based on thresholds
function getContext(seriesId: string, value: number, diff: number): string {
  switch (seriesId) {
    case 'UNRATE':
      return value >= 4.5
        ? 'approaching Sahm Rule trigger'
        : diff > 0 ? 'labor market softening' : 'labor market stable';
    case 'DCOILWTICO':
      return value > 100
        ? 'above Hamilton shock threshold'
        : value > 80 ? 'elevated oil prices' : 'oil prices normalizing';
    case 'T10Y3M':
      return value > 0
        ? 'yield curve un-inverting'
        : 'yield curve still inverted';
    case 'T10Y2Y':
      return value > 0
        ? 'curve normalizing'
        : 'inversion persists';
    case 'BAMLH0A0HYM2':
      return value > 5.0
        ? 'credit stress elevated'
        : 'credit conditions normal';
    case 'SAHMCURRENT':
      return value >= 0.5
        ? 'Sahm Rule TRIGGERED'
        : value >= 0.4 ? 'near trigger at 0.50pp' : 'below trigger';
    case 'UMCSENT':
      return value < 60
        ? 'consumer confidence severely depressed'
        : value < 75 ? 'sentiment deteriorating' : 'sentiment stable';
    case 'ICSA':
      return value > 250000
        ? 'initial claims elevated'
        : 'claims at healthy levels';
    case 'USSLIND':
      return value < 0
        ? 'leading index negative — recession signal'
        : 'leading index positive — expansion signal';
    default:
      return '';
  }
}

// Which direction is "bad" for each series
function getDirectionSense(seriesId: string, diff: number): 'improving' | 'worsening' | 'neutral' {
  if (Math.abs(diff) < 0.001) return 'neutral';

  // Series where UP is bad
  const upIsBad = ['UNRATE', 'DCOILWTICO', 'BAMLH0A0HYM2', 'SAHMCURRENT', 'ICSA', 'T10YFF'];
  // Series where DOWN is bad
  const downIsBad = ['UMCSENT', 'USSLIND', 'GDPC1'];
  // Yield spreads: negative is bad (inversion), going more negative is worse
  const spreadSeries = ['T10Y2Y', 'T10Y3M'];

  if (upIsBad.includes(seriesId)) return diff > 0 ? 'worsening' : 'improving';
  if (downIsBad.includes(seriesId)) return diff < 0 ? 'worsening' : 'improving';
  if (spreadSeries.includes(seriesId)) return diff > 0 ? 'improving' : 'worsening';

  return 'neutral';
}

const LABEL_MAP: Record<string, string> = {
  T10Y2Y:        '10Y-2Y Spread',
  T10Y3M:        '10Y-3M Spread',
  T10YFF:        '10Y-FFR Spread',
  UNRATE:        'Unemployment',
  ICSA:          'Initial Claims',
  SAHMCURRENT:   'Sahm Rule',
  UMCSENT:       'Consumer Sentiment',
  USSLIND:       'Philly Fed Leading',
  RECPROUSM156N: 'Chauvet-Piger',
  BAMLH0A0HYM2:  'HY Credit Spread',
  DCOILWTICO:    'WTI Crude',
  CPIAUCSL:      'CPI',
  GDPC1:         'Real GDP',
};

// Priority order for display
const PRIORITY_SERIES = [
  'UNRATE', 'DCOILWTICO', 'T10Y3M', 'BAMLH0A0HYM2', 'SAHMCURRENT',
  'UMCSENT', 'USSLIND', 'T10Y2Y', 'ICSA', 'GDPC1',
];

// ─── Component ───────────────────────────────────────────────────────────────

export function WhatChanged({ isLoading }: { isLoading?: boolean }) {
  const t = useTranslations('whatChanged');
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [compositeInfo, setCompositeInfo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/v1/recession-score');
        if (!res.ok) return;
        const data = await res.json();

        if (cancelled) return;

        // Build changes from model data
        const items: ChangeItem[] = [];

        // Process each model's input values — compare current vs what we can derive
        if (data.models && Array.isArray(data.models)) {
          for (const model of data.models) {
            if (model.seriesId && model.currentValue !== undefined && model.previousValue !== undefined) {
              const seriesId = model.seriesId;
              const curr = model.currentValue;
              const prev = model.previousValue;
              const diff = curr - prev;
              const unit = model.unit || '';

              if (Math.abs(diff) < 0.001) continue;

              items.push({
                id: seriesId,
                label: LABEL_MAP[seriesId] || seriesId,
                current: unit.includes('%') || unit === 'Percent' ? `${curr.toFixed(2)}%` : curr.toFixed(2),
                delta: formatDelta(prev, curr, unit).delta,
                context: getContext(seriesId, curr, diff),
                direction: getDirectionSense(seriesId, diff),
              });
            }
          }
        }

        // If we have no model-level deltas, try fetching individual series
        if (items.length === 0) {
          // Fetch a few key series to compute deltas
          const keySeries = ['UNRATE', 'DCOILWTICO', 'T10Y3M', 'BAMLH0A0HYM2', 'SAHMCURRENT', 'UMCSENT'];
          const fetches = await Promise.allSettled(
            keySeries.map((id) => fetch(`/api/v1/fred/${id}`).then((r) => r.json()))
          );

          fetches.forEach((result, idx) => {
            if (result.status !== 'fulfilled') return;
            const series = result.value;
            if (!series?.observations?.length || series.observations.length < 2) return;

            const obs = series.observations;
            const curr = obs[obs.length - 1]?.value;
            const prev = obs[obs.length - 2]?.value;
            if (curr == null || prev == null) return;

            const seriesId = keySeries[idx];
            const diff = curr - prev;
            if (Math.abs(diff) < 0.001) return;

            items.push({
              id: seriesId,
              label: LABEL_MAP[seriesId] || seriesId,
              current: series.unit?.includes('%') ? `${curr.toFixed(2)}%` : curr.toFixed(2),
              delta: formatDelta(prev, curr, series.unit || '').delta,
              context: getContext(seriesId, curr, diff),
              direction: getDirectionSense(seriesId, diff),
            });
          });
        }

        // Sort by priority
        items.sort((a, b) => {
          const ai = PRIORITY_SERIES.indexOf(a.id);
          const bi = PRIORITY_SERIES.indexOf(b.id);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });

        // Add composite score line
        if (data.probability !== undefined) {
          const prob = data.probability;
          const signal = data.signal || 'low';
          setCompositeInfo(
            `Composite Score: ${prob.toFixed(1)}% (${signal.toUpperCase()})`
          );
        }

        setChanges(items.slice(0, 6));
        setLoaded(true);
      } catch {
        setLoaded(true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const directionColor = (dir: 'improving' | 'worsening' | 'neutral') => {
    if (dir === 'improving') return '#00C853';
    if (dir === 'worsening') return '#FF1744';
    return 'rgba(255,255,255,0.5)';
  };

  const directionArrow = (dir: 'improving' | 'worsening' | 'neutral') => {
    if (dir === 'improving') return '▲';
    if (dir === 'worsening') return '▼';
    return '●';
  };

  // Skeleton
  if (isLoading || (!loaded && changes.length === 0)) {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ width: 120, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ width: 50, height: 18, borderRadius: 10, background: 'rgba(255,255,255,0.04)' }} />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ height: 36, marginBottom: 6, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px' }}>🕐</span>
          <span className="gw-panel-label" style={{ margin: 0 }}>{t('title')}</span>
        </div>
        <span style={{
          fontSize: '10px',
          fontFamily: 'var(--font-data)',
          padding: '3px 8px',
          borderRadius: '10px',
          background: 'rgba(41,121,255,0.1)',
          color: 'var(--accent)',
          fontWeight: 600,
        }}>
          {t('badge')}
        </span>
      </div>

      {/* Change items */}
      {changes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {changes.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span style={{
                fontSize: '10px',
                color: directionColor(item.direction),
                fontWeight: 700,
                marginTop: '2px',
                flexShrink: 0,
                width: '12px',
                textAlign: 'center',
              }}>
                {directionArrow(item.direction)}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-data)',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                }}>
                  <strong style={{ color: directionColor(item.direction) }}>{item.label}</strong>
                  {' '}{item.delta}
                </div>
                {item.context && (
                  <div style={{
                    fontSize: '10.5px',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    marginTop: '1px',
                    opacity: 0.7,
                  }}>
                    {item.context}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Composite score summary */}
          {compositeInfo && (
            <div style={{
              marginTop: '6px',
              padding: '8px 10px',
              borderRadius: '6px',
              background: 'rgba(41,121,255,0.06)',
              border: '1px solid rgba(41,121,255,0.15)',
              fontSize: '12px',
              fontFamily: 'var(--font-data)',
              fontWeight: 600,
              color: 'var(--accent)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              📊 {compositeInfo}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          padding: '12px 0',
        }}>
          {t('noChanges')}
        </div>
      )}
    </div>
  );
}
