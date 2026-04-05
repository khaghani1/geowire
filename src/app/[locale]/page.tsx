import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import type { Severity } from '@/components/ui/SeverityBadge';
import { HomeKpiCards } from '@/components/home/HomeKpiCards';
import { RecessionFactorsLiveWrapper } from '@/components/home/RecessionFactorsLiveWrapper';
import { TrustBar } from '@/components/home/TrustBar';
import { SparklineCards } from '@/components/dashboard/SparklineCards';
import { GlobeHero } from '@/components/homepage/GlobeHero';
import { ScenarioCards } from '@/components/homepage/ScenarioCards';
import { SupplyChainMapWrapper } from '@/components/maps/SupplyChainMapWrapper';
import { WhatChangedTodayWrapper } from '@/components/home/WhatChangedTodayWrapper';
import { ChartErrorBoundary } from '@/components/dashboard/ChartErrorBoundary';

export const metadata: Metadata = {
  title: 'GeoWire — Real-Time Recession Intelligence Platform',
  description: 'Track how geopolitical conflict cascades into economic risk with live Federal Reserve data, 6 calibrated recession models, and interactive supply chain analysis. Updated hourly.',
  openGraph: {
    title: 'GeoWire — Real-Time Recession Intelligence',
    description: 'Live recession probability from 6 academic models. FRED data updated hourly.',
    type: 'website',
    url: 'https://www.geowire.org',
  },
};

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
      {/* JSON-LD Organization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'GeoWire',
            url: 'https://www.geowire.org',
            description: 'Real-time recession intelligence platform powered by Federal Reserve data and academic models.',
            sameAs: [],
            logo: 'https://www.geowire.org/geowire-icon.svg',
          }),
        }}
      />

      {/* Alert Banner — live recession probability from API */}
      <AlertBannerLiveWrapper />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>

        {/* Hero — Value Proposition */}
        <section style={{ marginBottom: '24px', textAlign: 'center' }}>
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

        {/* 3D Globe — trade route arcs */}
        <section style={{ marginBottom: '32px' }}>
          <ChartErrorBoundary label="3D Globe">
            <GlobeHero />
          </ChartErrorBoundary>
        </section>

        {/* Section separator */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
          margin: '0 0 28px 0',
        }} />

        {/* KPI Cards — live recession probability from FRED */}
        <section style={{ marginBottom: '28px' }}>
          <HomeKpiCards />
        </section>

        {/* Trust Bar — data sources & methodology */}
        <TrustBar />

        {/* Section separator */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
          margin: '24px 0',
        }} />

        {/* Sparkline Cards — mini market charts */}
        <section style={{ marginBottom: '32px' }}>
          <SparklineCards />
        </section>

        {/* Section separator */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
          margin: '0 0 28px 0',
        }} />

        {/* Supply Chain Cascade Map — multi-commodity disruption monitor */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '6px',
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}>
            Global Supply Chain Disruption Monitor
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.5,
          }}>
            Real-time tracking of oil, steel, aluminum, LNG, helium, and sulfur flows disrupted by the 2026 Iran conflict
          </p>
          <ChartErrorBoundary label="Supply Chain Map">
            <SupplyChainMapWrapper />
          </ChartErrorBoundary>
        </section>

        {/* Section separator */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
          margin: '0 0 28px 0',
        }} />

        {/* Scenario Cards — 4 crisis scenarios */}
        <section style={{ marginBottom: '32px' }}>
          <ScenarioCards />
        </section>

        {/* Section separator */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
          margin: '0 0 28px 0',
        }} />

        {/* What Changed Today — live indicator snapshot */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '16px',
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}>
            {t('whatChangedSection.heading')}
          </h2>
          <GlassCard style={{ maxWidth: '720px', margin: '0 auto' }}>
            <WhatChangedTodayWrapper />
          </GlassCard>
        </section>

        {/* Section separator */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
          margin: '0 0 28px 0',
        }} />

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
          <RecessionFactorsLiveWrapper />
        </section>

        {/* Section separator */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
          margin: '24px 0 28px 0',
        }} />

        {/* Explore More — internal cross-links */}
        <section style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}>
            Explore GeoWire
          </h2>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { href: '/en/analysis', label: 'Analysis', desc: '11 in-depth articles' },
              { href: '/en/indicators', label: 'Live Indicators', desc: '6 recession models' },
              { href: '/en/dashboard', label: 'Dashboard', desc: 'Interactive charts' },
              { href: '/en/commodities', label: 'Commodities', desc: '8 supply chains' },
              { href: '/en/about', label: 'Methodology', desc: 'How we model risk' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  minWidth: '160px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 600, color: '#2979FF', marginBottom: '4px' }}>
                  {link.label} →
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {link.desc}
                </span>
              </a>
            ))}
          </div>
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
