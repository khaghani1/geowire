import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <html lang="en" className="dark">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '480px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: 'rgba(41,121,255,0.2)',
              fontFamily: 'monospace',
              marginBottom: '16px',
            }}
          >
            404
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#f0f0f5',
              marginBottom: '8px',
            }}
          >
            Page Not Found
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            The page you&#39;re looking for doesn&#39;t exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              href="/en"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(41,121,255,0.4)',
                background: 'rgba(41,121,255,0.12)',
                color: '#2979FF',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Go to homepage
            </Link>
            <Link
              href="/en/dashboard"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
