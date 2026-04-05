import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticleBySlug, getRelatedArticles, ARTICLES } from '@/lib/data/articles';
import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleDetailClient } from '@/components/analysis/ArticleDetailClient';
import { ArticleDisclaimer } from '@/components/articles/ArticleDisclaimer';

// ─── Static params for all articles ─────────────────────────────────────────

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// ─── Dynamic metadata ────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Not Found — GeoWire' };

  return {
    title: article.seoTitle || `${article.title} — GeoWire Analysis`,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ArticleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug, 2);

  // JSON-LD NewsArticle
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GeoWire',
      url: 'https://geowire.org',
    },
    mainEntityOfPage: `https://geowire.org/${locale}/analysis/${slug}`,
  };

  return (
    <>
      <AlertBannerLiveWrapper />
      <Navbar />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Data disclaimer — between header and article body */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '24px 24px 0' }}>
        <ArticleDisclaimer publishedAt={article.date} locale={locale} />
      </div>

      <ArticleDetailClient
        article={article}
        related={related}
        locale={locale}
      />

      <Footer />
    </>
  );
}
