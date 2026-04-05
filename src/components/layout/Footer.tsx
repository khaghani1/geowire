import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <span>{t('copyright')}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        <Link href="/en/about" className="gw-footer-link">{t('about')}</Link>
        <Separator />
        <Link href="/en/analysis" className="gw-footer-link">Analysis</Link>
        <Separator />
        <Link href="/en/pricing" className="gw-footer-link">{t('pricing')}</Link>
        <Separator />
        <Link href="/en/privacy" className="gw-footer-link">{t('privacy')}</Link>
        <Separator />
        <Link href="/en/terms" className="gw-footer-link">Terms</Link>
        <Separator />
        <Link href="/en/contact" className="gw-footer-link">Contact</Link>
      </div>
    </footer>
  );
}

function Separator() {
  return <span style={{ opacity: 0.3 }}>&middot;</span>;
}
