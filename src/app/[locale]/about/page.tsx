import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import { AlertBanner } from '@/components/layout/AlertBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'About — GeoWire',
  description:
    'How GeoWire calculates recession probability — methodology, models, data sources, and academic citations.',
};

const MODEL_KEYS = [
  'nyFedProbit',
  'sahmRule',
  'hamiltonNopi',
  'phillyFedLeading',
  'creditSpread',
  'composite',
] as const;

const MODEL_ACCENTS: Record<string, string> = {
  nyFedProbit: '#2979FF',
  sahmRule: '#FF6D00',
  hamiltonNopi: '#FF1744',
  phillyFedLeading: '#00C853',
  creditSpread: '#FFD600',
  composite: '#B388FF',
};

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <>
      <AlertBanner />
      <Navbar />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 60px' }}>
        {/* Header */}
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
            marginBottom: '36px',
          }}
        >
          {t('pageSubtitle')}
        </p>

        {/* Intro */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionHeadingStyle}>{t('introTitle')}</h2>
          <p style={bodyStyle}>{t('introBody')}</p>
        </section>

        {/* Models */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionHeadingStyle}>{t('modelsTitle')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MODEL_KEYS.map((key, i) => (
              <GlassCard key={key} accentColor={MODEL_ACCENTS[key]} style={{ padding: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: `${MODEL_ACCENTS[key]}20`,
                      color: MODEL_ACCENTS[key],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-data)',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {t(`models.${key}.name`)}
                  </h3>
                </div>

                <p style={{ ...bodyStyle, marginBottom: '8px' }}>
                  {t(`models.${key}.description`)}
                </p>

                {/* Citation or note */}
                {hasCitation(key) ? (
                  <p style={citationStyle}>
                    {t(`models.${key}.citation`)}
                  </p>
                ) : (
                  <p style={citationStyle}>
                    {t(`models.${key}.note`)}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionHeadingStyle}>{t('dataSourcesTitle')}</h2>
          <p style={bodyStyle}>{t('dataSourcesBody')}</p>
        </section>

        {/* Disclaimer */}
        <section>
          <GlassCard
            accentColor="#FF1744"
            style={{
              padding: '20px',
              background: 'rgba(255,23,68,0.04)',
              border: '1px solid rgba(255,23,68,0.15)',
            }}
          >
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#FF1744',
                fontFamily: 'var(--font-heading)',
                marginBottom: '8px',
              }}
            >
              {t('disclaimerTitle')}
            </h2>
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {t('disclaimerBody')}
            </p>
          </GlassCard>
        </section>
      </main>

      <Footer />
    </>
  );
}

function hasCitation(key: string): boolean {
  return ['nyFedProbit', 'sahmRule', 'hamiltonNopi'].includes(key);
}

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-heading)',
  marginBottom: '14px',
};

const bodyStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'rgba(255,255,255,0.65)',
  fontFamily: 'var(--font-body)',
};

const citationStyle: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.6,
  color: 'rgba(255,255,255,0.35)',
  fontFamily: 'var(--font-data)',
  fontStyle: 'italic',
};
