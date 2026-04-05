/**
 * ArticleDisclaimer — info box shown at top of every article detail page.
 * Alerts readers that data referenced reflects conditions at publication time.
 */

interface ArticleDisclaimerProps {
  publishedAt: string; // ISO date string
  locale: string;
}

export function ArticleDisclaimer({ publishedAt, locale }: ArticleDisclaimerProps) {
  // Format the article date nicely
  let formattedDate: string;
  try {
    const d = new Date(publishedAt);
    formattedDate = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    formattedDate = publishedAt;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '8px',
        background: 'rgba(41,121,255,0.06)',
        border: '1px solid rgba(41,121,255,0.15)',
        marginBottom: '28px',
      }}
    >
      {/* Info icon */}
      <span
        style={{
          fontSize: '16px',
          flexShrink: 0,
          marginTop: '1px',
        }}
        aria-hidden="true"
      >
        ℹ️
      </span>

      {/* Text */}
      <p
        style={{
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-body)',
          margin: 0,
        }}
      >
        Data referenced in this analysis reflects conditions as of{' '}
        <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
          {formattedDate}
        </strong>
        . Current live data is available on the{' '}
        <a
          href={`/${locale}/dashboard`}
          style={{
            color: '#2979FF',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Dashboard
        </a>
        .
      </p>
    </div>
  );
}
