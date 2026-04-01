'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Article } from '@/lib/data/articles';

interface ArticleCardProps {
  article: Article;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#FF1744',
  high: '#FFD600',
  elevated: '#FF6D00',
  medium: '#2979FF',
  low: '#00C853',
};

export function ArticleCard({ article }: ArticleCardProps) {
  const t = useTranslations('analysis');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  const color = SEVERITY_COLORS[article.severity] ?? '#2979FF';

  return (
    <Link
      href={`/${locale}/analysis/${article.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <GlassCard
        accentColor={color}
        style={{
          padding: '20px',
          cursor: 'pointer',
          transition: 'transform 0.2s, border-color 0.2s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Topic pills + severity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {article.topics.map((topic) => (
            <span
              key={topic}
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-data)',
              }}
            >
              {t(`topics.${topic}`)}
            </span>
          ))}
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '4px',
              background: `${color}18`,
              color,
              border: `1px solid ${color}40`,
              fontFamily: 'var(--font-data)',
            }}
          >
            {t(`severity.${article.severity}`)}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.35,
          marginBottom: '8px',
        }}>
          {article.title}
        </h3>

        {/* Excerpt */}
        <p style={{
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-body)',
          flex: 1,
          marginBottom: '14px',
        }}>
          {article.excerpt}
        </p>

        {/* Meta row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-data)',
        }}>
          <span>{article.date}</span>
          <span>{t('readingTime', { minutes: article.readingTime })}</span>
        </div>

        {/* Read more */}
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#2979FF',
          fontFamily: 'var(--font-body)',
        }}>
          {t('readMore')}
        </div>
      </GlassCard>
    </Link>
  );
}
