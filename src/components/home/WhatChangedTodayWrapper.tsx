'use client';

import dynamic from 'next/dynamic';

const WhatChangedToday = dynamic(
  () => import('@/components/home/WhatChangedToday').then((m) => ({ default: m.WhatChangedToday })),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: '16px' }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              height: '44px',
              marginBottom: '8px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.03)',
            }}
          />
        ))}
      </div>
    ),
  }
);

export function WhatChangedTodayWrapper() {
  return <WhatChangedToday />;
}
