'use client';

import { useRecessionScore } from '@/hooks/useRecessionScore';
import { useFredSeries, buildSeriesMap } from '@/hooks/useFredSeries';
import { latestValue } from '@/lib/data/fred';
import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import type { SignalLevel } from '@/lib/scoring/engine';

// ─── Signal Color Mapping ─────────────────────────────────────────────────────

const SIGNAL_COLORS: Record<SignalLevel, string> = {
  low: '#00C853',
  elevated: '#FFB300',
  warning: '#FF6D00',
  recession: '#FF1744',
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        animation: 'shimmer 2s infinite',
      }}
    >
      <div
        style={{
          height: '24px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          marginBottom: '12px',
          animation: 'shimmer 2s infinite',
        }}
      />
      <div
        style={{
          height: '16px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '4px',
          animation: 'shimmer 2s infinite',
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IndicatorsPage() {
  const { data, isLoading, error } = useRecessionScore();

  const compositeProb = data?.probability ?? 0;
  const compositeSignal = data?.signal ?? 'low';
  const models = data?.models ?? [];
  const fetchedAt = data?.fetchedAt ?? new Date().toISOString();
  const dataSource = data?.dataSource ?? 'live';

  // Format timestamp
  const formattedTime = new Date(fetchedAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
      <AlertBannerLiveWrapper />
      <Navbar />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 60px' }}>
        {/* Header */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '8px',
          }}
        >
          Recession Indicators
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          Live recession probability powered by 6 academic models and 13 Federal Reserve indicators.
        </p>

        {/* Composite Score Card */}
        <GlassCard
          accentColor={SIGNAL_COLORS[compositeSignal]}
          style={{
            padding: '32px',
            marginBottom: '40px',
            textAlign: 'center',
            background: `rgba(0,0,0,0.2)`,
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '12px',
              }}
            >
              Composite Recession Probability
            </p>
            <div
              style={{
                fontSize: '56px',
                fontWeight: 700,
                color: SIGNAL_COLORS[compositeSignal],
                fontFamily: 'var(--font-data)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {isLoading ? '—' : `${compositeProb.toFixed(1)}%`}
            </div>
          </div>

          {/* Signal Label */}
          <div
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '20px',
              background: `${SIGNAL_COLORS[compositeSignal]}20`,
              border: `1px solid ${SIGNAL_COLORS[compositeSignal]}40`,
              fontSize: '12px',
              fontWeight: 600,
              color: SIGNAL_COLORS[compositeSignal],
              fontFamily: 'var(--font-body)',
              textTransform: 'capitalize',
            }}
          >
            {compositeSignal}
          </div>

          {/* Metadata */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <div>Last updated: {formattedTime}</div>
            <div style={{ marginTop: '6px' }}>
              Source:{' '}
              <span style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)' }}>
                {dataSource}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Models Table */}
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              marginBottom: '16px',
            }}
          >
            Model Outputs
          </h2>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : error ? (
            <GlassCard
              accentColor="#FF1744"
              style={{
                padding: '20px',
                background: 'rgba(255,23,68,0.04)',
                border: '1px solid rgba(255,23,68,0.15)',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  color: '#FF1744',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Error loading indicators: {error.message}
              </p>
            </GlassCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {models.map((model) => (
                <GlassCard
                  key={model.model}
                  accentColor={SIGNAL_COLORS[model.signal]}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading)',
                        marginBottom: '6px',
                      }}
                    >
                      {model.name}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'var(--font-body)',
                        margin: 0,
                      }}
                    >
                      {model.status}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginLeft: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {/* Probability */}
                    <div
                      style={{
                        textAlign: 'right',
                        minWidth: '80px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: SIGNAL_COLORS[model.signal],
                          fontFamily: 'var(--font-data)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {model.probability.toFixed(1)}%
                      </div>
                    </div>

                    {/* Signal Badge */}
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        background: `${SIGNAL_COLORS[model.signal]}20`,
                        border: `1px solid ${SIGNAL_COLORS[model.signal]}40`,
                        fontSize: '11px',
                        fontWeight: 600,
                        color: SIGNAL_COLORS[model.signal],
                        fontFamily: 'var(--font-body)',
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {model.signal}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* FRED Indicators Table — all 13 series */}
        <FredIndicatorsTable />

        {/* CTA */}
        <GlassCard
          accentColor="var(--accent)"
          style={{
            padding: '32px',
            textAlign: 'center',
            background: 'rgba(41,121,255,0.06)',
            border: '1px solid rgba(41,121,255,0.2)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              marginBottom: '12px',
            }}
          >
            Want more insights?
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-body)',
              marginBottom: '20px',
            }}
          >
            Sign up free for interactive dashboard, historical charts, and AI briefings
          </p>
          <a
            href="/en/auth/login"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              transition: 'opacity 0.2s, transform 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Sign Up Free
          </a>
        </GlassCard>

        {/* Cross-links */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '24px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: '32px',
        }}>
          <a href="/en/analysis" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#2979FF', textDecoration: 'none' }}>
            📰 Read Analysis
          </a>
          <a href="/en/dashboard" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#2979FF', textDecoration: 'none' }}>
            📈 Interactive Dashboard
          </a>
          <a href="/en/about" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#2979FF', textDecoration: 'none' }}>
            🔬 Methodology
          </a>
        </div>
      </main>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'GeoWire Recession Indicators',
            description:
              'Live recession probability score powered by 6 academic models and 13 Federal Reserve indicators',
            url: 'https://www.geowire.org/en/indicators',
            creator: { '@type': 'Organization', name: 'GeoWire' },
            license: 'Public domain — FRED data',
            variableMeasured: [
              'Recession Probability',
              'Treasury Yield Spread',
              'Unemployment Rate',
              'Oil Prices',
              'Credit Spreads',
              'Leading Index',
              'Consumer Sentiment',
            ],
          }),
        }}
      />

      <Footer />
    </>
  );
}

