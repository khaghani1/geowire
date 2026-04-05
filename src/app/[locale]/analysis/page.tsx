import { useTranslations } from 'next-intl';
import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleGrid } from '@/components/analysis/ArticleGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analysis — GeoWire',
  description:
    'Deep-dive intelligence on recession risk, energy markets, and supply-chain disruptions.',
};

export default function AnalysisPage() {
  const t = useTranslations('analysis');

  return (
    <>
      <AlertBannerLiveWrapper />
      <Navbar />

      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px 60px' }}>
        {/* Header */}
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
            {t('pageTitle')}
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.6,
            }}
          >
            {t('pageSubtitle')}
          </p>
        </div>

        {/* Filter tabs + article grid (client) */}
        <ArticleGrid />
      </main>

      <Footer />
    </>
  );
}
