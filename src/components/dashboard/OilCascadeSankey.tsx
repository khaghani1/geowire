'use client';

/**
 * OilCascadeSankey
 *
 * ECharts Sankey showing how a Hormuz disruption cascades through the oil supply chain.
 * Toggle: Normal ↔ Disrupted
 *   Disrupted links → stroke #FF1744, dashed, width × 0.3
 *   Cape of Good Hope diversion routes appear in disrupted mode
 *
 * Rendered only on the client via next/dynamic (ssr:false).
 */

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';

// ─── Data ──────────────────────────────────────────────────────────────────────

const NODES = [
  { name: 'Saudi Arabia' },
  { name: 'Iraq' },
  { name: 'Iran' },
  { name: 'UAE' },
  { name: 'Kuwait' },
  { name: 'Hormuz Strait' },
  { name: 'Cape of Good Hope' },
  { name: 'Asia-Pacific' },
  { name: 'Europe' },
  { name: 'North America' },
];

const BASE_LINKS = [
  { source: 'Saudi Arabia',  target: 'Hormuz Strait',  value: 6.5 },
  { source: 'Iraq',          target: 'Hormuz Strait',  value: 4.0 },
  { source: 'Iran',          target: 'Hormuz Strait',  value: 1.5 },
  { source: 'UAE',           target: 'Hormuz Strait',  value: 3.0 },
  { source: 'Kuwait',        target: 'Hormuz Strait',  value: 1.5 },
  { source: 'Hormuz Strait', target: 'Asia-Pacific',   value: 11.0 },
  { source: 'Hormuz Strait', target: 'Europe',         value: 4.0 },
  { source: 'Hormuz Strait', target: 'North America',  value: 1.5 },
];

const DISRUPTED_EXTRA_LINKS = [
  { source: 'Saudi Arabia',       target: 'Cape of Good Hope', value: 2.0 },
  { source: 'UAE',                target: 'Cape of Good Hope', value: 1.0 },
  { source: 'Cape of Good Hope',  target: 'Asia-Pacific',      value: 1.5 },
  { source: 'Cape of Good Hope',  target: 'Europe',            value: 1.0 },
  { source: 'Cape of Good Hope',  target: 'North America',     value: 0.5 },
];

const DISRUPTED_LINK_KEYS = new Set([
  'Hormuz Strait→Asia-Pacific',
  'Hormuz Strait→Europe',
  'Hormuz Strait→North America',
]);

function buildLinks(disrupted: boolean) {
  const base = BASE_LINKS.map((l) => {
    const key = `${l.source}→${l.target}`;
    const hit = disrupted && DISRUPTED_LINK_KEYS.has(key);
    return {
      ...l,
      value: hit ? l.value * 0.3 : l.value,
      lineStyle: {
        color: hit ? '#FF1744' : 'gradient',
        type: hit ? 'dashed' : 'solid',
        opacity: hit ? 0.65 : 0.45,
      },
    };
  });
  if (!disrupted) return base;
  return [
    ...base,
    ...DISRUPTED_EXTRA_LINKS.map((l) => ({
      ...l,
      lineStyle: { color: '#FF1744', type: 'dashed', opacity: 0.55 },
    })),
  ];
}

// ─── Inner component ────────────────────────────────────────────────────────────

function OilCascadeSankeyInner() {
  const t = useTranslations('oilSankey');
  const [disrupted, setDisrupted] = useState(false);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params: {
        dataType: string;
        data: { source?: string; target?: string; value?: number; name?: string };
      }) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>${t('tooltipValue', { value: `${params.data.value} mb/d` })}`;
        }
        return params.data.name ?? '';
      },
      backgroundColor: '#1a1a2e',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#fff', fontSize: 12 },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: { focus: 'adjacency' },
        nodeGap: 16,
        nodeWidth: 14,
        left: '2%',
        right: '18%',
        top: '6%',
        bottom: '6%',
        data: NODES.map((n) => ({
          name: n.name,
          itemStyle: {
            color:
              n.name === 'Hormuz Strait'
                ? disrupted ? '#FF1744' : '#2979FF'
                : n.name === 'Cape of Good Hope'
                ? '#FFD600'
                : ['Asia-Pacific', 'Europe', 'North America'].includes(n.name)
                ? '#00C853'
                : 'rgba(100,130,200,0.85)',
          },
          label: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
        })),
        links: buildLinks(disrupted),
      },
    ],
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="gw-panel-label">{t('panelLabel')}</span>
          {disrupted && (
            <span style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#FF1744',
              background: 'rgba(255,23,68,0.12)',
              border: '1px solid rgba(255,23,68,0.3)',
              padding: '2px 7px',
              borderRadius: '4px',
            }}>
              {t('disruptionBadge')}
            </span>
          )}
        </div>

        <button
          onClick={() => setDisrupted((d) => !d)}
          style={{
            padding: '5px 12px',
            borderRadius: '6px',
            background: disrupted ? 'rgba(255,23,68,0.12)' : 'rgba(0,200,83,0.1)',
            border: `1px solid ${disrupted ? 'rgba(255,23,68,0.35)' : 'rgba(0,200,83,0.3)'}`,
            color: disrupted ? '#FF1744' : '#00C853',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.03em',
          }}
        >
          {disrupted ? t('toggleNormal') : t('toggleDisrupted')}
        </button>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 280, width: '100%' }}
        opts={{ renderer: 'svg' }}
        key={disrupted ? 'disrupted' : 'normal'}
      />
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function SankeySkeleton() {
  return (
    <div style={{ height: 340, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ width: 200, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ flex: 1, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

// ─── Export — dynamic(ssr:false) ───────────────────────────────────────────────
export const OilCascadeSankey = dynamic(
  () => Promise.resolve({ default: OilCascadeSankeyInner }),
  { ssr: false, loading: () => <SankeySkeleton /> },
);
