'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

// ─── Elasticity coefficients (Hamilton 2003 + commodity cascade) ──────────────

const BASELINE = 80;

interface CascadeItem {
  id: string;
  elasticity: number;
  /** true = higher % is bad (most things); false = inverted display */
  upIsBad: boolean;
}

const CASCADE: CascadeItem[] = [
  { id: 'gasoline',    elasticity: 1.12,  upIsBad: true },
  { id: 'diesel',      elasticity: 1.08,  upIsBad: true },
  { id: 'jetFuel',     elasticity: 1.05,  upIsBad: true },
  { id: 'shipping',    elasticity: 0.75,  upIsBad: true },
  { id: 'foodPrices',  elasticity: 0.38,  upIsBad: true },
  { id: 'cpiImpact',   elasticity: 0.21,  upIsBad: true },
  { id: 'gdpImpact',   elasticity: -0.15, upIsBad: false },
];

// Scenario presets
const SCENARIOS = [
  { id: 'current',     price: 89 },
  { id: 'partial',     price: 120 },
  { id: 'closed',      price: 150 },
  { id: 'escalation',  price: 180 },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function ScenarioSlider() {
  const t = useTranslations('scenario');
  const [oilPrice, setOilPrice] = useState(89);

  const cascadeResults = useMemo(() => {
    const multiplier = oilPrice / BASELINE;
    return CASCADE.map((item) => {
      const pctChange = (multiplier - 1) * 100 * item.elasticity;
      return {
        ...item,
        pctChange,
        absChange: Math.abs(pctChange),
      };
    });
  }, [oilPrice]);

  // Heuristic: every $10 above baseline adds ~2pp to recession probability
  const recessionPpIncrease = useMemo(() => {
    const aboveBaseline = Math.max(0, oilPrice - BASELINE);
    return (aboveBaseline / 10) * 2;
  }, [oilPrice]);

  const sliderPct = ((oilPrice - 60) / (180 - 60)) * 100;

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>🛢</span>
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
          {t('interactive')}
        </span>
      </div>

      {/* Scenario preset buttons */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        {SCENARIOS.map((s) => {
          const isActive = Math.abs(oilPrice - s.price) < 2;
          return (
            <button
              key={s.id}
              onClick={() => setOilPrice(s.price)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                background: isActive ? 'rgba(41,121,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(41,121,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontFamily: 'var(--font-data)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t(`presets.${s.id}`)}
            </button>
          );
        })}
      </div>

      {/* Oil price display */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <span style={{
          fontSize: '32px',
          fontWeight: 700,
          fontFamily: 'var(--font-data)',
          fontVariantNumeric: 'tabular-nums',
          color: oilPrice > BASELINE ? '#FF1744' : '#00C853',
          transition: 'color 0.2s',
        }}>
          ${oilPrice}
        </span>
        <span style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          marginLeft: '8px',
        }}>
          {t('perBarrel')}
        </span>
      </div>

      {/* Slider */}
      <div style={{ position: 'relative', marginBottom: '20px', padding: '0 2px' }}>
        <input
          type="range"
          min={60}
          max={180}
          step={1}
          value={oilPrice}
          onChange={(e) => setOilPrice(Number(e.target.value))}
          className="scenario-slider"
          style={{ width: '100%', cursor: 'pointer' }}
          aria-label={t('sliderLabel')}
        />
        {/* Min/max labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          fontFamily: 'var(--font-data)',
          color: 'var(--text-secondary)',
          marginTop: '4px',
        }}>
          <span>$60</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>Baseline: ${BASELINE}</span>
          <span>$180</span>
        </div>
      </div>

      {/* Cascade impact cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        {cascadeResults.map((item) => {
          const isNegative = item.pctChange > 0 ? item.upIsBad : !item.upIsBad;
          const color = Math.abs(item.pctChange) < 0.5
            ? 'rgba(255,255,255,0.4)'
            : isNegative ? '#FF1744' : '#00C853';
          const barWidth = Math.min(100, item.absChange * 1.5);

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${barWidth}%`,
                background: `${color}08`,
                transition: 'width 0.15s ease, background 0.15s ease',
                borderRadius: '6px',
              }} />

              <span style={{
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)',
                minWidth: '90px',
                position: 'relative',
                zIndex: 1,
              }}>
                {t(`cascade.${item.id}`)}
              </span>

              <span style={{
                fontSize: '13px',
                fontFamily: 'var(--font-data)',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color,
                minWidth: '70px',
                textAlign: 'right',
                position: 'relative',
                zIndex: 1,
                transition: 'color 0.15s',
              }}>
                {item.pctChange >= 0 ? '+' : ''}{item.pctChange.toFixed(1)}%
              </span>

              <span style={{
                fontSize: '10.5px',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)',
                opacity: 0.7,
                position: 'relative',
                zIndex: 1,
                flex: 1,
              }}>
                {t(`cascadeContext.${item.id}`)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary line */}
      <div style={{
        padding: '10px 14px',
        borderRadius: '6px',
        background: recessionPpIncrease > 5
          ? 'rgba(255,23,68,0.08)'
          : 'rgba(41,121,255,0.06)',
        border: `1px solid ${recessionPpIncrease > 5
          ? 'rgba(255,23,68,0.2)'
          : 'rgba(41,121,255,0.15)'}`,
        fontSize: '12px',
        fontFamily: 'var(--font-data)',
        fontVariantNumeric: 'tabular-nums',
        color: recessionPpIncrease > 5 ? '#FF1744' : 'var(--accent)',
        fontWeight: 600,
        transition: 'all 0.2s',
      }}>
        {t('summary', {
          price: oilPrice,
          pp: recessionPpIncrease.toFixed(1),
        })}
      </div>

      {/* Slider CSS */}
      <style>{`
        .scenario-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          outline: none;
          background: linear-gradient(
            to right,
            #00C853 0%,
            #00C853 ${((BASELINE - 60) / 120) * 100}%,
            #FF1744 ${((BASELINE - 60) / 120) * 100}%,
            #FF1744 100%
          );
          opacity: 0.85;
          transition: opacity 0.15s;
        }
        .scenario-slider:hover {
          opacity: 1;
        }
        .scenario-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid ${oilPrice > BASELINE ? '#FF1744' : '#00C853'};
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: border-color 0.15s;
        }
        .scenario-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid ${oilPrice > BASELINE ? '#FF1744' : '#00C853'};
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
