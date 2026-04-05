import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CommodityExplorer } from '@/components/commodities/CommodityExplorer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commodity Explorer — GeoWire',
  description:
    'Track global supply chains, disruptions, and economic transmission across 8 key commodities affected by the 2026 Iran conflict.',
};

export default function CommoditiesPage() {
  return (
    <>
      <AlertBannerLiveWrapper />
      <Navbar />

      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              marginBottom: '8px',
            }}
          >
            Commodity Explorer
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.6,
            }}
          >
            Track global supply chains, disruptions, and economic transmission
          </p>
        </div>

        <CommodityExplorer />
      </main>

      <Footer />
    </>
  );
}