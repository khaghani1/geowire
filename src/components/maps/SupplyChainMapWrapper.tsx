'use client';

import dynamic from 'next/dynamic';

const SupplyChainMapDynamic = dynamic(
  () => import('@/components/maps/SupplyChainMap'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: 500,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
          Loading supply chain map…
        </span>
      </div>
    ),
  }
);

export function SupplyChainMapWrapper() {
  return <SupplyChainMapDynamic />;
}
