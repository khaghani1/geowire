'use client';

/**
 * HormuzMap
 *
 * Leaflet map centered on the Strait of Hormuz.
 * Tiles: CARTO Dark Matter
 *
 * Features:
 *  - Pulsing red polygon over the Hormuz strait
 *  - Animated shipping routes using leaflet-ant-path:
 *      Normal    → flowing green dashes through Hormuz
 *      Disrupted → flowing red dashes via Cape of Good Hope
 *      When disrupted, green routes FREEZE and red routes FLOW
 *  - Producer markers with popups (output + share)
 *  - Normal ↔ Disrupted toggle
 *  - Show / Hide outer toggle (hidden by default to avoid layout cost)
 *
 * All Leaflet imports are STATIC (top-level) so the bundler sees them at
 * module parse time and the CSS is injected by Next.js's CSS pipeline.
 *
 * The whole file is wrapped with next/dynamic (ssr:false) so Leaflet never
 * executes on the server where `window` doesn't exist.
 */

// ⚠️  Must be a top-level import
import 'leaflet/dist/leaflet.css';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

// ─── Leaflet default-icon fix (webpack asset URL issue) ────────────────────────
(function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
})();

// ─── Seed data ─────────────────────────────────────────────────────────────────

const HORMUZ_CENTER: [number, number] = [26.5, 56.5];

const HORMUZ_POLYGON: [number, number][] = [
  [26.8, 55.8],
  [27.0, 56.2],
  [26.8, 56.8],
  [26.2, 57.0],
  [25.8, 56.6],
  [26.0, 55.9],
];

const PRODUCERS = [
  { name: 'Saudi Arabia', latlng: [24.0, 45.0] as [number, number], output: '9.7 mb/d', share: '~26%' },
  { name: 'Iraq',         latlng: [33.0, 43.0] as [number, number], output: '4.1 mb/d', share: '~11%' },
  { name: 'Iran',         latlng: [32.5, 54.0] as [number, number], output: '2.8 mb/d', share: '~8%'  },
  { name: 'UAE',          latlng: [24.0, 54.5] as [number, number], output: '3.5 mb/d', share: '~9%'  },
  { name: 'Kuwait',       latlng: [29.5, 47.5] as [number, number], output: '2.7 mb/d', share: '~7%'  },
];

const NORMAL_ROUTE: L.LatLngExpression[] = [
  [24.0, 45.0], [26.0, 56.5], [22.0, 65.0], [10.0, 75.0], [1.0, 104.0], [25.0, 122.0],
];

const DISRUPTED_ROUTE: L.LatLngExpression[] = [
  [24.0, 45.0], [13.0, 43.0], [-5.0, 40.0], [-34.0, 20.0],
  [-20.0, 45.0], [-5.0, 55.0], [5.0, 65.0], [1.0, 104.0], [25.0, 122.0],
];

// ─── AntPath wrapper (dynamic import to avoid SSR) ────────────────────────────

/**
 * This component adds leaflet-ant-path polylines directly to the map.
 * It dynamically imports the library (needs `window`) with a try/catch fallback.
 */
