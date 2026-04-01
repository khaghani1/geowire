export default function AnalysisLoading() {
  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px 60px' }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: '32px' }}>
        <div style={shimmer(180, 28)} />
        <div style={{ ...shimmer(400, 14), marginTop: '8px' }} />
      </div>

      {/* Filter skeleton */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[80, 120, 80, 110].map((w, i) => (
          <div key={i} style={shimmer(w, 32)} />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        {[1, 2, 3].map((i) => (
          <div key={i} style={shimmer('100%', 220)} />
        ))}
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
