'use client';

/**
 * GlobeHero — 3D rotating earth with animated oil trade route arcs.
 *
 * Uses globe.gl (Three.js-based) with dynamic import (ssr: false).
 * Wrapped in ChartErrorBoundary for WebGL fallback.
 * On mobile < 768px the globe is hidden entirely to avoid GPU issues.
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// ─── Data ────────────────────────────────────────────────────────────────────

interface ArcDatum {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  type: 'normal' | 'disrupted';
}

const NORMAL_ARCS: ArcDatum[] = [
  { startLat: 24.0, startLng: 45.0, endLat: 35.7, endLng: 139.7, color: '#00C853', type: 'normal' },  // Saudi → Japan
  { startLat: 24.0, startLng: 45.0, endLat: 37.6, endLng: 127.0, color: '#00C853', type: 'normal' },  // Saudi → South Korea
  { startLat: 33.0, startLng: 43.0, endLat: 20.6, endLng: 78.9, color: '#00C853', type: 'normal' },   // Iraq → India
  { startLat: 24.0, startLng: 54.5, endLat: 35.0, endLng: 105.0, color: '#00C853', type: 'normal' },  // UAE → China
  { startLat: 32.5, startLng: 54.0, endLat: 39.0, endLng: 35.0, color: '#FFD600', type: 'normal' },   // Iran → Turkey
];

const DISRUPTED_ARCS: ArcDatum[] = [
  // Cape of Good Hope reroute: Saudi → South Africa → Europe
  { startLat: 24.0, startLng: 45.0, endLat: -34.0, endLng: 18.5, color: '#FF1744', type: 'disrupted' },
  { startLat: -34.0, startLng: 18.5, endLat: 51.5, endLng: -0.1, color: '#FF1744', type: 'disrupted' },
  // Additional disrupted reroutes
  { startLat: 24.0, startLng: 45.0, endLat: -34.0, endLng: 18.5, color: '#FF1744', type: 'disrupted' },
  { startLat: -34.0, startLng: 18.5, endLat: 35.7, endLng: 139.7, color: '#FF1744', type: 'disrupted' },
];

interface LabelDatum {
  lat: number;
  lng: number;
  text: string;
}

const LABELS: LabelDatum[] = [
  { lat: 24.0, lng: 45.0, text: 'Saudi Arabia' },
  { lat: 32.5, lng: 54.0, text: 'Iran' },
  { lat: 33.0, lng: 43.0, text: 'Iraq' },
  { lat: 24.0, lng: 54.5, text: 'UAE' },
  { lat: 29.5, lng: 47.5, text: 'Kuwait' },
  { lat: 35.7, lng: 139.7, text: 'Japan' },
  { lat: 37.6, lng: 127.0, text: 'S. Korea' },
  { lat: 20.6, lng: 78.9, text: 'India' },
  { lat: 35.0, lng: 105.0, text: 'China' },
  { lat: 50.0, lng: 10.0, text: 'Europe' },
];

// ─── Inner Globe (client-only, no SSR) ───────────────────────────────────────

function GlobeInner() {
  const t = useTranslations('globe');
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ReturnType<typeof import('globe.gl')['default']> extends (...args: any) => infer R ? R : any>(null);
  const [disrupted, setDisrupted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);

  // Check screen size
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Initialize globe
  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    let destroyed = false;

    (async () => {
      try {
        const GlobeModule = await import('globe.gl');
        const Globe = GlobeModule.default;

        if (destroyed || !containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = Math.min(500, window.innerHeight * 0.5);

        const globe = Globe()
          .backgroundColor('rgba(0,0,0,0)')
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
          .showAtmosphere(true)
          .atmosphereColor('#2979FF')
          .atmosphereAltitude(0.15)
          .width(width)
          .height(height)
          // Labels
          .labelsData(LABELS)
          .labelLat('lat')
          .labelLng('lng')
          .labelText('text')
          .labelSize(0.8)
          .labelColor(() => '#e4e4e7')
          .labelDotRadius(0.3)
          .labelResolution(2)
          .labelAltitude(0.01)
          // Arcs — start with normal
          .arcsData(NORMAL_ARCS)
          .arcStartLat('startLat')
          .arcStartLng('startLng')
          .arcEndLat('endLat')
          .arcEndLng('endLng')
          .arcColor('color')
          .arcDashLength(0.4)
          .arcDashGap(0.2)
          .arcDashAnimateTime(1500)
          .arcStroke(0.5)
          .arcAltitudeAutoScale(0.3)
          (containerRef.current);

        // Auto-rotate
        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.enableZoom = false;

        // Point of view: centered on Middle East / Hormuz
        globe.pointOfView({ lat: 25, lng: 55, altitude: 2.2 }, 0);

        globeRef.current = globe;
        setGlobeReady(true);
      } catch {
        // WebGL not supported or other error — fail silently
        // The ChartErrorBoundary wrapper will handle display
      }
    })();

    return () => {
      destroyed = true;
      if (globeRef.current && typeof globeRef.current._destructor === 'function') {
        globeRef.current._destructor();
      }
      globeRef.current = null;
    };
  }, [isMobile]);

  // Update arcs when toggle changes
  useEffect(() => {
    if (!globeRef.current || !globeReady) return;

    if (disrupted) {
      // Fade normal arcs, show disrupted
      const fadedNormal = NORMAL_ARCS.map((a) => ({
        ...a,
        color: 'rgba(255,255,255,0.1)',
      }));
      globeRef.current.arcsData([...fadedNormal, ...DISRUPTED_ARCS]);
    } else {
      globeRef.current.arcsData(NORMAL_ARCS);
    }
  }, [disrupted, globeReady]);

  // Handle resize
  useEffect(() => {
    if (isMobile || !containerRef.current || !globeRef.current) return;

    const handleResize = () => {
      if (!containerRef.current || !globeRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = Math.min(500, window.innerHeight * 0.5);
      globeRef.current.width(w).height(h);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, globeReady]);

  // Mobile: show a static fallback
  if (isMobile) {
    return (
      <div style={{
        height: '250px',
        borderRadius: '12px',
        background: 'radial-gradient(ellipse at center, rgba(41,121,255,0.08) 0%, transparent 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(41,121,255,0.15), rgba(10,10,15,0.8))',
          border: '1px solid rgba(41,121,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
        }}>
          🌍
        </div>
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
        }}>
          <button
            onClick={() => setDisrupted((d) => !d)}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              background: disrupted ? 'rgba(255,23,68,0.12)' : 'rgba(0,200,83,0.1)',
              border: `1px solid ${disrupted ? 'rgba(255,23,68,0.35)' : 'rgba(0,200,83,0.3)'}`,
              color: disrupted ? '#FF1744' : '#00C853',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {disrupted ? t('toggleNormal') : t('toggleDisrupted')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Globe container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'grab',
        }}
      />

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
        pointerEvents: 'none',
        borderRadius: '0 0 12px 12px',
      }} />

      {/* Toggle button */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        zIndex: 10,
      }}>
        <button
          onClick={() => setDisrupted((d) => !d)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            background: disrupted ? 'rgba(255,23,68,0.15)' : 'rgba(0,200,83,0.12)',
            border: `1px solid ${disrupted ? 'rgba(255,23,68,0.4)' : 'rgba(0,200,83,0.35)'}`,
            color: disrupted ? '#FF1744' : '#00C853',
            fontSize: '11px',
            fontFamily: 'var(--font-data)',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}
        >
          {disrupted ? t('toggleNormal') : t('toggleDisrupted')}
        </button>
      </div>

      {/* Status badge */}
      {disrupted && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 10,
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'rgba(255,23,68,0.15)',
          border: '1px solid rgba(255,23,68,0.3)',
          fontSize: '10px',
          fontFamily: 'var(--font-data)',
          fontWeight: 700,
          color: '#FF1744',
          letterSpacing: '0.05em',
          backdropFilter: 'blur(8px)',
        }}>
          {t('disruptionActive')}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function GlobeSkeleton() {
  return (
    <div style={{
      width: '100%',
      height: '400px',
      borderRadius: '12px',
      background: 'radial-gradient(ellipse at center, rgba(41,121,255,0.05) 0%, transparent 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'pulse 2s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

// ─── Export (dynamic, ssr: false) ─────────────────────────────────────────────

export const GlobeHero = dynamic(
  () => Promise.resolve({ default: GlobeInner }),
  { ssr: false, loading: () => <GlobeSkeleton /> },
);
