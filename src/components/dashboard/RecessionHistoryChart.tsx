'use client';

/**
 * RecessionHistoryChart
 *
 * Recharts LineChart showing recession probability over the last 24 months.
 * Uses `next/dynamic` at the call-site (or self-contained dynamic wrapper below).
 * Gray shaded bands mark NBER recession periods.
 *
 * GeoWire palette:
 *   Blue   #2979FF  — main probability line
 *   Red    #FF1744  — NBER recession band fill
 *   Amber  #FFD600  — 50% threshold reference line
 */

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

// ─── Seed data ─────────────────────────────────────────────────────────────────
// 24 monthly data points ending Apr 2026
const HISTORY_DATA = [
  { month: 'May 24',  probability: 22, recession: 0 },
  { month: 'Jun 24',  probability: 24, recession: 0 },
  { month: 'Jul 24',  probability: 27, recession: 0 },
  { month: 'Aug 24',  probability: 29, recession: 0 },
  { month: 'Sep 24',  probability: 31, recession: 0 },
  { month: 'Oct 24',  probability: 34, recession: 0 },
  { month: 'Nov 24',  probability: 36, recession: 0 },
  { month: 'Dec 24',  probability: 38, recession: 0 },
  { month: 'Jan 25',  probability: 41, recession: 0 },
  { month: 'Feb 25',  probability: 43, recession: 0 },
  { month: 'Mar 25',  probability: 46, recession: 0 },
  { month: 'Apr 25',  probability: 48, recession: 0 },
  { month: 'May 25',  probability: 51, recession: 0 },
  { month: 'Jun 25',  probability: 53, recession: 0 },
  { month: 'Jul 25',  probability: 55, recession: 0 },
  { month: 'Aug 25',  probability: 54, recession: 0 },
  { month: 'Sep 25',  probability: 57, recession: 0 },
  { month: 'Oct 25',  probability: 58, recession: 0 },
  { month: 'Nov 25',  probability: 60, recession: 0 },
  { month: 'Dec 25',  probability: 59, recession: 0 },
  { month: 'Jan 26',  probability: 61, recession: 0 },
  { month: 'Feb 26',  probability: 62, recession: 0 },
  { month: 'Mar 26',  probability: 63, recession: 0 },
  { month: 'Apr 26',  probability: 65, recession: 0 },
];

// ─── Inner chart (browser-only) ────────────────────────────────────────────────
function RecessionHistoryChartInner() {
  const t = useTranslations('recessionHistory');

  // Dynamic import of recharts — safe because this component is already
  // wrapped by next/dynamic with ssr:false at module level below.
  const {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ReferenceArea,
  } = require('recharts'); // eslint-disable-line @typescript-eslint/no-require-imports

  return (
    <div style={{ padding: '16px' }}>
      <div className="gw-panel-label" style={{ marginBottom: '14px' }}>
        {t('panelLabel')}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={HISTORY_DATA} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          {/* 50% threshold */}
          <ReferenceLine
            y={50}
            stroke="#FFD600"
            strokeDasharray="4 4"
            strokeOpacity={0.55}
            strokeWidth={1}
          />

          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-data)' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-data)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}%`}
            width={36}
          />

          <Tooltip
            contentStyle={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-primary)',
            }}
            formatter={(value: number) => [`${value}%`, t('tooltipLabel')]}
            labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            cursor={{ stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }}
          />

          <Line
            type="monotone"
            dataKey="probability"
            stroke="#2979FF"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#2979FF', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '10px',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
      }}>
        <LegendItem color="#2979FF" label={t('tooltipLabel')} />
        <LegendItem color="#FFD600" dashed label="50% Threshold" />
      </div>
    </div>
  );
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{
        width: 20,
        height: 2,
        background: dashed ? 'transparent' : color,
        borderTop: dashed ? `2px dashed ${color}` : 'none',
        opacity: dashed ? 0.7 : 1,
      }} />
      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Export wrapped in dynamic (ssr: false) ─────────────────────────────────────
export const RecessionHistoryChart = dynamic(
  () => Promise.resolve(RecessionHistoryChartInner),
  { ssr: false, loading: () => <ChartSkeleton height={232} /> }
);

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div style={{
      height,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ width: 200, height: 12, borderRadius: 4, background: 'var(--bg-tertiary)', opacity: 0.5 }} />
      <div style={{ flex: 1, borderRadius: 6, background: 'var(--bg-tertiary)', opacity: 0.2 }} />
    </div>
  );
}
