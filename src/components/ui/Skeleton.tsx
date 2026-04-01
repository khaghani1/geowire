/**
 * Generic shimmer skeleton component.
 * Never renders "Loading..." text — only visual placeholder.
 */

interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  height = 20,
  width = '100%',
  borderRadius = '4px',
  className = '',
}: SkeletonProps) {
  return (
    <span
      className={`gw-skeleton ${className}`}
      style={{ height, width, borderRadius, display: 'block' }}
      aria-hidden="true"
    />
  );
}
