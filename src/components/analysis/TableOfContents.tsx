'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { ArticleSection } from '@/lib/data/articles';

interface TableOfContentsProps {
  sections: ArticleSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const t = useTranslations('analysis');
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label={t('tableOfContents')}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '14px',
          fontFamily: 'var(--font-data)',
        }}
      >
        {t('tableOfContents')}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sections.map(({ id, heading }) => {
          const isActive = activeId === id;
          return (
            <li key={id} style={{ marginBottom: '6px' }}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  display: 'block',
                  padding: '4px 12px',
                  borderLeft: `2px solid ${isActive ? '#2979FF' : 'rgba(255,255,255,0.08)'}`,
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: isActive ? '#2979FF' : 'rgba(255,255,255,0.5)',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {heading}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
