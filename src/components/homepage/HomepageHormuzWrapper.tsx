'use client';

import dynamic from 'next/dynamic';

const HormuzMapHomepage = dynamic(
  () => import('@/components/dashboard/HormuzMap').then((m) => ({ default: m.HormuzMapHomepage })),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: 450,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
          Loading map…
        </span>
      </div>
    ),
  }
);

export function HomepageHormuzWrapper() {
  return <HormuzMapHomepage />;
}
