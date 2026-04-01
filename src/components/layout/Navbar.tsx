import Link from 'next/link';
import { NavbarUserMenu } from './NavbarUserMenu';

export function Navbar() {
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
        <Link href="/en/dashboard" className="gw-nav-link">Dashboard</Link>
        <Link href="/en/analysis" className="gw-nav-link">Analysis</Link>
        <Link href="/en/calculator" className="gw-nav-link">Calculator</Link>

        {/* Language placeholder */}
        <span className="gw-lang-badge">
          🇺🇸 English
        </span>

        {/* Auth state — client component */}
        <NavbarUserMenu />
      </div>
    </nav>
  );
}
