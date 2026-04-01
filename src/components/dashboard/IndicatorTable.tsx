'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FredSeriesResult } from '@/lib/data/fred';
import { Skeleton } from '@/components/ui/Skeleton';

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = 'label' | 'current' | 'change';
type SortDir = 'asc' | 'desc';

interface IndicatorRow {
  seriesId: string;
  label: string;
  unit: string;
  current: number | null;
  previous: number | null;
  change: number | null;
  changePct: number | null;
  dataSource: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildRows(seriesMap: Record<string, FredSeriesResult>): IndicatorRow[] {
  return Object.values(seriesMap).map((series) => {
    const obs = series.observations.filter((o) => o.value !== null);
    const current = obs.length > 0 ? obs[obs.length - 1].value : null;
    const previous = obs.length > 1 ? obs[obs.length - 2].value : null;
    const change = current !== null && previous !== null ? current - previous : null;
    const changePct =
      change !== null && previous !== null && previous !== 0
        ? (change / Math.abs(previous)) * 100
        : null;
    return {
      seriesId: series.seriesId,
      label: series.label,
      unit: series.unit,
      current,
      previous,
      change,
      changePct,
      dataSource: series.dataSource,
    };
  });
}

function formatVal(v: number | null, unit: string): string {
  if (v === null) return '—';
  // GDP in billions → show as trillions
  if (unit.includes('Billions') && Math.abs(v) > 1000) {
    return `$${(v / 1000).toFixed(2)}T`;
  }
  // Large numbers (jobless claims)
  if (Math.abs(v) >= 100000) {
    return (v / 1000).toFixed(0) + 'k';
  }
  // Index values
  if (Math.abs(v) >= 100) {
    return v.toFixed(1);
  }
  return v.toFixed(2);
}

function changeArrow(change: number | null): string {
  if (change === null) return '—';
  if (change > 0) return '↑';
  if (change < 0) return '↓';
  return '→';
}

function changeColor(change: number | null, seriesId: string): string {
  if (change === null) return 'var(--text-secondary)';
  // For spreads: positive is good (less inverted)
  // For unemployment/jobless: increase is bad
  // For sentiment/LEI: decrease is bad
  const inversedSeries = ['UNRATE', 'ICSA', 'SAHMCURRENT', 'BAMLH0A0HYM2', 'CPIAUCSL'];
  const isInversed = inversedSeries.includes(seriesId);
  const isPositive = change > 0;
  const isGood = isInversed ? !isPositive : isPositive;
  return isGood ? '#00C853' : '#FF1744';
}

function sourceTag(source: string): string {
  switch (source) {
    case 'live': return '●';
    case 'cached': return '◑';
    case 'seed': return '○';
    default: return '?';
  }
}

function sourceColor(source: string): string {
  switch (source) {
    case 'live': return '#00C853';
    case 'cached': return '#FFD600';
    case 'seed': return '#FF6D00';
    default: return 'var(--text-secondary)';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface IndicatorTableProps {
  seriesMap: Record<string, FredSeriesResult>;
  isLoading: boolean;
}

export function IndicatorTable({ seriesMap, isLoading }: IndicatorTableProps) {
  const t = useTranslations('indicatorTable');
  const [sortKey, setSortKey] = useState<SortKey>('label');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const rows = buildRows(seriesMap).sort((a, b) => {
    let va: number | string | null;
    let vb: number | string | null;
    if (sortKey === 'label') {
      va = a.label;
      vb = b.label;
    } else if (sortKey === 'current') {
      va = a.current;
      vb = b.current;
    } else {
      va = a.change;
      vb = b.change;
    }
    if (va === null && vb === null) return 0;
    if (va === null) return 1;
    if (vb === null) return -1;
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const colStyle = (key: SortKey): React.CSSProperties => ({
    padding: '8px 10px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: sortKey === key ? 'var(--text-primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--bg-secondary)',
  });

  return (
    <div style={{ padding: '16px' }}>
      <div className="gw-panel-label" style={{ marginBottom: '10px' }}>
        {t('panelLabel')}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={36} borderRadius="4px" />
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            fontFamily: 'var(--font-data)',
          }}>
            <thead>
              <tr>
                <th
                  style={{ ...colStyle('label'), textAlign: 'left' }}
                  onClick={() => handleSort('label')}
                >
                  {t('headers.indicator')} {sortKey === 'label' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  style={{ ...colStyle('current'), textAlign: 'right' }}
                  onClick={() => handleSort('current')}
                >
                  {t('headers.current')} {sortKey === 'current' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{
                  ...colStyle('label'),
                  textAlign: 'right',
                  cursor: 'default',
                }}>
                  {t('headers.previous')}
                </th>
                <th
                  style={{ ...colStyle('change'), textAlign: 'right' }}
                  onClick={() => handleSort('change')}
                >
                  {t('headers.change')} {sortKey === 'change' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ ...colStyle('label'), textAlign: 'center', cursor: 'default', width: '40px' }}>
                  {t('headers.src')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const cc = changeColor(row.change, row.seriesId);
                const arrow = changeArrow(row.change);
                return (
                  <tr
                    key={row.seriesId}
                    style={{
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.016)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    {/* Indicator name */}
                    <td style={{ padding: '9px 10px', color: 'var(--text-primary)', fontSize: '12px', fontFamily: 'var(--font-body)' }}>
                      <div style={{ fontWeight: 500 }}>{row.label}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '1px', fontFamily: 'var(--font-data)' }}>
                        {row.seriesId}
                      </div>
                    </td>
                    {/* Current */}
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {formatVal(row.current, row.unit)}
                    </td>
                    {/* Previous */}
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>
                      {formatVal(row.previous, row.unit)}
                    </td>
                    {/* Change */}
                    <td style={{ padding: '9px 10px', textAlign: 'right', color: cc, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                      {row.change !== null ? (
                        <span>
                          {arrow} {Math.abs(row.change) >= 100
                            ? formatVal(row.change, row.unit)
                            : Math.abs(row.change).toFixed(2)}
                        </span>
                      ) : '—'}
                    </td>
                    {/* Source */}
                    <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                      <span
                        title={t('dataSourceTooltip', { source: row.dataSource })}
                        style={{ color: sourceColor(row.dataSource), fontSize: '11px' }}
                      >
                        {sourceTag(row.dataSource)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Legend */}
          <div style={{ marginTop: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {([
              { key: 'live',   tag: '●', color: '#00C853' },
              { key: 'cached', tag: '◑', color: '#FFD600' },
              { key: 'seed',   tag: '○', color: '#FF6D00' },
            ] as const).map(({ key, tag, color }) => (
              <span key={key} style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                <span style={{ color }}>{tag}</span> {t(`legend.${key}`)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
