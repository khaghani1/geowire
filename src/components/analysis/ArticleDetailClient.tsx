'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { TableOfContents } from './TableOfContents';
import { ShareButtons } from './ShareButtons';
import { ArticleCard } from './ArticleCard';
import type { Article } from '@/lib/data/articles';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#FF1744',
  high: '#FFD600',
  elevated: '#FF6D00',
  medium: '#2979FF',
  low: '#00C853',
};

interface ArticleDetailClientProps {
  article: Article;
  related: Article[];
  locale: string;
}

export function ArticleDetailClient({ article, related, locale }: ArticleDetailClientProps) {
  const t = useTranslations('analysis');
  const color = SEVERITY_COLORS[article.severity] ?? '#2979FF';

  return (
    <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '32px 24px 60px' }}>
      {/* Back link */}
      <Link
        href={`/${locale}/analysis`}
        style={{
          fontSize: '13px',
          color: '#2979FF',
          textDecoration: 'none',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          display: 'inline-block',
          marginBottom: '24px',
        }}
      >
        {t('backToAnalysis')}
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 260px',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        {/* ─── Article body ───────────────────────────────────────────── */}
        <article>
          {/* Meta pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
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
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              marginBottom: '8px',
            }}
          >
            {article.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.5,
              marginBottom: '16px',
            }}
          >
            {article.subtitle}
          </p>

          {/* Author / date / reading time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-data)',
              marginBottom: '28px',
              flexWrap: 'wrap',
            }}
          >
            <span>{t('byAuthor', { author: article.author })}</span>
            <span>{article.date}</span>
            <span>{t('readingTime', { minutes: article.readingTime })}</span>
          </div>

          {/* Share buttons */}
          <div style={{ marginBottom: '32px' }}>
            <ShareButtons title={article.title} slug={article.slug} />
          </div>

          {/* Sections */}
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} style={{ marginBottom: '36px' }}>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '14px',
                  scrollMarginTop: '80px',
                }}
              >
                {section.heading}
              </h2>
              {section.body.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.75,
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-body)',
                    marginBottom: '16px',
                  }}
                >
                  {para}
                </p>
              ))}
            </section>
          ))}
        </article>

        {/* ─── Sidebar: TOC (sticky) ──────────────────────────────── */}
        <aside
          style={{
            position: 'sticky',
            top: '80px',
            alignSelf: 'start',
          }}
        >
          <GlassCard style={{ padding: '20px' }}>
            <TableOfContents sections={article.sections} />
          </GlassCard>
        </aside>
      </div>

      {/* ─── Related articles ───────────────────────────────────────── */}
      {related.length > 0 && (
        <div style={{ marginTop: '60px' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              marginBottom: '20px',
            }}
          >
            {t('relatedArticles')}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}

      {/* Cross-links to other sections */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '24px 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: '16px',
      }}>
        <a href="/${ locale }/indicators" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#2979FF', textDecoration: 'none' }}>
          📊 Live Indicators
        </a>
        <a href="/${ locale }/dashboard" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#2979FF', textDecoration: 'none' }}>
          📈 Interactive Dashboard
        </a>
        <a href="/${ locale }/analysis" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#2979FF', textDecoration: 'none' }}>
          📰 All Analysis
        </a>
        <a href="/${ locale }/commodities" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#2979FF', textDecoration: 'none' }}>
          🛢️ Commodity Explorer
        </a>
      </div>
    </main>
  );
}
