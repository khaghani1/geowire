'use client';

/**
 * HormuzMap
 *
 * Leaflet map centered on the Strait of Hormuz.
 * Tiles: CARTO Dark Matter
 *
 * Features:
 *  - Red polygon over the Hormuz strait
 *  - Shipping route polylines:
 *      Normal    → direct through Hormuz (green solid)
 *      Disrupted → diversion via Cape of Good Hope (red dashed)
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

// ⚠️  Must be a top-level import — require('leaflet/dist/leaflet.css')
//     inside a function body is silently ignored by most bundlers.
import 'leaflet/dist/leaflet.css';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
} from 'react-leaflet';

// ─── Leaflet default-icon fix (webpack asset URL issue) ────────────────────────
// Must run once after Leaflet is imported.
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

const NORMAL_ROUTE: [number, number][] = [
  [24.0, 45.0], [26.0, 56.5], [22.0, 65.0], [10.0, 75.0], [1.0, 104.0], [25.0, 122.0],
];

const DISRUPTED_ROUTE: [number, number][] = [
  [24.0, 45.0], [13.0, 43.0], [-5.0, 40.0], [-34.0, 20.0],
  [-20.0, 45.0], [-5.0, 55.0], [5.0, 65.0], [1.0, 104.0], [25.0, 122.0],
];

// ─── Inner map (always client-side — this file is ssr:false) ──────────────────

function HormuzMapInner({ disrupted }: { disrupted: boolean }) {
  const t = useTranslations('hormuzMap');

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <MapContainer
        center={HORMUZ_CENTER}
        zoom={4}
        style={{ height: 320, width: '100%', background: '#12121a' }}
        zoomControl
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* Hormuz strait polygon */}
        <Polygon
          positions={HORMUZ_POLYGON}
          pathOptions={{
            color: '#FF1744',
            fillColor: '#FF1744',
            fillOpacity: disrupted ? 0.35 : 0.18,
            weight: disrupted ? 2 : 1.5,
            dashArray: disrupted ? '6 4' : undefined,
          }}
        />

        {/* Shipping route */}
        {!disrupted ? (
          <Polyline positions={NORMAL_ROUTE} pathOptions={{ color: '#00C853', weight: 2, opacity: 0.75 }} />
        ) : (
          <Polyline positions={DISRUPTED_ROUTE} pathOptions={{ color: '#FF1744', weight: 2, opacity: 0.75, dashArray: '8 5' }} />
        )}

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
          <MapLegendItem color="#00C853" label={t('legendNormal')} />
          <MapLegendItem color="#FF1744" dashed label={t('legendDisrupted')} />
          <MapLegendItem color="#FF1744" filled label={t('legendBlocked')} />
        </div>
      )}
    </div>
  );
}

function MapLegendItem({ color, label, dashed, filled }: { color: string; label: string; dashed?: boolean; filled?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      {filled
        ? <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.6 }} />
        : <div style={{ width: 18, height: 2, background: dashed ? 'transparent' : color, borderTop: dashed ? `2px dashed ${color}` : 'none', opacity: 0.8 }} />
      }
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
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

// ─── Export — dynamic(ssr:false) ───────────────────────────────────────────────
export const HormuzMap = dynamic(
  () => Promise.resolve({ default: HormuzMapWithToggle }),
  { ssr: false, loading: () => <MapSkeleton /> },
);
