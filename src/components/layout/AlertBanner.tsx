import { useTranslations } from 'next-intl';

export function AlertBanner() {
  const t = useTranslations('alertBanner');

  return (
    <div
      style={{
        background:
          'linear-gradient(90deg, rgba(255,23,68,0.18) 0%, rgba(255,214,0,0.14) 100%)',
        borderBottom: '1px solid rgba(255, 214, 0, 0.25)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
        fontFamily: 'var(--font-data)',
        fontVariantNumeric: 'tabular-nums',
        color: '#FFD600',
        width: '100%',
      }}
    >
      <span className="pulse-icon" aria-hidden="true" style={{ fontSize: '15px' }}>
        ⚠
      </span>
      <span>
        {t.rich('message', {
          probability: 62,
          strong: (chunks) => (
            <strong style={{ color: '#FF1744' }}>{chunks}</strong>
          ),
        })}
      </span>
    </div>
  );
}
