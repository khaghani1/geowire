'use client';

import dynamic from 'next/dynamic';

const RecessionFactorsLive = dynamic(
  () => import('@/components/home/RecessionFactorsLive').then((m) => ({ default: m.RecessionFactorsLive })),
  {
    ssr: false,
    loading: () => (
      <div>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '16px',
          letterSpacing: '-0.01em',
        }}>
          Recession Factors
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '8px 20px',
        }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                height: '36px',
                marginBottom: '6px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.03)',
              }}
            />
          ))}
        </div>
      </div>
    ),
  }
);

export function RecessionFactorsLiveWrapper() {
  return <RecessionFactorsLive />;
}
