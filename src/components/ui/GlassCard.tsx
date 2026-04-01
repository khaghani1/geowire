import type { ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accentColor?: string;
}

export function GlassCard({
  children,
  className = '',
  style,
  accentColor,
}: GlassCardProps) {
  const borderStyle: CSSProperties = accentColor
    ? { borderLeft: `3px solid ${accentColor}` }
    : {};

  return (
    <div
      className={`glass-card rounded-lg ${className}`}
      style={{ ...borderStyle, ...style }}
    >
      {children}
    </div>
  );
}
