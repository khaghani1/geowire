import Link from 'next/link';

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
      <Link
        href="/en"
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '20px',
          color: 'var(--text-primary)',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}
      >
        GeoWire
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <NavLink href="/en/dashboard">Dashboard</NavLink>
        <NavLink href="/en/analysis">Analysis</NavLink>
        <NavLink href="/en/calculator">Calculator</NavLink>

        {/* Language placeholder */}
        <span
          style={{
            marginLeft: '8px',
            padding: '6px 12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            cursor: 'default',
            fontFamily: 'var(--font-body)',
          }}
        >
          🇺🇸 English
        </span>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '14px',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontFamily: 'var(--font-body)',
        transition: 'color 0.15s, background 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color =
          'var(--text-primary)';
        (e.currentTarget as HTMLAnchorElement).style.background =
          'var(--bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color =
          'var(--text-secondary)';
        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
      }}
    >
      {children}
    </Link>
  );
}
