'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { Skeleton } from '@/components/ui/Skeleton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecessionGaugeProps {
  probability: number;
  signal: string;
  confidence: string;
  fetchedAt: string;
  dataSource: string;
  isLoading?: boolean;
}

// ─── SVG Gauge geometry ───────────────────────────────────────────────────────
//
// ViewBox: 0 0 280 175  — 280 wide, 175 tall
// Circle center: (140, 170)  — near bottom
// Radius: 120, StrokeWidth: 20
// Arc: 240° clockwise, starting at 150° (7 o'clock) ending at 30° (5 o'clock)
// Endpoints at y=230 are clipped by viewBox → clean bottom edge

const CX = 140;
const CY = 170;
const R = 120;
const STROKE_W = 20;

function toXY(angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: parseFloat((CX + R * Math.cos(rad)).toFixed(2)),
    y: parseFloat((CY + R * Math.sin(rad)).toFixed(2)),
  };
}

// Arc from 150° (lower-left) clockwise 240° to 30° (lower-right)
const START_ANGLE = 150; // degrees from SVG x-axis (3 o'clock)
const SWEEP_DEG = 240;

const arcStart = toXY(START_ANGLE);
const arcEnd = toXY(START_ANGLE + SWEEP_DEG); // = 30°

// d attribute for the 240° background arc (large-arc=1, sweep=1=clockwise)
const ARC_D = `M ${arcStart.x} ${arcStart.y} A ${R} ${R} 0 1 1 ${arcEnd.x} ${arcEnd.y}`;

// ─── Color helpers ────────────────────────────────────────────────────────────

function signalColor(prob: number): string {
  if (prob < 25) return '#00C853';  // green
  if (prob < 50) return '#FFD600';  // amber
  if (prob < 75) return '#FF6D00';  // orange
  return '#FF1744';                  // red
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RecessionGauge({
  probability,
  signal: _signal,
  confidence,
  fetchedAt,
  dataSource,
  isLoading = false,
}: RecessionGaugeProps) {
  const t = useTranslations('gauge');
  const format = useFormatter();

  // Animate from 0 → actual value on mount / value change
  const [displayProb, setDisplayProb] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayProb(probability), 80);
    return () => clearTimeout(timer);
  }, [probability]);

  // Signal label — derived from probability, keys match en.json gauge.signals
  function getSignalLabel(prob: number): string {
    if (prob < 25) return t('signals.lowRisk');
    if (prob < 50) return t('signals.moderate');
    if (prob < 75) return t('signals.elevated');
    return t('signals.severe');
  }

  // Locale-aware time formatting via next-intl
  function formatTime(iso: string): string {
    try {
      return format.dateTime(new Date(iso), { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <Skeleton height={175} borderRadius="8px" />
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton height={14} width="60%" />
          <Skeleton height={12} width="40%" />
        </div>
      </div>
    );
  }

  const color = signalColor(probability);
  const label = getSignalLabel(probability);
  const fillDash = `${displayProb} 100`;

  return (
    <div style={{ padding: '16px 20px 12px' }}>
      {/* Panel label */}
      <div className="gw-panel-label" style={{ marginBottom: '8px' }}>
        {t('panelLabel')}
      </div>

      {/* SVG Gauge */}
      <svg
        viewBox="0 0 280 175"
        width="100%"
        style={{ overflow: 'hidden', display: 'block', maxWidth: '320px', margin: '0 auto' }}
        aria-label={t('ariaLabel', { probability: probability.toFixed(1) })}
        role="img"
      >
        {/* Color zone background arcs (dim, 25% each) */}
        <path
          d={ARC_D} fill="none"
          stroke="#00C853" strokeWidth={STROKE_W} strokeLinecap="butt"
          opacity={0.18} pathLength="100"
          strokeDasharray="25 75" strokeDashoffset={0}
        />
        <path
          d={ARC_D} fill="none"
          stroke="#FFD600" strokeWidth={STROKE_W} strokeLinecap="butt"
          opacity={0.18} pathLength="100"
          strokeDasharray="25 75" strokeDashoffset={-25}
        />
        <path
          d={ARC_D} fill="none"
          stroke="#FF6D00" strokeWidth={STROKE_W} strokeLinecap="butt"
          opacity={0.18} pathLength="100"
          strokeDasharray="25 75" strokeDashoffset={-50}
        />
        <path
          d={ARC_D} fill="none"
          stroke="#FF1744" strokeWidth={STROKE_W} strokeLinecap="butt"
          opacity={0.18} pathLength="100"
          strokeDasharray="25 75" strokeDashoffset={-75}
        />

        {/* Active fill arc */}
        <path
          d={ARC_D} fill="none"
          stroke={color} strokeWidth={STROKE_W} strokeLinecap="round"
          pathLength="100"
          strokeDasharray={fillDash}
          style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.34, 1.1, 0.64, 1)' }}
        />

        {/* Probability percentage */}
        <text
          x={CX} y={108}
          textAnchor="middle"
          fill={color}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight={700}
          fontSize={48}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {Math.round(probability)}%
        </text>

        {/* Signal label */}
        <text
          x={CX} y={133}
          textAnchor="middle"
          fill={color}
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight={600}
          fontSize={13}
          letterSpacing="0.12em"
        >
          {label}
        </text>

        {/* Confidence */}
        <text
          x={CX} y={152}
          textAnchor="middle"
          fill="rgba(161,161,170,0.7)"
          fontFamily="'DM Sans', sans-serif"
          fontSize={11}
        >
          {t('confidence', { value: confidence })}
        </text>

        {/* Meta: updated time + data source */}
        <text
          x={CX} y={168}
          textAnchor="middle"
          fill="rgba(161,161,170,0.5)"
          fontFamily="'JetBrains Mono', monospace"
          fontSize={9.5}
        >
          {formatTime(fetchedAt)} · {dataSource}
        </text>
      </svg>

      {/* Zone legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '14px',
        marginTop: '4px',
      }}>
        {([
          { key: 'low',      color: '#00C853' },
          { key: 'moderate', color: '#FFD600' },
          { key: 'elevated', color: '#FF6D00' },
          { key: 'severe',   color: '#FF1744' },
        ] as const).map(({ key, color: c }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.8 }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              {t(`zones.${key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
