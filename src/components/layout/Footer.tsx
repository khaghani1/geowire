export function Footer() {
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
      <span>GeoWire &copy; 2026</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <FooterLink href="/en/about">About</FooterLink>
        <Separator />
        <FooterLink href="/en/methodology">Methodology</FooterLink>
        <Separator />
        <span style={{ opacity: 0.5, cursor: 'default' }}>API (coming soon)</span>
        <Separator />
        <FooterLink href="/en/privacy">Privacy</FooterLink>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      style={{
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        padding: '2px 4px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color =
          'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color =
          'var(--text-secondary)';
      }}
    >
      {children}
    </a>
  );
}

function Separator() {
  return (
    <span style={{ opacity: 0.3 }}>&middot;</span>
  );
}
