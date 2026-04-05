'use client';

import { useRecessionScore } from '@/hooks/useRecessionScore';

// ─── Color thresholds ────────────────────────────────────────────────────────

function probabilityColor(p: number): string {
  if (p < 25) return '#00C853';
  if (p < 50) return '#FFB300';
  if (p < 75) return '#FF6D00';
  return '#FF1744';
}

function probabilityBg(p: number): string {
  if (p < 25) return 'linear-gradient(90deg, rgba(0,200,83,0.12) 0%, rgba(0,200,83,0.06) 100%)';
  if (p < 50) return 'linear-gradient(90deg, rgba(255,179,0,0.14) 0%, rgba(255,214,0,0.08) 100%)';
  if (p < 75) return 'linear-gradient(90deg, rgba(255,109,0,0.16) 0%, rgba(255,214,0,0.10) 100%)';
  return 'linear-gradient(90deg, rgba(255,23,68,0.18) 0%, rgba(255,214,0,0.14) 100%)';
}

function signalLabel(p: number): string {
  if (p < 25) return 'LOW';
  if (p < 50) return 'ELEVATED';
  if (p < 75) return 'WARNING';
  return 'HIGH';
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AlertBannerLive() {
  const { data, isLoading, isError } = useRecessionScore();

  // Determine probability and data source label
  const probability = data?.probability ?? null;
  const isSeed = !data || isError;
  const fetchedAt = data?.fetchedAt ?? null;

  // While loading, show a slim placeholder
  if (isLoading && !data) {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '8px 24px',
          fontSize: '13px',
          fontFamily: 'var(--font-data)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
        }}
      >
        Loading recession probability...
      </div>
    );
  }

  // Use seed fallback if API failed
  const prob = probability ?? 15;
  const color = probabilityColor(prob);
  const bg = probabilityBg(prob);

  // Format timestamp
  let updatedText = '';
  if (fetchedAt) {
    try {
      const d = new Date(fetchedAt);
      updatedText = `Last updated: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      updatedText = '';
    }
  }

  return (
    <div
      style={{
        background: bg,
        borderBottom: '1px solid rgba(255, 214, 0, 0.25)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontSize: '13px',
        fontFamily: 'var(--font-data)',
        fontVariantNumeric: 'tabular-nums',
        color: '#FFD600',
        width: '100%',
        flexWrap: 'wrap',
      }}
    >
      <span className="pulse-icon" aria-hidden="true" style={{ fontSize: '15px' }}>
        {prob >= 50 ? '⚠' : 'ℹ'}
      </span>
      <span>
        Recession probability:{' '}
        <strong style={{ color, fontWeight: 700 }}>
          {prob.toFixed(1)}%
        </strong>
        {' '}— Signal: {signalLabel(prob)}
      </span>

      {/* Data source + timestamp */}
      <span
        style={{
          fontSize: '10px',
          color: 'var(--text-secondary)',
          opacity: 0.6,
          fontFamily: 'var(--font-data)',
        }}
      >
        {isSeed ? '(seed data)' : updatedText}
      </span>
    </div>
  );
}
