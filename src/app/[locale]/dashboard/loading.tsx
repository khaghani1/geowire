export default function DashboardLoading() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: '24px' }}>
        <div style={shimmer(280, 28)} />
        <div style={{ ...shimmer(400, 14), marginTop: '8px' }} />
      </div>

      {/* Grid skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
        }}
      >
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={shimmer('100%', 240)} />
          <div style={shimmer('100%', 200)} />
        </div>
        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={shimmer('100%', 240)} />
          <div style={shimmer('100%', 200)} />
        </div>
      </div>
    </div>
  );
}

function shimmer(width: number | string, height: number): React.CSSProperties {
  return {
    width,
    height: `${height}px`,
    borderRadius: '8px',
    background:
      'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };
}
