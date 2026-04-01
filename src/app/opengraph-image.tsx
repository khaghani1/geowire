import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GeoWire — Recession Intelligence Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
            opacity: 0.06,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(41,121,255,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#f0f0f5',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            display: 'flex',
          }}
        >
          GeoWire
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '40px',
            display: 'flex',
          }}
        >
          Recession Intelligence Platform
        </div>

        {/* Probability badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 32px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#FFD600',
              display: 'flex',
            }}
          >
            62%
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'flex',
              }}
            >
              Recession Probability
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.25)',
                display: 'flex',
              }}
            >
              12-month horizon · 6 models
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
