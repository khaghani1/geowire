import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { NavbarUserMenu } from './NavbarUserMenu';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const t = useTranslations('nav');

  return (
    <nav
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Wordmark */}
      <Link href="/en" className="gw-wordmark">
        GeoWire
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/en/dashboard" className="gw-nav-link">{t('dashboard')}</Link>
        <Link href="/en/analysis" className="gw-nav-link">{t('analysis')}</Link>
        <Link href="/en/about" className="gw-nav-link">{t('methodology')}</Link>
        <Link href="/en/pricing" className="gw-nav-link">{t('pricing')}</Link>

        {/* Language switcher — replaces static "🇺🇸 English" placeholder */}
        <LanguageSwitcher />

        {/* Auth state — client component */}
        <NavbarUserMenu />
      </div>
    </nav>
  );
}
