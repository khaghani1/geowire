'use client';

/**
 * OilCascadeSankey
 *
 * ECharts Sankey diagram showing how a Strait of Hormuz disruption cascades
 * through the global oil supply chain.
 *
 * Toggle behaviour (Normal ↔ Disrupted):
 *  - Disrupted links: stroke turns #FF1744, lineStyle.type = 'dashed', width × 0.3
 *  - Undisrupted links: #00C853 normal flow
 *  - Node colors match GeoWire palette
 */

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// ─── Seed data ─────────────────────────────────────────────────────────────────

const NODES = [
  { name: 'Persian Gulf' },
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

// Normal-flow link values (mb/d approximations)
const BASE_LINKS = [
  { source: 'Saudi Arabia',   target: 'Hormuz Strait',       value: 6.5 },
  { source: 'Iraq',           target: 'Hormuz Strait',       value: 4.0 },
  { source: 'Iran',           target: 'Hormuz Strait',       value: 1.5 },
  { source: 'UAE',            target: 'Hormuz Strait',       value: 3.0 },
  { source: 'Kuwait',         target: 'Hormuz Strait',       value: 1.5 },
  { source: 'Hormuz Strait',  target: 'Asia-Pacific',        value: 11.0 },
  { source: 'Hormuz Strait',  target: 'Europe',              value: 4.0 },
  { source: 'Hormuz Strait',  target: 'North America',       value: 1.5 },
];

// When disrupted: Hormuz routes diverted to Cape of Good Hope (partial)
const DISRUPTED_EXTRA_LINKS = [
  { source: 'Saudi Arabia',  target: 'Cape of Good Hope',   value: 2.0, disrupted: true },
  { source: 'UAE',           target: 'Cape of Good Hope',   value: 1.0, disrupted: true },
  { source: 'Cape of Good Hope', target: 'Asia-Pacific',    value: 1.5, disrupted: true },
  { source: 'Cape of Good Hope', target: 'Europe',          value: 1.0, disrupted: true },
  { source: 'Cape of Good Hope', target: 'North America',   value: 0.5, disrupted: true },
];

// Links that are directly impacted by disruption (Hormuz throughput drops ~70%)
const DISRUPTED_LINK_TARGETS = new Set([
  'Hormuz Strait→Asia-Pacific',
  'Hormuz Strait→Europe',
  'Hormuz Strait→North America',
]);

function buildLinks(disrupted: boolean) {
  if (!disrupted) {
    return BASE_LINKS.map((l) => ({
      ...l,
      lineStyle: {
        color: 'gradient',
        opacity: 0.5,
      },
    }));
  }
  // Disrupted: reduce Hormuz throughput by 70%, add Cape diversions
  return [
    ...BASE_LINKS.map((l) => {
      const key = `${l.source}→${l.target}`;
      const isHit = DISRUPTED_LINK_TARGETS.has(key);
      return {
        ...l,
        value: isHit ? l.value * 0.3 : l.value,
        lineStyle: {
          color: isHit ? '#FF1744' : 'gradient',
          type: isHit ? 'dashed' : 'solid',
          opacity: isHit ? 0.65 : 0.45,
        },
      };
    }),
    ...DISRUPTED_EXTRA_LINKS.map((l) => ({
      ...l,
      lineStyle: {
        color: '#FF1744',
        type: 'dashed',
        opacity: 0.55,
      },
    })),
  ];
}

// ─── Inner component (browser-only) ──────────────────────────────────────────

function OilCascadeSankeyInner() {
  const t = useTranslations('oilSankey');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactECharts = require('echarts-for-react').default;
  const [disrupted, setDisrupted] = useState(false);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params: { dataType: string; data: { source?: string; target?: string; value?: number; name?: string } }) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>${t('tooltipValue', { value: `${params.data.value} mb/d` })}`;
        }
        return params.data.name ?? '';
      },
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-subtle)',
      textStyle: { color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-body)' },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: { focus: 'adjacency' },
        nodeGap: 16,
        nodeWidth: 14,
        left: '2%',
        right: '2%',
        top: '6%',
        bottom: '6%',
        data: NODES.map((n) => ({
          name: n.name,
          itemStyle: {
            color: n.name === 'Hormuz Strait'
              ? (disrupted ? '#FF1744' : '#2979FF')
              : n.name === 'Cape of Good Hope'
              ? '#FFD600'
              : n.name === 'Asia-Pacific' || n.name === 'Europe' || n.name === 'North America'
              ? '#00C853'
              : 'rgba(100,130,200,0.85)',
          },
          label: {
            color: 'var(--text-primary)',
            fontSize: 10,
            fontFamily: 'var(--font-body)',
          },
        })),
        links: buildLinks(disrupted),
      },
    ],
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Header row */}
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
              fontFamily: 'var(--font-body)',
            }}>
              {t('disruptionBadge')}
            </span>
          )}
        </div>

        {/* Toggle button */}
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
            fontFamily: 'var(--font-body)',
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
        key={disrupted ? 'disrupted' : 'normal'} // force re-render on toggle
      />
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function SankeySkeleton() {
  return (
    <div style={{ height: 340, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ width: 200, height: 12, borderRadius: 4, background: 'var(--bg-tertiary)', opacity: 0.5 }} />
      <div style={{ flex: 1, borderRadius: 6, background: 'var(--bg-tertiary)', opacity: 0.15 }} />
    </div>
  );
}

// ─── Export wrapped in dynamic (ssr: false) ────────────────────────────────────
export const OilCascadeSankey = dynamic(
  () => Promise.resolve(OilCascadeSankeyInner),
  { ssr: false, loading: () => <SankeySkeleton /> }
);
