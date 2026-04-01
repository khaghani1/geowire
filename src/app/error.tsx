'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error: _error, reset }: ErrorPageProps) {
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
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255,23,68,0.1)',
              border: '1px solid rgba(255,23,68,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '28px',
            }}
          >
            ⚠
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#f0f0f5',
              marginBottom: '8px',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            An unexpected error occurred. Our team has been notified.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(41,121,255,0.4)',
                background: 'rgba(41,121,255,0.12)',
                color: '#2979FF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/en"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Go to homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
