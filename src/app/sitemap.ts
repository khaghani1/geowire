import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/data/articles';

const BASE_URL = 'https://www.geowire.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/en`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/en/dashboard`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/en/analysis`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/en/commodities`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/en/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/en/pricing`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/en/privacy`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/en/terms`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/en/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/en/indicators`, changeFrequency: 'hourly', priority: 0.8 },
  ];

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${BASE_URL}/en/analysis/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
