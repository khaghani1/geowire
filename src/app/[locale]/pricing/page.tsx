import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'Pricing — GeoWire',
  description:
    'GeoWire pricing — free tier with 3 models and 10 API calls/day, or Pro at $49/mo for all 6 models and real-time data.',
};

const FREE_FEATURES = ['f1', 'f2', 'f3', 'f4', 'f5'] as const;
const PRO_FEATURES = ['f1', 'f2', 'f3', 'f4', 'f5'] as const;
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const;

export default function PricingPage() {
  const t = useTranslations('pricing');

  return (
    <>
      <AlertBannerLiveWrapper />
      <Navbar />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 60px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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

        {/* Pricing cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          {/* Free tier */}
          <GlassCard style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={tierNameStyle}>{t('freeTier.name')}</h2>
            <div style={{ marginBottom: '20px' }}>
              <span style={priceStyle}>{t('freeTier.price')}</span>
              <span style={periodStyle}> {t('freeTier.period')}</span>
            </div>
            <ul style={featureListStyle}>
              {FREE_FEATURES.map((key) => (
                <li key={key} style={featureItemStyle}>
                  <span style={{ color: '#00C853' }}>&#10003;</span> {t(`freeTier.features.${key}`)}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <span
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 0',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {t('freeTier.cta')}
              </span>
            </div>
          </GlassCard>

          {/* Pro tier */}
          <GlassCard
            accentColor="#2979FF"
            style={{
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(41,121,255,0.3)',
              background: 'rgba(41,121,255,0.04)',
            }}
          >
            <h2 style={{ ...tierNameStyle, color: '#2979FF' }}>{t('proTier.name')}</h2>
            <div style={{ marginBottom: '20px' }}>
              <span style={priceStyle}>{t('proTier.price')}</span>
              <span style={periodStyle}>{t('proTier.period')}</span>
            </div>
            <ul style={featureListStyle}>
              {PRO_FEATURES.map((key) => (
                <li key={key} style={featureItemStyle}>
                  <span style={{ color: '#2979FF' }}>&#10003;</span> {t(`proTier.features.${key}`)}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <span
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 0',
                  borderRadius: '8px',
                  background: 'rgba(41,121,255,0.15)',
                  border: '1px solid rgba(41,121,255,0.3)',
                  color: '#2979FF',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  cursor: 'default',
                }}
              >
                {t('proTier.cta')}
              </span>
            </div>
          </GlassCard>
        </div>

        {/* FAQ */}
        <section>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {t('faqTitle')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '680px', margin: '0 auto' }}>
            {FAQ_KEYS.map((key) => (
              <GlassCard key={key} style={{ padding: '18px 20px' }}>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '8px',
                  }}
                >
                  {t(`faq.${key}.question`)}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.55)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {t(`faq.${key}.answer`)}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const tierNameStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-heading)',
  marginBottom: '8px',
};

const priceStyle: React.CSSProperties = {
  fontSize: '42px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-heading)',
  lineHeight: 1,
};

const periodStyle: React.CSSProperties = {
  fontSize: '14px',
  color: 'rgba(255,255,255,0.4)',
  fontFamily: 'var(--font-body)',
};

const featureListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const featureItemStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(255,255,255,0.65)',
  fontFamily: 'var(--font-body)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};
