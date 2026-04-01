'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ARTICLES } from '@/lib/data/articles';
import type { ArticleTopic } from '@/lib/data/articles';
import { TopicFilter, type FilterValue } from './TopicFilter';
import { ArticleCard } from './ArticleCard';

export function ArticleGrid() {
  const t = useTranslations('analysis');
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = filter === 'all'
    ? ARTICLES
    : ARTICLES.filter((a) => a.topics.includes(filter as ArticleTopic));

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <TopicFilter onFilterChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
          {t('noArticles')}
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
