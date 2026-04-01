import { useTranslations } from 'next-intl';
import { AlertBanner } from '@/components/layout/AlertBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import type { Severity } from '@/components/ui/SeverityBadge';

// ── Static data keys (content lives in en.json) ──────────────────────────

type KpiKey = 'recessionProbability' | 'oilPriceImpact' | 'supplyChainStress' | 'marketSentiment';
type ArticleKey = 'hormuzDisruption' | 'yieldCurveInversion' | 'sahmRuleWatch';
type FactorKey = 'yieldCurve' | 'oilShock' | 'consumerSentiment' | 'lei' | 'creditSpreads' | 'sahmRule';

const KPI_KEYS: { key: KpiKey; accentColor: string }[] = [
  { key: 'recessionProbability', accentColor: 'var(--amber)' },
  { key: 'oilPriceImpact',       accentColor: 'var(--red)' },
  { key: 'supplyChainStress',    accentColor: 'var(--amber)' },
  { key: 'marketSentiment',      accentColor: 'var(--red)' },
];

const ARTICLE_KEYS: { key: ArticleKey; severity: Severity }[] = [
  { key: 'hormuzDisruption',    severity: 'critical' },
  { key: 'yieldCurveInversion', severity: 'high' },
  { key: 'sahmRuleWatch',       severity: 'high' },
];

const FACTOR_KEYS: { key: FactorKey; indicator: '🔴' | '🟡' | '🟢' }[] = [
  { key: 'yieldCurve',        indicator: '🔴' },
  { key: 'oilShock',          indicator: '🟡' },
  { key: 'consumerSentiment', indicator: '🔴' },
  { key: 'lei',               indicator: '🟡' },
  { key: 'creditSpreads',     indicator: '🟢' },
  { key: 'sahmRule',          indicator: '🟢' },
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

        {/* Hero Section — 4 KPI Cards */}
        <section style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
            className="kpi-grid"
          >
            {KPI_KEYS.map(({ key, accentColor }) => (
              <KpiCardItem
                key={key}
                label={t(`kpi.${key}.label`)}
                value={t(`kpi.${key}.value`)}
                sublabel={t(`kpi.${key}.sublabel`)}
                accentColor={accentColor}
              />
            ))}
          </div>
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

          {/* Right: Recession Factors */}
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
              {t('recessionFactors')}
            </h2>
            <GlassCard style={{ padding: '8px 0' }}>
              {FACTOR_KEYS.map(({ key, indicator }, i) => (
                <RecessionFactorRow
                  key={key}
                  name={t(`factors.${key}.name`)}
                  status={t(`factors.${key}.status`)}
                  indicator={indicator}
                  isLast={i === FACTOR_KEYS.length - 1}
                />
              ))}
            </GlassCard>
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

function KpiCardItem({
  label,
  value,
  sublabel,
  accentColor,
}: {
  label: string;
  value: string;
  sublabel: string;
  accentColor: string;
}) {
  return (
    <GlassCard
      accentColor={accentColor}
      className="kpi-enter"
      style={{ padding: '20px 20px 16px' }}
    >
      <div
        style={{
          fontSize: '12px',
          fontFamily: 'var(--font-body)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '10px',
        }}
      >
        {label}
      </div>
      <div
        className="data-value"
        style={{
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1,
          marginBottom: '6px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {sublabel}
      </div>
    </GlassCard>
  );
}

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

function RecessionFactorRow({
  name,
  status,
  indicator,
  isLast,
}: {
  name: string;
  status: string;
  indicator: '🔴' | '🟡' | '🟢';
  isLast: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 20px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
      }}
    >
      <span
        style={{
          fontSize: '14px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {name}
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-data)',
          }}
        >
          {status}
        </span>
        <span style={{ fontSize: '14px' }} aria-label={status}>
          {indicator}
        </span>
      </div>
    </div>
  );
}
