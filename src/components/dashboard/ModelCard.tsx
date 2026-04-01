'use client';

import type { ModelResult } from '@/lib/scoring/engine';
import { Skeleton } from '@/components/ui/Skeleton';
import { PaywallOverlay } from '@/components/auth/PaywallOverlay';
import type { Tier } from '@/lib/auth/permissions';
import { canViewModel } from '@/lib/auth/permissions';

// ─── Color helpers ────────────────────────────────────────────────────────────

function signalBorderColor(signal: string): string {
  switch (signal) {
    case 'low': return 'var(--green)';
    case 'elevated': return 'var(--amber)';
    case 'warning': return '#FF6D00';
    case 'recession': return 'var(--red)';
    default: return 'var(--border-medium)';
  }
}

function signalDotColor(signal: string): string {
  return signalBorderColor(signal);
}

function signalBg(signal: string): string {
  switch (signal) {
    case 'low': return 'rgba(0,200,83,0.06)';
    case 'elevated': return 'rgba(255,214,0,0.06)';
    case 'warning': return 'rgba(255,109,0,0.06)';
    case 'recession': return 'rgba(255,23,68,0.06)';
    default: return 'transparent';
  }
}

// ─── ModelCard ────────────────────────────────────────────────────────────────

interface ModelCardProps {
  model: ModelResult;
}

export function ModelCard({ model }: ModelCardProps) {
  const borderColor = signalBorderColor(model.signal);
  const dotColor = signalDotColor(model.signal);
  const bg = signalBg(model.signal);

  return (
    <details
      style={{
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: '8px',
        background: bg,
      }}
    >
      <summary style={{ padding: '11px 14px', userSelect: 'none' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {/* Left: dot + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: dotColor, flexShrink: 0,
              boxShadow: `0 0 6px ${dotColor}`,
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {model.name}
            </span>
          </div>
          {/* Right: probability + chevron */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span
              className="data-value"
              style={{ fontSize: '16px', fontWeight: 700, color: dotColor }}
            >
              {Math.round(model.probability)}%
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1 }}>
              ▼
            </span>
          </div>
        </div>

        {/* Status line */}
        <div style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          marginTop: '4px',
          paddingLeft: '16px',
          lineHeight: 1.4,
        }}>
          {model.status}
        </div>
      </summary>

      {/* Expanded methodology */}
      <div style={{
        padding: '10px 14px 12px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.55,
        }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Source: </span>
          {model.citation}
        </div>
        {model.inputValue !== null && (
          <div style={{
            marginTop: '6px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-data)',
          }}>
            Input value: <span style={{ color: 'var(--text-primary)' }}>
              {typeof model.inputValue === 'number'
                ? model.inputValue.toFixed(2)
                : model.inputValue}
            </span>
          </div>
        )}
        <div style={{
          marginTop: '6px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '4px',
          background: model.triggered
            ? 'rgba(255,23,68,0.12)'
            : 'rgba(0,200,83,0.10)',
          fontSize: '10px',
          fontFamily: 'var(--font-data)',
          color: model.triggered ? 'var(--red)' : 'var(--green)',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {model.triggered ? '⚠ Triggered' : '✓ Not triggered'}
        </div>
      </div>
    </details>
  );
}

// ─── ModelBreakdown panel ─────────────────────────────────────────────────────

interface ModelBreakdownProps {
  models: ModelResult[];
  isLoading: boolean;
  /** User's current tier — controls PaywallOverlay on models 3-6 */
  tier?: Tier;
}

export function ModelBreakdown({ models, isLoading, tier = 'free' }: ModelBreakdownProps) {
  return (
    <div style={{ padding: '16px' }}>
      <div className="gw-panel-label" style={{ marginBottom: '10px' }}>
        Model Breakdown
      </div>
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={52} borderRadius="8px" />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {models.map((model, index) => {
            const locked = !canViewModel(tier, index);
            return (
              <div
                key={model.model}
                style={{ position: 'relative', borderRadius: '8px' }}
              >
                <ModelCard model={model} />
                {locked && <PaywallOverlay />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
