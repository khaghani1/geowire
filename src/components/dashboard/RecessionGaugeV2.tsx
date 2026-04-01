'use client';

/**
 * RecessionGaugeV2
 *
 * ECharts arc gauge — optional enhancement alongside the SVG RecessionGauge.
 * Rendered only on the client via next/dynamic (ssr:false).
 * If it crashes, the ChartErrorBoundary in dashboard/page.tsx catches it.
 *
 * GeoWire color zones:
 *   0–30  % → green  #00C853
 *   30–55 % → amber  #FFD600
 *   55–75 % → orange #FF6D00
 *   75+   % → red    #FF1744
 */

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';

export interface RecessionGaugeV2Props {
  probability: number;
  signal: string;
  confidence: string;
  isLoading?: boolean;
}

// ─── Color helper ──────────────────────────────────────────────────────────────
function gaugeColor(prob: number): string {
  if (prob < 30) return '#00C853';
  if (prob < 55) return '#FFD600';
  if (prob < 75) return '#FF6D00';
  return '#FF1744';
}

// ─── Inner chart (always client-side) ─────────────────────────────────────────
function RecessionGaugeV2Inner({ probability, signal, confidence, isLoading }: RecessionGaugeV2Props) {
  const t = useTranslations('gaugeV2');
  const color = gaugeColor(probability);

  const option = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        center: ['50%', '65%'],
        radius: '80%',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: { color },
        progress: {
          show: true,
          width: 14,
          roundCap: true,
        },
        pointer: { show: false },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, 'rgba(255,255,255,0.08)']],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          distance: 20,
          color: 'rgba(255,255,255,0.35)',
          fontSize: 9,
        },
        anchor: { show: false },
        title: {
          show: true,
          offsetCenter: [0, '-18%'],
          fontSize: 9,
          color: 'rgba(255,255,255,0.45)',
          formatter: t('centerLabel'),
        },
        detail: {
          valueAnimation: true,
          width: '70%',
          lineHeight: 40,
          offsetCenter: [0, '20%'],
          fontSize: 36,
          fontWeight: 700,
          color,
          formatter: '{value}%',
        },
        data: [{ value: isLoading ? 0 : Math.round(probability) }],
      },
    ],
  };

  return (
    <div style={{ padding: '16px' }}>
      <div className="gw-panel-label" style={{ marginBottom: '4px' }}>
        {t('panelLabel')}
      </div>
      <ReactECharts
        option={option}
        style={{ height: 220, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '-8px',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.45)',
      }}>
        <span style={{ color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {signal}
        </span>
        <span>{confidence}</span>
      </div>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function GaugeSkeleton() {
  return (
    <div style={{ height: 268, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ width: 160, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', margin: '0 auto', aspectRatio: '1' }} />
    </div>
  );
}

// ─── Export — dynamic(ssr:false) ───────────────────────────────────────────────
export const RecessionGaugeV2 = dynamic(
  () => Promise.resolve({ default: RecessionGaugeV2Inner }),
  { ssr: false, loading: () => <GaugeSkeleton /> },
);
