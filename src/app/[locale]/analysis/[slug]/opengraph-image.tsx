import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/data/articles';

export const alt = 'GeoWire Analysis';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#FF1744',
  high: '#FFD600',
  elevated: '#FF6D00',
  medium: '#2979FF',
  low: '#00C853',
};

interface OgProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleOgImage({ params }: OgProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? 'GeoWire Analysis';
  const severity = article?.severity ?? 'medium';
  const color = SEVERITY_COLORS[severity] ?? '#2979FF';
  const topics = article?.topics.join(' · ').toUpperCase() ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: '#0a0a0f',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Grid lines background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top bar: GeoWire + severity */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              display: 'flex',
            }}
          >
            GeoWire
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '6px',
                background: `${color}20`,
                color,
                border: `1px solid ${color}40`,
                display: 'flex',
              }}
            >
              {severity}
            </div>
          </div>
        </div>

        {/* Topics */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '16px',
            display: 'flex',
          }}
        >
          {topics}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#f0f0f5',
            lineHeight: 1.2,
            maxWidth: '900px',
            display: 'flex',
          }}
        >
          {title}
        </div>

        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '80px',
            bottom: '80px',
            width: '4px',
            background: color,
            borderRadius: '0 2px 2px 0',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
