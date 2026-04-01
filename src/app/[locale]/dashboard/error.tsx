'use client';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          padding: '32px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,109,0,0.1)',
            border: '1px solid rgba(255,109,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '22px',
          }}
        >
          ⚠
        </div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '8px',
          }}
        >
          Dashboard unavailable
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
            marginBottom: '8px',
          }}
        >
          The dashboard failed to load. This is usually caused by a temporary issue with the
          FRED data API. The scoring engine will automatically fall back to seed data on
          the next attempt.
        </p>
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-data)',
            marginBottom: '20px',
          }}
        >
          {error.digest ? `Error ID: ${error.digest}` : ''}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '10px 28px',
            borderRadius: '8px',
            border: '1px solid rgba(41,121,255,0.4)',
            background: 'rgba(41,121,255,0.12)',
            color: '#2979FF',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
