'use client';

import { useQueries } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

// ─── Config ──────────────────────────────────────────────────────────────────

interface SparklineConfig {
  seriesId: string;
  labelKey: string;
  unit: string;
  /** For direction coloring: true = value going UP is bad (e.g., unemployment) */
  upIsBad: boolean;
  decimals: number;
  prefix?: string;
  suffix?: string;
}

const SPARKLINE_SERIES: SparklineConfig[] = [
  { seriesId: 'DCOILWTICO',    labelKey: 'wti',        unit: '$',  upIsBad: true,  decimals: 2, prefix: '$' },
  { seriesId: 'T10Y3M',        labelKey: 'spread',     unit: '%',  upIsBad: false, decimals: 2, suffix: '%' },
  { seriesId: 'UNRATE',        labelKey: 'unemployment', unit: '%', upIsBad: true,  decimals: 1, suffix: '%' },
  { seriesId: 'BAMLH0A0HYM2',  labelKey: 'hySpread',   unit: '%',  upIsBad: true,  decimals: 2, suffix: '%' },
  { seriesId: 'UMCSENT',       labelKey: 'sentiment',  unit: '',   upIsBad: false, decimals: 1 },
  { seriesId: 'USSLIND',       labelKey: 'sp500',      unit: '',   upIsBad: false, decimals: 2 },
];

const POINTS = 30;

// ─── SVG Sparkline ───────────────────────────────────────────────────────────

function Sparkline({
  values,
  color,
  width = 80,
  height = 30,
}: {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - 2 - ((v - min) / range) * (height - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Gradient fill area
  const lastX = width;
  const areaPoints = `0,${height} ${points} ${lastX},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {values.length > 0 && (() => {
        const lastVal = values[values.length - 1];
        const cx = width;
        const cy = height - 2 - ((lastVal - min) / range) * (height - 4);
        return <circle cx={cx} cy={cy} r="2" fill={color} />;
      })()}
    </svg>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function SparklineSkeleton() {
  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: '8px',
      background: 'var(--bg-glass)',
      border: '1px solid var(--border-subtle)',
      minHeight: '90px',
    }}>
      <div style={{ width: 60, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 10 }} />
      <div style={{ width: 50, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.04)', marginBottom: 10 }} />
      <div style={{ width: 80, height: 30, borderRadius: 4, background: 'rgba(255,255,255,0.03)' }} />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SparklineCards() {
  const t = useTranslations('sparklines');

  const queries = useQueries({
    queries: SPARKLINE_SERIES.map((cfg) => ({
      queryKey: ['fred-series', cfg.seriesId],
      queryFn: async () => {
        const res = await fetch(`/api/v1/fred/${cfg.seriesId}`);
        if (!res.ok) throw new Error(`Failed: ${cfg.seriesId}`);
        return res.json();
      },
      staleTime: 60_000,
      retry: 1,
    })),
  });

  return (
    <div>
      <div
        className="sparkline-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
        }}
      >
        {SPARKLINE_SERIES.map((cfg, i) => {
          const query = queries[i];

          if (query.isLoading || !query.data) {
            return <SparklineSkeleton key={cfg.seriesId} />;
          }

          const obs = query.data.observations ?? [];
          const recent = obs.slice(-POINTS).filter((o: { value: number | null }) => o.value != null);
          const values = recent.map((o: { value: number }) => o.value);

          if (values.length < 2) {
            return <SparklineSkeleton key={cfg.seriesId} />;
          }

          const current = values[values.length - 1];
          const prev = values[values.length - 2];
          const change = current - prev;
          const changePct = prev !== 0 ? (change / Math.abs(prev)) * 100 : 0;

          // Direction coloring
          const isBad = cfg.upIsBad ? change > 0 : change < 0;
          const color = Math.abs(change) < 0.001
            ? 'rgba(255,255,255,0.4)'
            : isBad ? '#FF1744' : '#00C853';

          const formatted = `${cfg.prefix ?? ''}${current.toFixed(cfg.decimals)}${cfg.suffix ?? ''}`;
          const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '●';

          return (
            <div
              key={cfg.seriesId}
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
              }}
            >
              {/* Label */}
              <span style={{
                fontSize: '10.5px',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                {t(cfg.labelKey)}
              </span>

              {/* Value + change */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{
                  fontSize: '18px',
                  fontFamily: 'var(--font-data, "SF Mono", monospace)',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}>
                  {formatted}
                </span>
                <span style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-data)',
                  fontWeight: 600,
                  color,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {arrow} {Math.abs(changePct).toFixed(1)}%
                </span>
              </div>

              {/* Sparkline */}
              <Sparkline values={values} color={color} />
            </div>
          );
        })}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .sparkline-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .sparkline-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
