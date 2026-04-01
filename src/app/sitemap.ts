import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/data/articles';

const BASE_URL = 'https://geowire.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/en`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/en/dashboard`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/en/analysis`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/en/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/en/pricing`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${BASE_URL}/en/analysis/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
