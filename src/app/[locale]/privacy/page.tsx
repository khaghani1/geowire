import type { Metadata } from 'next';
import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — GeoWire',
  description:
    "GeoWire's privacy policy covering data collection, cookies, Google AdSense, and FRED API data usage.",
  openGraph: {
    title: 'Privacy Policy — GeoWire',
    description:
      "GeoWire's privacy policy covering data collection, cookies, Google AdSense, and FRED API data usage.",
    type: 'website',
    url: 'https://www.geowire.org/en/privacy',
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

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-data)',
            marginBottom: '36px',
          }}
        >
          Last updated: April 2026
        </p>

        <p style={bodyStyle}>
          GeoWire (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
          protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard
          your information when you visit geowire.org and use our recession intelligence platform.
        </p>

        <h2 style={headingStyle}>Information We Collect</h2>
        <p style={bodyStyle}>
          <strong style={{ color: 'var(--text-primary)' }}>Account information:</strong> When you
          create a GeoWire account, we collect your email address through Supabase magic link
          authentication. We do not collect or store passwords — authentication is handled entirely
          via secure, time-limited email links.
        </p>
        <p style={bodyStyle}>
          <strong style={{ color: 'var(--text-primary)' }}>Usage analytics:</strong> We collect
          basic, anonymized usage data to understand how visitors interact with the platform. This
          includes pages visited, session duration, and general geographic region derived from IP
          address. We do not use this data to personally identify individual users.
        </p>

        <h2 style={headingStyle}>Google AdSense</h2>
        <p style={bodyStyle}>
          We use Google AdSense to display advertisements on GeoWire. Google and its advertising
          partners may use cookies and web beacons to serve ads based on your prior visits to this
          and other websites. Google&apos;s use of advertising cookies enables it and its partners to
          serve ads based on your browsing history.
        </p>
        <p style={bodyStyle}>
          You can opt out of personalized advertising by visiting{' '}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2979FF', textDecoration: 'none' }}
          >
            Google&apos;s Ads Settings
          </a>
          . You may also visit{' '}
          <a
            href="https://www.aboutads.info"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2979FF', textDecoration: 'none' }}
          >
            aboutads.info
          </a>{' '}
          to opt out of third-party cookies used for personalized advertising.
        </p>

        <h2 style={headingStyle}>FRED Data Attribution</h2>
        <p style={bodyStyle}>
          Economic data displayed on GeoWire is sourced from the Federal Reserve Economic Data
          (FRED) API, maintained by the Federal Reserve Bank of St. Louis. FRED data is publicly
          available and is not user-specific. We do not claim ownership of any Federal Reserve data
          and provide it in accordance with the FRED API terms of use.
        </p>

        <h2 style={headingStyle}>Cookies</h2>
        <p style={bodyStyle}>
          GeoWire uses the following types of cookies:
        </p>
        <p style={bodyStyle}>
          <strong style={{ color: 'var(--text-primary)' }}>Authentication cookies</strong> (Supabase):
          These are essential cookies that maintain your login session. They are set when you
          authenticate via magic link and expire when your session ends or after a period of
          inactivity.
        </p>
        <p style={bodyStyle}>
          <strong style={{ color: 'var(--text-primary)' }}>Analytics cookies:</strong> These help us
          understand how visitors navigate GeoWire so we can improve the platform. They do not
          contain personally identifiable information.
        </p>
        <p style={bodyStyle}>
          <strong style={{ color: 'var(--text-primary)' }}>Advertising cookies</strong> (Google
          AdSense): These are placed by Google and its partners to serve relevant advertisements.
          See the Google AdSense section above for opt-out options.
        </p>

        <h2 style={headingStyle}>Data Retention and Deletion</h2>
        <p style={bodyStyle}>
          We retain your account data (email address and associated preferences) for as long as your
          account remains active. You may delete your account and all associated data at any time by
          contacting us at{' '}
          <a
            href="mailto:contact@geowire.org"
            style={{ color: '#2979FF', textDecoration: 'none' }}
          >
            contact@geowire.org
          </a>
          . Upon receiving a deletion request, we will permanently remove your data within 30 days.
        </p>

        <h2 style={headingStyle}>Data Sharing</h2>
        <p style={bodyStyle}>
          We do not sell, trade, or rent your personal information to third parties. We may share
          anonymized, aggregate usage statistics that cannot be used to identify individual users.
          We may disclose your information if required to do so by law or in response to valid
          legal process.
        </p>

        <h2 style={headingStyle}>Data Security</h2>
        <p style={bodyStyle}>
          We implement industry-standard security measures to protect your information. All data
          transmission is encrypted via TLS/HTTPS. Authentication is handled by Supabase, which
          implements row-level security and encrypted storage. However, no method of electronic
          transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 style={headingStyle}>Contact for Data Requests</h2>
        <p style={bodyStyle}>
          For any questions about this Privacy Policy, to request a copy of your data, or to
          request data deletion, please contact us at{' '}
          <a
            href="mailto:contact@geowire.org"
            style={{ color: '#2979FF', textDecoration: 'none' }}
          >
            contact@geowire.org
          </a>
          .
        </p>

        <h2 style={headingStyle}>Changes to This Policy</h2>
        <p style={bodyStyle}>
          We may update this Privacy Policy from time to time. We will notify registered users of
          material changes via email. The &ldquo;Last updated&rdquo; date at the top of this page
          indicates when the policy was most recently revised. Your continued use of GeoWire after
          any changes constitutes acceptance of the updated policy.
        </p>
      </main>

      <Footer />
    </>
  );
}
