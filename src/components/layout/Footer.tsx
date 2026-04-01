import Link from 'next/link';

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
        <Link href="/en/about" className="gw-footer-link">About</Link>
        <Separator />
        <Link href="/en/methodology" className="gw-footer-link">Methodology</Link>
        <Separator />
        <span style={{ opacity: 0.5, cursor: 'default' }}>API (coming soon)</span>
        <Separator />
        <Link href="/en/privacy" className="gw-footer-link">Privacy</Link>
      </div>
    </footer>
  );
}

function Separator() {
  return <span style={{ opacity: 0.3 }}>&middot;</span>;
}
