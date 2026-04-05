import type { Metadata } from 'next';
import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — GeoWire',
  description:
    'Terms of service for GeoWire\'s recession intelligence platform, covering data usage, account terms, and liability limitations.',
  openGraph: {
    title: 'Terms of Service — GeoWire',
    description:
      'Terms of service for GeoWire\'s recession intelligence platform.',
    type: 'website',
    url: 'https://www.geowire.org/en/terms',
  },
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const headingStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-heading)',
  marginBottom: '14px',
  marginTop: '36px',
};

const bodyStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.8,
  color: 'rgba(255,255,255,0.65)',
  fontFamily: 'var(--font-body)',
  marginBottom: '16px',
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TermsPage() {
  return (
    <>
      <AlertBannerLiveWrapper />
      <Navbar />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 60px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '8px',
          }}
        >
          Terms of Service
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-data)',
            marginBottom: '36px',
          }}
        >
          Effective date: April 2026
        </p>

        <p style={bodyStyle}>
          By accessing or using GeoWire (&ldquo;the Platform&rdquo;), you agree to be bound by
          these Terms of Service. If you do not agree to these terms, please do not use the
          Platform.
        </p>

        <h2 style={headingStyle}>1. Nature of Service</h2>
        <p style={bodyStyle}>
          GeoWire provides economic data, recession probability estimates, and geopolitical risk
          analysis for <strong style={{ color: 'var(--text-primary)' }}>informational purposes
          only</strong>. The Platform is not a registered investment adviser, broker-dealer, or
          financial planner. Nothing on GeoWire constitutes financial, investment, trading, tax,
          or legal advice. You should consult qualified professionals before making any financial
          decisions.
        </p>

        <h2 style={headingStyle}>2. No Warranty on Data</h2>
        <p style={bodyStyle}>
          GeoWire provides recession probability estimates, model outputs, and economic indicators
          on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no warranties,
          express or implied, regarding the accuracy, completeness, timeliness, or reliability of
          any data, model prediction, or analysis presented on the Platform.
        </p>
        <p style={bodyStyle}>
          Economic data is sourced from the Federal Reserve Economic Data (FRED) API and is subject
          to revision by the Federal Reserve Bank of St. Louis. Historical model accuracy does not
          guarantee future performance. Recession probability estimates are based on statistical
          models with inherent uncertainty.
        </p>

        <h2 style={headingStyle}>3. User Accounts</h2>
        <p style={bodyStyle}>
          GeoWire offers free and paid (Pro) account tiers. By creating an account, you agree to
          provide a valid email address and to keep your account information current. You are
          responsible for all activity that occurs under your account. GeoWire reserves the right
          to suspend or terminate accounts that violate these terms or that remain inactive for
          an extended period, with reasonable notice provided where practicable.
        </p>

        <h2 style={headingStyle}>4. Acceptable Use</h2>
        <p style={bodyStyle}>
          You agree not to:
        </p>
        <p style={bodyStyle}>
          Scrape, crawl, or use automated means to extract data from GeoWire beyond the published
          API endpoints and their documented rate limits. Redistribute, resell, or sublicense
          GeoWire data, analysis, or model outputs without prior written permission. Exceed the
          API rate limits for your account tier (Free: 10 calls/day; Pro: 500 calls/day). Attempt
          to reverse-engineer, decompile, or extract the proprietary composite scoring methodology.
          Use the Platform for any purpose that is unlawful or prohibited by these terms.
        </p>

        <h2 style={headingStyle}>5. Intellectual Property</h2>
        <p style={bodyStyle}>
          GeoWire&apos;s analysis, commentary, composite recession scoring methodology, model
          weighting system, user interface design, and original content are proprietary and
          protected by applicable intellectual property laws. The underlying economic data from
          FRED is public domain; GeoWire&apos;s analysis and presentation of that data is not.
        </p>

        <h2 style={headingStyle}>6. Limitation of Liability</h2>
        <p style={bodyStyle}>
          To the fullest extent permitted by applicable law, GeoWire shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of
          profits, revenue, data, or business opportunities arising out of or related to your use
          of the Platform. GeoWire is not liable for financial losses, investment decisions, or
          trading outcomes based on data, analysis, or probability estimates obtained from the
          Platform.
        </p>
        <p style={bodyStyle}>
          In no event shall GeoWire&apos;s total liability to you for all claims arising from or
          related to your use of the Platform exceed the amount you paid to GeoWire, if any, during
          the twelve (12) months preceding the claim.
        </p>

        <h2 style={headingStyle}>7. Indemnification</h2>
        <p style={bodyStyle}>
          You agree to indemnify and hold harmless GeoWire from any claims, losses, damages,
          liabilities, and expenses (including reasonable attorneys&apos; fees) arising out of your
          use of the Platform, your violation of these terms, or your violation of any third
          party&apos;s rights.
        </p>

        <h2 style={headingStyle}>8. Modification of Terms</h2>
        <p style={bodyStyle}>
          GeoWire reserves the right to modify these Terms of Service at any time. Material changes
          will be communicated to registered users via email at least 14 days before taking effect.
          Your continued use of the Platform after changes take effect constitutes acceptance of the
          modified terms.
        </p>

        <h2 style={headingStyle}>9. Termination</h2>
        <p style={bodyStyle}>
          You may terminate your account at any time by contacting contact@geowire.org. GeoWire may
          terminate or suspend your access for violation of these terms, with notice where
          practicable. Upon termination, your right to access the Platform ceases immediately, but
          provisions that by their nature should survive (including limitation of liability and
          indemnification) will remain in effect.
        </p>

        <h2 style={headingStyle}>10. Governing Law</h2>
        <p style={bodyStyle}>
          These Terms of Service shall be governed by and construed in accordance with the laws of
          the United States. Any disputes arising from or relating to these terms or your use of
          the Platform shall be resolved in the state or federal courts located within the United
          States.
        </p>

        <h2 style={headingStyle}>11. Contact</h2>
        <p style={bodyStyle}>
          For questions about these Terms of Service, please contact us at{' '}
          <a
            href="mailto:contact@geowire.org"
            style={{ color: '#2979FF', textDecoration: 'none' }}
          >
            contact@geowire.org
          </a>
          .
        </p>
      </main>

      <Footer />
    </>
  );
}
