export type Severity = 'critical' | 'high' | 'medium' | 'low';

interface SeverityBadgeProps {
  severity: Severity;
  label?: string;
}

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; bg: string; color: string; border: string }
> = {
  critical: {
    label: 'Critical',
    bg: 'rgba(255, 23, 68, 0.15)',
    color: '#FF1744',
    border: 'rgba(255, 23, 68, 0.3)',
  },
  high: {
    label: 'High',
    bg: 'rgba(255, 214, 0, 0.12)',
    color: '#FFD600',
    border: 'rgba(255, 214, 0, 0.3)',
  },
  medium: {
    label: 'Medium',
    bg: 'rgba(41, 121, 255, 0.12)',
    color: '#2979FF',
    border: 'rgba(41, 121, 255, 0.3)',
  },
  low: {
    label: 'Low',
    bg: 'rgba(0, 200, 83, 0.12)',
    color: '#00C853',
    border: 'rgba(0, 200, 83, 0.3)',
  },
};

export function SeverityBadge({ severity, label }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  const displayLabel = label ?? config.label;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontFamily: 'var(--font-data)',
      }}
    >
      {displayLabel}
    </span>
  );
}
