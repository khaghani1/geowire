'use client';

import dynamic from 'next/dynamic';

const AlertBannerLive = dynamic(
  () => import('@/components/layout/AlertBannerLive').then((m) => ({ default: m.AlertBannerLive })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '8px 24px',
          fontSize: '13px',
          fontFamily: 'var(--font-data)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
        }}
      >
        Loading recession probability...
      </div>
    ),
  }
);

export function AlertBannerLiveWrapper() {
  return <AlertBannerLive />;
}
