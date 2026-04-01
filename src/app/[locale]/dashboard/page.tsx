'use client';

import { AlertBanner } from '@/components/layout/AlertBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { RecessionGauge } from '@/components/dashboard/RecessionGauge';
import { ModelBreakdown } from '@/components/dashboard/ModelCard';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { IndicatorTable } from '@/components/dashboard/IndicatorTable';
import { useRecessionScore } from '@/hooks/useRecessionScore';
import { useFredSeries, buildSeriesMap } from '@/hooks/useFredSeries';
import { useProfile } from '@/hooks/useProfile';
import { getTierPermissions, tierLabel } from '@/lib/auth/permissions';

// ─── Quick Actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    id: 'analysis',
    label: 'Full Analysis',
    description: 'Detailed breakdown of all recession indicators',
    icon: '📊',
    href: '#',
    accentColor: 'var(--accent)',
  },
  {
    id: 'calculator',
    label: 'Recession Calculator',
    description: 'Model custom scenarios with your own inputs',
    icon: '🧮',
    href: '#',
    accentColor: 'var(--amber)',
  },
  {
    id: 'methodology',
    label: 'Methodology',
    description: 'How GeoWire builds its composite score',
    icon: '📖',
    href: '#',
    accentColor: 'var(--green)',
  },
];

// ─── Divergence Warning Banner ─────────────────────────────────────────────────

function DivergenceBanner({ chauvetProb, compositeProb }: { chauvetProb: number; compositeProb: number }) {
  const diff = Math.abs(compositeProb - chauvetProb);
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 14px',
      borderRadius: '8px',
      background: 'rgba(255,214,0,0.08)',
      border: '1px solid rgba(255,214,0,0.25)',
      marginBottom: '12px',
    }}>
      <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠</span>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--amber)', fontFamily: 'var(--font-body)', marginBottom: '2px' }}>
          Divergence Warning
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', lineHeight: 1.45 }}>
          Composite score ({compositeProb.toFixed(0)}%) diverges {diff.toFixed(0)}pp from
          Chauvet-Piger ({chauvetProb.toFixed(0)}%). Interpret with caution.
        </div>
      </div>
    </div>
  );
}

// ─── Quick Action Button ───────────────────────────────────────────────────────

function QuickActionButton({
  label,
  description,
  icon,
  href,
  accentColor,
}: typeof QUICK_ACTIONS[0]) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '8px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-subtle)',
        textDecoration: 'none',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = accentColor;
        (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-secondary)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-subtle)';
        (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-glass)';
      }}
    >
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '8px',
        background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
        fontSize: '18px',
        flexShrink: 0,
      }}>
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          marginBottom: '2px',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.35,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {description}
        </div>
      </div>
      <span style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--text-secondary)', flexShrink: 0 }}>→</span>
    </a>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const scoreQuery = useRecessionScore();
  const seriesResults = useFredSeries();
  const { profile, loading: profileLoading } = useProfile();

  const score = scoreQuery.data;
  const isScoreLoading = scoreQuery.isLoading;

  // Build a keyed map once all/some series are loaded
  const seriesMap = buildSeriesMap(seriesResults);
  const isSeriesLoading = seriesResults.some((r) => r.isLoading);

  // Tier-based state
  const tier = profile?.tier ?? 'free';
  const tierPerms = getTierPermissions(tier);
  const callsRemaining = tierPerms.apiCallsPerDay - (profile?.api_calls_today ?? 0);

  // Gauge props — fall back to safe defaults while loading
  const probability = score?.probability ?? 0;
  const signal = score?.signal ?? 'low';
  const confidence = score?.confidence ?? '—';
  const fetchedAt = score?.fetchedAt ?? new Date().toISOString();
  const dataSource = score?.dataSource ?? '—';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
    }}>
      <AlertBanner />
      <Navbar />

      <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>

        {/* Page header */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '4px',
            }}>
              Recession Intelligence Dashboard
            </h1>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
            }}>
              Live composite score — model breakdown, FRED indicators, and alerts in one view.
            </p>
          </div>

          {/* Tier badge — shows for free users, hidden while profile loads */}
          {!profileLoading && tier === 'free' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255,214,0,0.08)',
              border: '1px solid rgba(255,214,0,0.25)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '12px', color: 'var(--amber)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                {tierLabel(tier)}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-data)' }}>
                {Math.max(0, callsRemaining)} API calls remaining today
              </span>
              <a href="#" style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-body)', fontWeight: 600, textDecoration: 'none' }}>
                Upgrade →
              </a>
            </div>
          )}
          {!profileLoading && (tier === 'pro' || tier === 'analyst') && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: 'rgba(41,121,255,0.1)',
              border: '1px solid rgba(41,121,255,0.25)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-data)', fontWeight: 700 }}>
                ✦ {tierLabel(tier)}
              </span>
            </div>
          )}
        </div>

        {/* Divergence warning (only shown when triggered) */}
        {score?.divergenceWarning && score.chauvetPigerProb !== null && (
          <DivergenceBanner
            compositeProb={score.probability}
            chauvetProb={score.chauvetPigerProb}
          />
        )}

        {/* Main 2-column grid */}
        <div
          className="dashboard-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* ── LEFT COLUMN ────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Gauge panel */}
            <GlassCard>
              <RecessionGauge
                probability={probability}
                signal={signal}
                confidence={confidence}
                fetchedAt={fetchedAt}
                dataSource={dataSource}
                isLoading={isScoreLoading}
              />
            </GlassCard>

            {/* Key Indicators table */}
            <GlassCard>
              <IndicatorTable
                seriesMap={seriesMap}
                isLoading={isSeriesLoading && Object.keys(seriesMap).length === 0}
              />
            </GlassCard>
          </div>

          {/* ── RIGHT COLUMN ───────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Model breakdown */}
            <GlassCard>
              <ModelBreakdown
                models={score?.models ?? []}
                isLoading={isScoreLoading}
                tier={tier}
              />
            </GlassCard>

            {/* Alert feed */}
            <GlassCard>
              <AlertFeed isLoading={false} />
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard>
              <div style={{ padding: '16px' }}>
                <div className="gw-panel-label" style={{ marginBottom: '10px' }}>
                  Quick Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {QUICK_ACTIONS.map((action) => (
                    <QuickActionButton key={action.id} {...action} />
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Chauvet-Piger footnote (when data is loaded) */}
        {score && (
          <div style={{
            marginTop: '24px',
            fontSize: '10.5px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.5,
            opacity: 0.7,
          }}>
            Chauvet-Piger (RECPROUSM156N): {score.chauvetPigerProb !== null ? `${score.chauvetPigerProb.toFixed(1)}%` : 'N/A'} ·
            Composite confidence: {confidence} ·
            Data source: {dataSource} ·
            Fetched: {new Date(fetchedAt).toLocaleString()}
          </div>
        )}
      </main>

      <Footer />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
