import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function TrustBar() {
  const t = useTranslations('home');

  return (
    <section style={{
      marginBottom: '40px',
      padding: '20px 24px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
    }}>
      <div style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        lineHeight: 1.7,
        opacity: 0.85,
      }}>
        <div style={{ marginBottom: '6px' }}>
          {t('trust.dataSources')}
        </div>
        <div style={{ marginBottom: '8px' }}>
          {t('trust.models')}
        </div>
        <Link
          href="/en/about"
          style={{
            fontSize: '13px',
            color: 'var(--blue, #2979FF)',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
          }}
        >
          {t('trust.methodologyLink')}
        </Link>
      </div>
    </section>
  );
}
