'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug: _slug }: ShareButtonsProps) {
  const t = useTranslations('analysis');
  const [copied, setCopied] = useState(false);

  function getUrl() {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — ignore
    }
  }

  function handleShareX() {
    const url = getUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  function handleShareLinkedIn() {
    const url = getUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  const buttonStyle: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-data)' }}>
        {t('shareArticle')}:
      </span>
      <button onClick={handleShareX} style={buttonStyle}>
        𝕏 Post
      </button>
      <button onClick={handleShareLinkedIn} style={buttonStyle}>
        LinkedIn
      </button>
      <button onClick={handleCopyLink} style={{ ...buttonStyle, color: copied ? '#00C853' : buttonStyle.color }}>
        {copied ? t('linkCopied') : t('copyLink')}
      </button>
    </div>
  );
}
