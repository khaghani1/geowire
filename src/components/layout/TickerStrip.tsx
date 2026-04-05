'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TickerItem {
  label: string;
  value: string;
  change?: string;      // e.g. "▼2.38 (-2.3%)"
  direction?: 'up' | 'down' | 'neutral';
  isStatus?: boolean;   // For non-numeric items like "Recession Risk"
}

// ─── FRED series we can fetch live ───────────────────────────────────────────

interface FredSeries {
  id: string;
  label: string;
  format: (val: number, prev?: number) => TickerItem;
}

function pctChange(curr: number, prev?: number): { change?: string; direction: 'up' | 'down' | 'neutral' } {
  if (prev === undefined || prev === 0) return { direction: 'neutral' };
  const diff = curr - prev;
  const pct = (diff / prev) * 100;
  const arrow = diff >= 0 ? '▲' : '▼';
  const sign = diff >= 0 ? '+' : '';
  return {
    change: `${arrow}${Math.abs(diff).toFixed(2)} (${sign}${pct.toFixed(1)}%)`,
    direction: diff >= 0 ? 'up' : 'down',
  };
}

const FRED_SERIES: FredSeries[] = [
  {
    id: 'DCOILWTICO',
    label: 'WTI Crude',
    format: (val, prev) => ({
      label: 'WTI Crude',
      value: `$${val.toFixed(2)}`,
      ...pctChange(val, prev),
    }),
  },
  {
    id: 'T10Y3M',
    label: '10Y-3M Spread',
    format: (val) => ({
      label: '10Y-3M Spread',
      value: `${val.toFixed(2)}%`,
      direction: val < 0 ? 'down' : 'up',
    }),
  },
  {
    id: 'BAMLH0A0HYM2',
    label: 'Credit Spread',
    format: (val, prev) => ({
      label: 'Credit Spread',
      value: `${val.toFixed(2)}%`,
      ...pctChange(val, prev),
    }),
  },
  {
    id: 'ICSA',
    label: 'Jobless Claims',
    format: (val, prev) => ({
      label: 'Jobless Claims',
      value: `${(val / 1000).toFixed(0)}K`,
      ...pctChange(val, prev),
    }),
  },
  {
    id: 'UMCSENT',
    label: 'Consumer Sentiment',
    format: (val, prev) => ({
      label: 'Consumer Sent.',
      value: val.toFixed(1),
      ...pctChange(val, prev),
    }),
  },
  {
    id: 'UNRATE',
    label: 'Unemployment',
    format: (val) => ({
      label: 'Unemployment',
      value: `${val.toFixed(1)}%`,
      direction: val > 5 ? 'down' : val > 4 ? 'neutral' : 'up',
    }),
  },
];

// ─── Static fallback (shown until live data loads) ───────────────────────────

const STATIC_TICKER: TickerItem[] = [
  { label: 'WTI Crude',       value: '—', direction: 'neutral' },
  { label: '10Y-3M Spread',   value: '—', direction: 'neutral' },
  { label: 'Credit Spread',   value: '—', direction: 'neutral' },
  { label: 'Jobless Claims',  value: '—', direction: 'neutral' },
  { label: 'Consumer Sent.',   value: '—', direction: 'neutral' },
  { label: 'Unemployment',    value: '—', direction: 'neutral' },
  { label: 'Recession Risk',  value: '—', isStatus: true, direction: 'neutral' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLastTwo(obs: { date: string; value: number | null }[]): { curr: number; prev?: number } | null {
  const valid = obs.filter((o) => o.value !== null);
  if (valid.length === 0) return null;
  const curr = valid[valid.length - 1].value!;
  const prev = valid.length >= 2 ? valid[valid.length - 2].value! : undefined;
  return { curr, prev };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TickerStrip() {
  const t = useTranslations('ticker');
  const [items, setItems] = useState<TickerItem[]>(STATIC_TICKER);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Fetch all FRED series + recession score in parallel
        const [scoreRes, ...fredResults] = await Promise.all([
          fetch('/api/v1/recession-score'),
          ...FRED_SERIES.map((s) => fetch(`/api/v1/fred/${s.id}`)),
        ]);

        if (cancelled) return;

        const tickerItems: TickerItem[] = [];

        // Process each FRED series
        for (let i = 0; i < FRED_SERIES.length; i++) {
          const series = FRED_SERIES[i];
          const res = fredResults[i];
          try {
            if (res.ok) {
              const data = await res.json();
              const vals = getLastTwo(data.observations || []);
              if (vals) {
                tickerItems.push(series.format(vals.curr, vals.prev));
                continue;
              }
            }
          } catch { /* fall through */ }
          // Fallback for this series
          tickerItems.push({ label: series.label, value: '—', direction: 'neutral' });
        }

        // Add recession probability as status item
        try {
          if (scoreRes.ok) {
            const scoreData = await scoreRes.json();
            const prob = scoreData.probability ?? 0;
            tickerItems.push({
              label: 'Recession Risk',
              value: prob >= 50 ? `⚠ ${prob.toFixed(1)}%` : `${prob.toFixed(1)}%`,
              isStatus: true,
              direction: prob >= 50 ? 'down' : prob >= 25 ? 'neutral' : 'up',
            });
          }
        } catch {
          tickerItems.push({ label: 'Recession Risk', value: '—', isStatus: true, direction: 'neutral' });
        }

        if (!cancelled) setItems(tickerItems);
      } catch {
        // keep static fallback
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const colorFor = (dir?: 'up' | 'down' | 'neutral') => {
    if (dir === 'up') return '#00C853';
    if (dir === 'down') return '#FF1744';
    return 'rgba(255,255,255,0.6)';
  };

  // Render a single ticker segment
  const renderItems = (keyPrefix: string) =>
    items.map((item, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          padding: '0 20px',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          {item.label}
        </span>
        <span style={{
          color: item.isStatus ? colorFor(item.direction) : 'rgba(255,255,255,0.9)',
          fontSize: '12px',
          fontFamily: 'var(--font-data, "SF Mono", "Fira Code", "Cascadia Code", monospace)',
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {item.value}
        </span>
        {item.change && (
          <span style={{
            color: colorFor(item.direction),
            fontSize: '11px',
            fontFamily: 'var(--font-data, "SF Mono", monospace)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {item.change}
          </span>
        )}
        {/* Separator dot */}
        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '8px', marginLeft: '8px' }}>●</span>
      </span>
    ));

  return (
    <div
      aria-label={t('ariaLabel')}
      role="marquee"
      style={{
        background: '#0a0a0f',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 49,
      }}
    >
      <div className="ticker-scroll" style={{
        display: 'inline-flex',
        alignItems: 'center',
        willChange: 'transform',
      }}>
        {/* Duplicate for seamless loop */}
        {renderItems('a')}
        {renderItems('b')}
      </div>

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll {
          animation: tickerScroll 40s linear infinite;
        }
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