// ─── FRED Indicators Table ───────────────────────────────────────────────────

/** Human-readable metadata for each of the 13 FRED series */
const FRED_META: Record<string, { shortName: string; format: (v: number) => string; category: string }> = {
  DCOILWTICO:      { shortName: 'WTI Crude Oil',          format: (v) => `$${v.toFixed(2)}/bbl`,       category: 'Commodities' },
  T10Y2Y:          { shortName: '10Y–2Y Spread',          format: (v) => `${v.toFixed(2)}%`,            category: 'Yield Curve' },
  T10Y3M:          { shortName: '10Y–3M Spread',          format: (v) => `${v.toFixed(2)}%`,            category: 'Yield Curve' },
  T10YFF:          { shortName: '10Y–Fed Funds',          format: (v) => `${v.toFixed(2)}%`,            category: 'Yield Curve' },
  UNRATE:          { shortName: 'Unemployment Rate',      format: (v) => `${v.toFixed(1)}%`,            category: 'Labor Market' },
  ICSA:            { shortName: 'Initial Jobless Claims',  format: (v) => `${(v / 1000).toFixed(0)}K`,  category: 'Labor Market' },
  SAHMCURRENT:     { shortName: 'Sahm Rule',              format: (v) => `${v.toFixed(2)} pp`,          category: 'Labor Market' },
  UMCSENT:         { shortName: 'Consumer Sentiment',     format: (v) => v.toFixed(1),                  category: 'Consumer' },
  USSLIND:         { shortName: 'Philly Fed Leading',     format: (v) => `${v.toFixed(2)}%`,            category: 'Leading Index' },
  RECPROUSM156N:   { shortName: 'Chauvet-Piger Prob.',    format: (v) => `${v.toFixed(2)}%`,            category: 'Recession Prob.' },
  BAMLH0A0HYM2:   { shortName: 'HY Credit Spread',       format: (v) => `${v.toFixed(2)}%`,            category: 'Credit' },
  CPIAUCSL:        { shortName: 'CPI (All Items)',         format: (v) => v.toFixed(1),                  category: 'Inflation' },
  GDPC1:           { shortName: 'Real GDP',                format: (v) => `$${(v / 1000).toFixed(1)}T`, category: 'Output' },
};

function FredIndicatorsTable() {
  const fredResults = useFredSeries();
  const seriesMap = buildSeriesMap(fredResults);
  const anyLoading = fredResults.some((r) => r.isLoading);

  const rows = Object.entries(FRED_META).map(([id, meta]) => {
    const result = seriesMap[id];
    const val = result ? latestValue(result) : null;
    const lastDate = result?.observations?.filter((o) => o.value !== null).slice(-1)[0]?.date;
    return { id, ...meta, value: val, frequency: result?.frequency ?? '—', lastDate };
  });

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginBottom: '6px',
        }}
      >
        Federal Reserve Indicators
      </h2>
      <p
        style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: 'var(--font-body)',
          marginBottom: '16px',
        }}
      >
        All 13 FRED series powering GeoWire&apos;s recession models — updated live from the St. Louis Federal Reserve.
      </p>

      {anyLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array(13).fill(null).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                {['Indicator', 'Category', 'Latest Value', 'Frequency', 'As Of'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.45)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {row.shortName}
                    <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-data)' }}>
                      {row.id}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)' }}>
                    {row.category}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      fontFamily: 'var(--font-data)',
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {row.value !== null ? row.format(row.value) : '—'}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)' }}>
                    {row.frequency}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-data)', fontSize: '12px' }}>
                    {row.lastDate ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