function AntPathLayer({ disrupted }: { disrupted: boolean }) {
  const map = useMap();
  const normalRef = useRef<L.Polyline | null>(null);
  const disruptedRef = useRef<L.Polyline | null>(null);
  const fallbackNormalRef = useRef<L.Polyline | null>(null);
  const fallbackDisruptedRef = useRef<L.Polyline | null>(null);
  const [useAntPath, setUseAntPath] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Dynamic import — leaflet-ant-path needs `window`
        const { AntPath } = await import('leaflet-ant-path');

        if (cancelled) return;

        // Clean up any existing layers
        if (normalRef.current) map.removeLayer(normalRef.current);
        if (disruptedRef.current) map.removeLayer(disruptedRef.current);
        if (fallbackNormalRef.current) { map.removeLayer(fallbackNormalRef.current); fallbackNormalRef.current = null; }
        if (fallbackDisruptedRef.current) { map.removeLayer(fallbackDisruptedRef.current); fallbackDisruptedRef.current = null; }

        // Create normal route (green flowing dashes)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalPath = new (AntPath as any)(NORMAL_ROUTE, {
          delay: 400,
          dashArray: [10, 20],
          weight: 2.5,
          color: '#00C853',
          pulseColor: '#00E676',
          paused: disrupted, // FREEZE when disrupted
          opacity: disrupted ? 0.25 : 0.8,
        });

        // Create disrupted route (red flowing dashes via Cape)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const disruptedPath = new (AntPath as any)(DISRUPTED_ROUTE, {
          delay: 600,
          dashArray: [10, 20],
          weight: 2.5,
          color: '#FF1744',
          pulseColor: '#FF5252',
          paused: !disrupted, // FLOW only when disrupted
          opacity: disrupted ? 0.8 : 0,
        });

        normalPath.addTo(map);
        disruptedPath.addTo(map);

        normalRef.current = normalPath;
        disruptedRef.current = disruptedPath;
      } catch {
        // Fallback to static polylines if ant-path fails
        if (cancelled) return;
        setUseAntPath(false);

        // Clean up ant paths if they exist
        if (normalRef.current) { map.removeLayer(normalRef.current); normalRef.current = null; }
        if (disruptedRef.current) { map.removeLayer(disruptedRef.current); disruptedRef.current = null; }

        // Static fallback
        if (fallbackNormalRef.current) map.removeLayer(fallbackNormalRef.current);
        if (fallbackDisruptedRef.current) map.removeLayer(fallbackDisruptedRef.current);

        if (!disrupted) {
          const line = L.polyline(NORMAL_ROUTE, { color: '#00C853', weight: 2, opacity: 0.75 }).addTo(map);
          fallbackNormalRef.current = line;
        } else {
          const line = L.polyline(DISRUPTED_ROUTE, { color: '#FF1744', weight: 2, opacity: 0.75, dashArray: '8 5' }).addTo(map);
          fallbackDisruptedRef.current = line;
        }
      }
    })();

    return () => {
      cancelled = true;
      if (normalRef.current) { map.removeLayer(normalRef.current); normalRef.current = null; }
      if (disruptedRef.current) { map.removeLayer(disruptedRef.current); disruptedRef.current = null; }
      if (fallbackNormalRef.current) { map.removeLayer(fallbackNormalRef.current); fallbackNormalRef.current = null; }
      if (fallbackDisruptedRef.current) { map.removeLayer(fallbackDisruptedRef.current); fallbackDisruptedRef.current = null; }
    };
  }, [map, disrupted, useAntPath]);

  return null;
}

// ─── Inner map (always client-side — this file is ssr:false) ──────────────────

