import { useTranslations } from 'next-intl';
import { AlertBanner } from '@/components/layout/AlertBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import type { Severity } from '@/components/ui/SeverityBadge';
import { HomeKpiCards } from '@/components/home/HomeKpiCards';
import { HomeRecessionFactors } from '@/components/home/HomeRecessionFactors';
import { TrustBar } from '@/components/home/TrustBar';
import { SparklineCards } from '@/components/dashboard/SparklineCards';

// ── Static data keys (content lives in en.json) ──────────────────────────

type ArticleKey = 'hormuzDisruption' | 'yieldCurveInversion' | 'sahmRuleWatch';

const ARTICLE_KEYS: { key: ArticleKey; severity: Severity }[] = [
  { key: 'hormuzDisruption',    severity: 'critical' },
  { key: 'yieldCurveInversion', severity: 'high' },
  { key: 'sahmRuleWatch',       severity: 'high' },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Alert Banner — first visible element, above nav */}
      <AlertBanner />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>

        {/* Hero — Value Proposition (above the fold, before KPIs) */}
        <section style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '12px',
              lineHeight: 1.2,
            }}
          >
            {t('hero.headline')}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            {t('hero.subheadline')}
          </p>
        </section>

        {/* KPI Cards — live recession probability from FRED */}
        <section style={{ marginBottom: '32px' }}>
          <HomeKpiCards />
        </section>

        {/* Trust Bar — data sources & methodology */}
        <TrustBar />

        {/* Sparkline Cards — mini market charts */}
        <section style={{ marginBottom: '32px', marginTop: '24px' }}>
          <SparklineCards />
        </section>

        {/* Below the Fold — 2-column layout */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
            alignItems: 'start',
          }}
          className="below-fold-grid"
        >
          {/* Left: Latest Intelligence */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '16px',
                letterSpacing: '-0.01em',
              }}
            >
              {t('latestIntelligence')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ARTICLE_KEYS.map(({ key, severity }) => (
                <ArticleCard
                  key={key}
                  title={t(`articles.${key}.title`)}
                  date={t(`articles.${key}.date`)}
                  excerpt={t(`articles.${key}.excerpt`)}
                  severity={severity}
                />
              ))}
            </div>
          </div>

          {/* Right: Recession Factors — live from API */}
          <HomeRecessionFactors />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .below-fold-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function ArticleCard({
  title,
  date,
  excerpt,
  severity,
}: {
  title: string;
  date: string;
  excerpt: string;
  severity: Severity;
}) {
  return (
    <GlassCard style={{ padding: '16px 20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <SeverityBadge severity={severity} />
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-data)',
          }}
        >
          {date}
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '6px',
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          fontFamily: 'var(--font-body)',
        }}
      >
        {excerpt}
      </p>
    </GlassCard>
  );
}
