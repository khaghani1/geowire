'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TickerItem {
  label: string;
  value: string;
  change?: string;      // e.g. "▼9.38 (-9.5%)"
  direction?: 'up' | 'down' | 'neutral';
  isStatus?: boolean;   // For non-numeric items like "Hormuz Status"
}

// ─── Static fallback data (replaced by live data when available) ─────────────

const STATIC_TICKER: TickerItem[] = [
  { label: 'WTI Crude',    value: '$89.33',  change: '▼9.38 (-9.5%)',   direction: 'down' },
  { label: 'Brent Crude',  value: '$92.10',  change: '▼8.20 (-8.2%)',   direction: 'down' },
  { label: 'Gold',         value: '$3,124',  change: '▲42 (+1.4%)',     direction: 'up' },
  { label: 'VIX',          value: '22.4',    change: '▲1.8 (+8.7%)',    direction: 'up' },
  { label: 'S&P 500',      value: '5,580',   change: '▼45 (-0.8%)',     direction: 'down' },
  { label: '10Y Treasury', value: '4.21%',   direction: 'neutral' },
  { label: 'BTC',          value: '$84,200', change: '▼1,200 (-1.4%)',  direction: 'down' },
  { label: 'Hormuz Status', value: '⚠ ELEVATED RISK', isStatus: true, direction: 'down' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function TickerStrip() {
  const t = useTranslations('ticker');
  const [items, setItems] = useState<TickerItem[]>(STATIC_TICKER);
  const [liveLoaded, setLiveLoaded] = useState(false);

  // Try to enrich from recession-score API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v1/recession-score');
        if (!res.ok) return;
        const data = await res.json();

        if (cancelled) return;

        // Find oil price from models if available
        const updated = [...STATIC_TICKER];

        // Update recession probability in Hormuz status if available
        if (data.probability !== undefined) {
          const hormuzIdx = updated.findIndex((i) => i.isStatus);
          if (hormuzIdx >= 0) {
            const prob = data.probability;
            updated[hormuzIdx] = {
              ...updated[hormuzIdx],
              value: prob > 30
                ? '⚠ ELEVATED RISK'
                : '✓ NORMAL',
              direction: prob > 30 ? 'down' : 'up',
            };
          }
        }

        setItems(updated);
        setLiveLoaded(true);
      } catch {
        // keep static fallback
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const colorFor = (dir?: 'up' | 'down' | 'neutral') => {
    if (dir === 'up') return '#00C853';
    if (dir === 'down') return '#FF1744';
    return 'rgba(255,255,255,0.6)';
  };

  // Render a single ticker segment
  const renderItems = (keyPrefix: string) =>
    items.map((item, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          padding: '0 20px',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          {item.label}
        </span>
        <span style={{
          color: item.isStatus ? colorFor(item.direction) : 'rgba(255,255,255,0.9)',
          fontSize: '12px',
          fontFamily: 'var(--font-data, "SF Mono", "Fira Code", "Cascadia Code", monospace)',
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {item.value}
        </span>
        {item.change && (
          <span style={{
            color: colorFor(item.direction),
            fontSize: '11px',
            fontFamily: 'var(--font-data, "SF Mono", monospace)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {item.change}
          </span>
        )}
        {/* Separator dot */}
        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '8px', marginLeft: '8px' }}>●</span>
      </span>
    ));

  return (
    <div
      aria-label={t('ariaLabel')}
      role="marquee"
      style={{
        background: '#0a0a0f',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 49,
      }}
    >
      <div className="ticker-scroll" style={{
        display: 'inline-flex',
        alignItems: 'center',
        willChange: 'transform',
      }}>
        {/* Duplicate for seamless loop */}
        {renderItems('a')}
        {renderItems('b')}
      </div>

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll {
          animation: tickerScroll 40s linear infinite;
        }
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