function HormuzMapInner({ disrupted, height = 320 }: { disrupted: boolean; height?: number }) {
  const t = useTranslations('hormuzMap');

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <MapContainer
        center={HORMUZ_CENTER}
        zoom={4}
        style={{ height, width: '100%', background: '#12121a' }}
        zoomControl
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* Hormuz strait polygon — pulsing animation via CSS */}
        <Polygon
          positions={HORMUZ_POLYGON}
          pathOptions={{
            color: '#FF1744',
            fillColor: '#FF1744',
            fillOpacity: disrupted ? 0.35 : 0.18,
            weight: disrupted ? 2 : 1.5,
            dashArray: disrupted ? '6 4' : undefined,
            className: 'hormuz-polygon-pulse',
          }}
        />

        {/* Animated ant-path routes */}
        <AntPathLayer disrupted={disrupted} />

        {/* Producer markers */}
        {PRODUCERS.map((p) => (
          <Marker key={p.name} position={p.latlng}>
            <Popup>
              <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                <strong>{p.name}</strong><br />
                {t('popupOutput', { output: p.output })}<br />
                {t('popupShare', { share: p.share })}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Pulsing animation for the Hormuz polygon */}
      <style>{`
        @keyframes hormuzPulse {
          0%, 100% { fill-opacity: 0.18; }
          50% { fill-opacity: 0.38; }
        }
        .hormuz-polygon-pulse {
          animation: hormuzPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ─── Outer show/hide + route toggle ───────────────────────────────────────────

function HormuzMapWithToggle() {
  const t = useTranslations('hormuzMap');
  const [visible, setVisible] = useState(false);
  const [disrupted, setDisrupted] = useState(false);

  return (
    <div style={{ padding: '16px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: visible ? '12px' : 0 }}>
        <span className="gw-panel-label">{t('panelLabel')}</span>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {visible && (
            <button
              onClick={() => setDisrupted((d) => !d)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                background: disrupted ? 'rgba(255,23,68,0.12)' : 'rgba(0,200,83,0.1)',
                border: `1px solid ${disrupted ? 'rgba(255,23,68,0.35)' : 'rgba(0,200,83,0.3)'}`,
                color: disrupted ? '#FF1744' : '#00C853',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.03em',
              }}
            >
              {disrupted ? t('toggleNormal') : t('toggleDisrupted')}
            </button>
          )}

          <button
            onClick={() => setVisible((v) => !v)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              background: 'rgba(41,121,255,0.1)',
              border: '1px solid rgba(41,121,255,0.3)',
              color: '#2979FF',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            {visible ? t('toggleHide') : t('toggleShow')}
          </button>
        </div>
      </div>

      {visible && <HormuzMapInner disrupted={disrupted} />}

      {/* Legend — only when visible */}
      {visible && (
        <div style={{ display: 'flex', gap: '14px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <MapLegendItem color="#00C853" label={t('legendNormal')} animated />
          <MapLegendItem color="#FF1744" dashed label={t('legendDisrupted')} animated />
          <MapLegendItem color="#FF1744" filled label={t('legendBlocked')} />
        </div>
      )}
    </div>
  );
}

function MapLegendItem({ color, label, dashed, filled, animated }: { color: string; label: string; dashed?: boolean; filled?: boolean; animated?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      {filled
        ? <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.6 }} />
        : (
          <div style={{
            width: 18,
            height: 2,
            background: dashed ? 'transparent' : color,
            borderTop: dashed ? `2px dashed ${color}` : 'none',
            opacity: 0.8,
            position: 'relative',
          }}>
            {animated && (
              <span style={{
                position: 'absolute',
                right: -4,
                top: -3,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 4px ${color}`,
              }} />
            )}
          </div>
        )
      }
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
    </div>
  );
}

// ─── Homepage variant — always visible, no show/hide toggle ───────────────────

function HormuzMapHomepageInner() {
  const t = useTranslations('hormuzMap');
  const [disrupted, setDisrupted] = useState(false);

  return (
    <div>
      {/* Route toggle + legend row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <button
          onClick={() => setDisrupted((d) => !d)}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: disrupted ? 'rgba(255,23,68,0.12)' : 'rgba(0,200,83,0.1)',
            border: `1px solid ${disrupted ? 'rgba(255,23,68,0.35)' : 'rgba(0,200,83,0.3)'}`,
            color: disrupted ? '#FF1744' : '#00C853',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.03em',
          }}
        >
          {disrupted ? t('toggleNormal') : t('toggleDisrupted')}
        </button>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <MapLegendItem color="#00C853" label={t('legendNormal')} animated />
          <MapLegendItem color="#FF1744" dashed label={t('legendDisrupted')} animated />
          <MapLegendItem color="#FF1744" filled label={t('legendBlocked')} />
        </div>
      </div>

      <HormuzMapInner disrupted={disrupted} height={450} />

      {/* Responsive height override */}
      <style>{`
        @media (max-width: 768px) {
          .hormuz-homepage-section .leaflet-container {
            height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function MapSkeleton() {
  return (
    <div style={{ height: 56, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 160, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ width: 80, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

function HomepageMapSkeleton() {
  return (
    <div style={{ height: 450, borderRadius: 8, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>Loading map…</span>
    </div>
  );
}

// ─── Exports — dynamic(ssr:false) ─────────────────────────────────────────────
export const HormuzMap = dynamic(
  () => Promise.resolve({ default: HormuzMapWithToggle }),
  { ssr: false, loading: () => <MapSkeleton /> },
);

export const HormuzMapHomepage = dynamic(
  () => Promise.resolve({ default: HormuzMapHomepageInner }),
  { ssr: false, loading: () => <HomepageMapSkeleton /> },
);
