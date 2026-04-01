'use client';

/**
 * HormuzMap
 *
 * Leaflet map centered on the Strait of Hormuz.
 * Tiles: CARTO Dark Matter (no labels variant)
 *
 * Features:
 *  - Red polygon over Hormuz strait
 *  - Shipping route polylines:
 *    Normal   → direct line through Hormuz (green)
 *    Disrupted → diversion via Cape of Good Hope (red dashed)
 *  - Producer markers with popups (output + Gulf share %)
 *  - Normal ↔ Disrupted toggle
 *  - "Show Map / Hide Map" outer toggle (map is hidden by default)
 *
 * Wrapped with next/dynamic (ssr: false) because Leaflet needs the DOM.
 */

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// ─── Seed data ─────────────────────────────────────────────────────────────────

const HORMUZ_CENTER: [number, number] = [26.5, 56.5];

// Approximate Hormuz strait polygon
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

// Normal route: Middle East → Asia (through Hormuz)
const NORMAL_ROUTE: [number, number][] = [
  [24.0, 45.0],  // Saudi
  [26.0, 56.5],  // Hormuz
  [22.0, 65.0],  // Arabian Sea
  [10.0, 75.0],  // India
  [1.0,  104.0], // Singapore
  [25.0, 122.0], // East Asia
];

// Disrupted route: diversion via Cape of Good Hope
const DISRUPTED_ROUTE: [number, number][] = [
  [24.0, 45.0],  // Saudi
  [13.0, 43.0],  // Red Sea
  [-5.0, 40.0],  // East Africa
  [-34.0, 20.0], // Cape of Good Hope
  [-20.0, 45.0], // Madagascar
  [-5.0,  55.0], // Reunion
  [5.0,   65.0], // Indian Ocean
  [1.0,   104.0],// Singapore
  [25.0,  122.0],// East Asia
];

// ─── Inner map component (browser-only) ───────────────────────────────────────

function HormuzMapInner() {
  const t = useTranslations('hormuzMap');
  const [disrupted, setDisrupted] = useState(false);

  // Leaflet and react-leaflet are browser-only — require() inside to avoid SSR issues
  // (this component is always rendered client-side via dynamic ssr:false)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup } = require('react-leaflet');
  // Leaflet CSS must be imported — handled via global import below in the wrapper
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('leaflet/dist/leaflet.css');

  // Fix default marker icon path issue with webpack
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span className="gw-panel-label">{t('panelLabel')}</span>

        {/* Route toggle */}
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
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.03em',
          }}
        >
          {disrupted ? t('toggleNormal') : t('toggleDisrupted')}
        </button>
      </div>

      {/* Map */}
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        <MapContainer
          center={HORMUZ_CENTER}
          zoom={4}
          style={{ height: 320, width: '100%', background: '#12121a' }}
          zoomControl={true}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          {/* CARTO Dark Matter tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

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
            <Polyline
              positions={NORMAL_ROUTE}
              pathOptions={{
                color: '#00C853',
                weight: 2,
                opacity: 0.75,
              }}
            />
          ) : (
            <Polyline
              positions={DISRUPTED_ROUTE}
              pathOptions={{
                color: '#FF1744',
                weight: 2,
                opacity: 0.75,
                dashArray: '8 5',
              }}
            />
          )}

          {/* Producer markers */}
          {PRODUCERS.map((p) => (
            <Marker key={p.name} position={p.latlng}>
              <Popup>
                <div style={{ fontFamily: 'sans-serif', fontSize: '12px', lineHeight: 1.5 }}>
                  <strong>{p.name}</strong><br />
                  {t('popupOutput', { output: p.output })}<br />
                  {t('popupShare', { share: p.share })}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '14px',
        marginTop: '10px',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}>
        <MapLegendItem color="#00C853" label={t('legendNormal')} />
        <MapLegendItem color="#FF1744" dashed label={t('legendDisrupted')} />
        <MapLegendItem color="#FF1744" filled label={t('legendBlocked')} />
      </div>
    </div>
  );
}

function MapLegendItem({ color, label, dashed, filled }: { color: string; label: string; dashed?: boolean; filled?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      {filled ? (
        <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.6 }} />
      ) : (
        <div style={{
          width: 18,
          height: 2,
          background: dashed ? 'transparent' : color,
          borderTop: dashed ? `2px dashed ${color}` : 'none',
          opacity: 0.8,
        }} />
      )}
      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Outer toggle wrapper (show/hide) ─────────────────────────────────────────

function HormuzMapWithToggle() {
  const t = useTranslations('hormuzMap');
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ padding: visible ? '0' : '16px' }}>
      {!visible ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="gw-panel-label">{t('panelLabel')}</span>
          <button
            onClick={() => setVisible(true)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              background: 'rgba(41,121,255,0.1)',
              border: '1px solid rgba(41,121,255,0.3)',
              color: 'var(--accent)',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            {t('toggleShow')}
          </button>
        </div>
      ) : (
        <div>
          <HormuzMapInner />
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '16px', paddingBottom: '4px' }}>
            <button
              onClick={() => setVisible(false)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '10px',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
              }}
            >
              {t('toggleHide')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function MapSkeleton() {
  return (
    <div style={{ height: 64, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 160, height: 12, borderRadius: 4, background: 'var(--bg-tertiary)', opacity: 0.5 }} />
      <div style={{ width: 80, height: 24, borderRadius: 6, background: 'var(--bg-tertiary)', opacity: 0.3 }} />
    </div>
  );
}

// ─── Export wrapped in dynamic (ssr: false) ────────────────────────────────────
export const HormuzMap = dynamic(
  () => Promise.resolve(HormuzMapWithToggle),
  { ssr: false, loading: () => <MapSkeleton /> }
);
