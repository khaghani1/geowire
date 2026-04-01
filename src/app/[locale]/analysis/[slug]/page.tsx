import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticleBySlug, getRelatedArticles, ARTICLES } from '@/lib/data/articles';
import { AlertBanner } from '@/components/layout/AlertBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleDetailClient } from '@/components/analysis/ArticleDetailClient';

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
    title: `${article.title} — GeoWire Analysis`,
    description: article.excerpt,
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
    description: article.excerpt,
    datePublished: article.date,
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
      <AlertBanner />
      <Navbar />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArticleDetailClient
        article={article}
        related={related}
        locale={locale}
      />

      <Footer />
    </>
  );
}
