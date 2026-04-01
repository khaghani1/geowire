'use client';

/**
 * RecessionHistoryChart
 *
 * Recharts LineChart showing recession probability over the last 24 months.
 * Exported via next/dynamic (ssr:false) so Recharts never runs on the server.
 *
 * GeoWire palette:
 *   Blue   #2979FF  — main probability line
 *   Amber  #FFD600  — 50 % threshold reference line
 */

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

// ─── Seed data ─────────────────────────────────────────────────────────────────
const HISTORY_DATA = [
  { month: 'May 24', probability: 22 },
  { month: 'Jun 24', probability: 24 },
  { month: 'Jul 24', probability: 27 },
  { month: 'Aug 24', probability: 29 },
  { month: 'Sep 24', probability: 31 },
  { month: 'Oct 24', probability: 34 },
  { month: 'Nov 24', probability: 36 },
  { month: 'Dec 24', probability: 38 },
  { month: 'Jan 25', probability: 41 },
  { month: 'Feb 25', probability: 43 },
  { month: 'Mar 25', probability: 46 },
  { month: 'Apr 25', probability: 48 },
  { month: 'May 25', probability: 51 },
  { month: 'Jun 25', probability: 53 },
  { month: 'Jul 25', probability: 55 },
  { month: 'Aug 25', probability: 54 },
  { month: 'Sep 25', probability: 57 },
  { month: 'Oct 25', probability: 58 },
  { month: 'Nov 25', probability: 60 },
  { month: 'Dec 25', probability: 59 },
  { month: 'Jan 26', probability: 61 },
  { month: 'Feb 26', probability: 62 },
  { month: 'Mar 26', probability: 63 },
  { month: 'Apr 26', probability: 65 },
];

// ─── Inner chart component (always runs client-side) ───────────────────────────
function RecessionHistoryChartInner() {
  const t = useTranslations('recessionHistory');

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

          {/* 50 % threshold */}
          <ReferenceLine
            y={50}
            stroke="#FFD600"
            strokeDasharray="4 4"
            strokeOpacity={0.55}
            strokeWidth={1}
          />

          <XAxis
            dataKey="month"
            tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}%`}
            width={36}
          />

          <Tooltip
            contentStyle={{
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fff',
            }}
            formatter={(value) => [`${value ?? 0}%`, t('tooltipLabel')]}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
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
      <div style={{ display: 'flex', gap: '16px', marginTop: '10px', justifyContent: 'flex-end' }}>
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
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div style={{ height: 248, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ width: 200, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ flex: 1, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

// ─── Export — dynamic(ssr:false) so Recharts never runs on the server ──────────
// next/dynamic expects the factory to resolve to { default: Component }
export const RecessionHistoryChart = dynamic(
  () => Promise.resolve({ default: RecessionHistoryChartInner }),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
