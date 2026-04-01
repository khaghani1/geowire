export function AlertBanner() {
  return (
    <div
      style={{
        background:
          'linear-gradient(90deg, rgba(255,23,68,0.18) 0%, rgba(255,214,0,0.14) 100%)',
        borderBottom: '1px solid rgba(255, 214, 0, 0.25)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
        fontFamily: 'var(--font-data)',
        fontVariantNumeric: 'tabular-nums',
        color: '#FFD600',
        width: '100%',
      }}
    >
      <span className="pulse-icon" aria-hidden="true" style={{ fontSize: '15px' }}>
        ⚠
      </span>
      <span>
        Strait of Hormuz disruption risk elevated &mdash; Recession probability:{' '}
        <strong style={{ color: '#FF1744' }}>62%</strong>
      </span>
    </div>
  );
}
