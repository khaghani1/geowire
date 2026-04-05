'use client';

import { useRecessionScore } from '@/hooks/useRecessionScore';

// ─── Key indicator seed data (plausible values if API has no deltas) ────────

interface IndicatorItem {
  label: string;
  value: string;
  context: string;
  color: string;
}

function buildIndicatorsFromApi(data: {
  probability: number;
  signal: string;
  models: Array<{
    model: string;
    name: string;
    inputValue: number | null;
    signal: string;
    status: string;
  }>;
}): IndicatorItem[] {
  const items: IndicatorItem[] = [];

  // Find specific models by identifier
  const modelMap = new Map(data.models.map((m) => [m.model, m]));

  // Yield curve (NY Fed Probit)
  const nyFed = modelMap.get('ny-fed-probit');
  if (nyFed?.inputValue !== null && nyFed?.inputValue !== undefined) {
    const spread = nyFed.inputValue;
    items.push({
      label: '10Y-3M Spread',
      value: `${spread >= 0 ? '+' : ''}${spread.toFixed(2)}%`,
      context: spread < 0 ? 'Yield curve inverted' : 'Yield curve normalized',
      color: spread < 0 ? '#FF6D00' : '#00C853',
    });
  }

  // Oil (Hamilton NOPI)
  const hamilton = modelMap.get('hamilton-nopi');
  if (hamilton?.inputValue !== null && hamilton?.inputValue !== undefined) {
    items.push({
      label: 'WTI Crude',
      value: `$${hamilton.inputValue.toFixed(2)}`,
      context: hamilton.status,
      color: hamilton.signal === 'low' ? '#00C853' : hamilton.signal === 'elevated' ? '#FFB300' : '#FF1744',
    });
  }

  // Sahm Rule
  const sahm = modelMap.get('sahm-rule');
  if (sahm?.inputValue !== null && sahm?.inputValue !== undefined) {
    items.push({
      label: 'Sahm Rule',
      value: `${sahm.inputValue.toFixed(2)}pp`,
      context: sahm.status,
      color: sahm.signal === 'low' ? '#00C853' : sahm.signal === 'elevated' ? '#FFB300' : '#FF1744',
    });
  }

  // Credit Spreads
  const credit = modelMap.get('credit-spread');
  if (credit?.inputValue !== null && credit?.inputValue !== undefined) {
    items.push({
      label: 'HY Credit Spread',
      value: `${credit.inputValue.toFixed(0)}bps`,
      context: credit.status,
      color: credit.signal === 'low' ? '#00C853' : credit.signal === 'elevated' ? '#FFB300' : '#FF1744',
    });
  }

  // Consumer Sentiment (part of composite)
  const philly = modelMap.get('philly-fed-leading');
  if (philly?.inputValue !== null && philly?.inputValue !== undefined) {
    items.push({
      label: 'Philly Fed Leading',
      value: `${philly.inputValue >= 0 ? '+' : ''}${philly.inputValue.toFixed(2)}%`,
      context: philly.status,
      color: philly.signal === 'low' ? '#00C853' : philly.signal === 'elevated' ? '#FFB300' : '#FF1744',
    });
  }

  return items;
}

// ─── Seed fallback (plausible recent values) ────────────────────────────────

const SEED_INDICATORS: IndicatorItem[] = [
  { label: 'WTI Crude', value: '$89.33', context: 'Below Hamilton shock threshold', color: '#00C853' },
  { label: '10Y-3M Spread', value: '+0.15%', context: 'Yield curve normalized', color: '#00C853' },
  { label: 'Sahm Rule', value: '0.37pp', context: 'Below 0.50pp trigger', color: '#FFB300' },
  { label: 'HY Credit Spread', value: '382bps', context: 'Credit conditions normal', color: '#00C853' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function WhatChangedToday() {
  const { data, isLoading, isError } = useRecessionScore();

  // Build indicators from API or use seed
  const indicators = data?.models
    ? buildIndicatorsFromApi(data)
    : SEED_INDICATORS;

  const isSeed = !data || isError;

  // Show shimmer while loading
  if (isLoading && !data) {
    return (
      <div style={{ padding: '16px' }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              height: '44px',
              marginBottom: '8px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.03)',
            }}
          />
        ))}
      </div>
    );
  }

  // If we got zero indicators and no seed, don't render the section at all
  if (indicators.length === 0 && isSeed) {
    return null;
  }

  const displayItems = indicators.length > 0 ? indicators : SEED_INDICATORS;

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px' }}>📊</span>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-data)',
          }}>
            Current Indicators
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          fontFamily: 'var(--font-data)',
          padding: '3px 8px',
          borderRadius: '10px',
          background: isSeed ? 'rgba(255,179,0,0.1)' : 'rgba(41,121,255,0.1)',
          color: isSeed ? '#FFB300' : 'var(--accent)',
          fontWeight: 600,
        }}>
          {isSeed ? 'Seed Data' : 'Live'}
        </span>
      </div>

      {/* Indicator rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {displayItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              gap: '12px',
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontFamily: 'var(--font-data)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: '10.5px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                marginTop: '2px',
                opacity: 0.7,
              }}>
                {item.context}
              </div>
            </div>
            <span style={{
              fontSize: '14px',
              fontFamily: 'var(--font-data)',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              color: item.color,
              whiteSpace: 'nowrap',
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Composite score */}
      {data && (
        <div style={{
          marginTop: '10px',
          padding: '8px 12px',
          borderRadius: '6px',
          background: 'rgba(41,121,255,0.06)',
          border: '1px solid rgba(41,121,255,0.15)',
          fontSize: '12px',
          fontFamily: 'var(--font-data)',
          fontWeight: 600,
          color: 'var(--accent)',
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'center',
        }}>
          Composite Recession Probability: {data.probability.toFixed(1)}% ({data.signal.toUpperCase()})
        </div>
      )}
    </div>
  );
}
