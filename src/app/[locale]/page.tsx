import { AlertBanner } from '@/components/layout/AlertBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import type { Severity } from '@/components/ui/SeverityBadge';

// ── Seed data (hardcoded for Session 1) ──────────────────────────────

interface KpiCard {
  label: string;
  value: string;
  sublabel: string;
  accentColor: string;
}

const KPI_CARDS: KpiCard[] = [
  {
    label: 'Recession Probability',
    value: '62%',
    sublabel: '12-month horizon',
    accentColor: 'var(--amber)',
  },
  {
    label: 'Oil Price Impact',
    value: '+$18.40',
    sublabel: 'above baseline',
    accentColor: 'var(--red)',
  },
  {
    label: 'Supply Chain Stress',
    value: '7.2 / 10',
    sublabel: 'composite index',
    accentColor: 'var(--amber)',
  },
  {
    label: 'Market Sentiment',
    value: 'Fear',
    sublabel: 'CNN Fear & Greed proxy',
    accentColor: 'var(--red)',
  },
];

interface Article {
  id: string;
  title: string;
  date: string;
  severity: Severity;
  excerpt: string;
}

const ARTICLES: Article[] = [
  {
    id: 'hormuz-disruption',
    title: 'Strait of Hormuz Disruption Elevates Energy Shock Risk',
    date: 'Mar 31, 2026',
    severity: 'critical',
    excerpt:
      'Naval tensions in the Persian Gulf have pushed WTI crude above $105, threatening to trigger the Hamilton oil-shock threshold that historically precedes recession within 12 months.',
  },
  {
    id: 'yield-curve-inversion',
    title: 'Yield Curve Remains Inverted for 18th Consecutive Month',
    date: 'Mar 28, 2026',
    severity: 'high',
    excerpt:
      'The 10Y-2Y spread sits at -42bps. The Estrella-Mishkin probit model assigns a 62% probability of recession within the next 12 months based on current spread levels.',
  },
  {
    id: 'sahm-rule-watch',
    title: 'Sahm Rule Indicator Approaches Trigger Threshold',
    date: 'Mar 25, 2026',
    severity: 'high',
    excerpt:
      "The 3-month moving average of unemployment has risen 0.38 percentage points above its 12-month minimum — within 0.12pp of Claudia Sahm's recession trigger at 0.50pp.",
  },
];

interface RecessionFactor {
  name: string;
  status: string;
  indicator: '🔴' | '🟡' | '🟢';
}

const RECESSION_FACTORS: RecessionFactor[] = [
  { name: 'Yield Curve', status: 'Inverted', indicator: '🔴' },
  { name: 'Oil Shock', status: 'Elevated', indicator: '🟡' },
  { name: 'Consumer Sentiment', status: 'Deteriorating', indicator: '🔴' },
  { name: 'LEI', status: 'Declining', indicator: '🟡' },
  { name: 'Credit Spreads', status: 'Normal', indicator: '🟢' },
  { name: 'Sahm Rule', status: 'Not Triggered', indicator: '🟢' },
];

// ── Component ─────────────────────────────────────────────────────────

export default function HomePage() {
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
            {KPI_CARDS.map((card) => (
              <KpiCardItem key={card.label} card={card} />
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
              Latest Intelligence
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ARTICLES.map((article) => (
                <ArticleCard key={article.id} article={article} />
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
              Recession Factors
            </h2>
            <GlassCard style={{ padding: '8px 0' }}>
              {RECESSION_FACTORS.map((factor, i) => (
                <RecessionFactorRow
                  key={factor.name}
                  factor={factor}
                  isLast={i === RECESSION_FACTORS.length - 1}
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

// ── Sub-components ────────────────────────────────────────────────────

function KpiCardItem({ card }: { card: KpiCard }) {
  return (
    <GlassCard
      accentColor={card.accentColor}
      className={`kpi-enter`}
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
        {card.label}
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
        {card.value}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {card.sublabel}
      </div>
    </GlassCard>
  );
}

function ArticleCard({ article }: { article: Article }) {
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
        <SeverityBadge severity={article.severity} />
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-data)',
          }}
        >
          {article.date}
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
        {article.title}
      </h3>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          fontFamily: 'var(--font-body)',
        }}
      >
        {article.excerpt}
      </p>
    </GlassCard>
  );
}

function RecessionFactorRow({
  factor,
  isLast,
}: {
  factor: RecessionFactor;
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
        {factor.name}
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
          {factor.status}
        </span>
        <span style={{ fontSize: '14px' }} aria-label={factor.status}>
          {factor.indicator}
        </span>
      </div>
    </div>
  );
}
