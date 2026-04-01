'use client';

import dynamic from 'next/dynamic';

const WhatChanged = dynamic(
  () => import('@/components/dashboard/WhatChanged').then((m) => ({ default: m.WhatChanged })),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: '16px' }}>
        <div style={{ width: 120, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 36, marginBottom: 6, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
        ))}
      </div>
    ),
  }
);

export function HomepageWhatChangedWrapper() {
  return <WhatChanged />;
}
