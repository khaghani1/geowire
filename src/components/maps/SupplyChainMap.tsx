'use client';

/**
 * SupplyChainMap — Multi-Commodity Cascade Map
 *
 * Leaflet map showing 6 toggleable commodity layers:
 * Oil, Steel, Aluminum, LNG, Helium, Sulfur
 *
 * Features:
 *  - CARTO Dark Matter tiles
 *  - Custom layer control panel (top-right)
 *  - Normal / Disrupted toggle (bottom-left)
 *  - Legend (bottom-right)
 *  - Pulsing Hormuz chokepoint polygon
 *  - Mobile-responsive: control panel collapses to button
 *
 * Consumed via next/dynamic({ ssr: false }) wrapper.
 */

import 'leaflet/dist/leaflet.css';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  Popup,
  Polyline,
} from 'react-leaflet';

// ── Leaflet icon fix ─────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Types ────────────────────────────────────────────────────────────────────

type LatLng = [number, number];

interface RouteData {
  from: LatLng;
  waypoints?: LatLng[];
  to: LatLng;
  color: string;
  disrupted?: boolean;  // only shows in disrupted mode
  normalOnly?: boolean; // only shows in normal mode
}

interface MarkerData {
  pos: LatLng;
  fillColor: string;
  radius: number;
  popup: string;
}

type CommodityKey = 'oil' | 'steel' | 'aluminum' | 'lng' | 'helium' | 'sulfur';

interface LayerDef {
  key: CommodityKey;
  color: string;
  status: 'disrupted' | 'normal' | 'partial';
  routes: RouteData[];
  markers: MarkerData[];
}

// ── Hormuz chokepoint polygon ────────────────────────────────────────────────

const HORMUZ_POLYGON: LatLng[] = [
  [26.7, 56.0], [26.2, 56.8], [26.0, 56.6], [26.5, 55.8],
];

// ── Helper: build polyline positions from route data ─────────────────────────

function routePositions(r: RouteData): LatLng[] {
  return [r.from, ...(r.waypoints ?? []), r.to];
}

// ── Layer definitions ────────────────────────────────────────────────────────

const HORMUZ: LatLng = [26.5, 56.3];

const LAYERS: LayerDef[] = [
  // ── Layer 1: Crude Oil ─────────────────────────────────────────────────
  {
    key: 'oil',
    color: '#00C853',
    status: 'disrupted',
    routes: [
      // Normal routes through Hormuz
      { from: [24.7, 46.7], waypoints: [HORMUZ], to: [35.7, 139.7], color: '#00C853', normalOnly: true },
      { from: [24.7, 46.7], waypoints: [HORMUZ], to: [37.5, 127.0], color: '#00C853', normalOnly: true },
      { from: [33.3, 44.4], waypoints: [HORMUZ], to: [19.1, 72.9], color: '#00C853', normalOnly: true },
      { from: [24.5, 54.7], waypoints: [HORMUZ], to: [31.2, 121.5], color: '#00C853', normalOnly: true },
      { from: [32.4, 53.7], waypoints: [HORMUZ], to: [31.2, 121.5], color: '#FFD600', normalOnly: true },
      // Disrupted: Cape of Good Hope reroute → Europe
      { from: [24.7, 46.7], waypoints: [[15.5, 42.0], [12.6, 43.3], [2.0, 45.0], [-10.0, 42.0], [-25.0, 35.0], [-34.4, 18.5], [-15.0, 5.0], [6.0, 3.4]], to: [51.9, 4.5], color: '#FF1744', disrupted: true },
      // Disrupted: Cape reroute → India
      { from: [24.7, 46.7], waypoints: [[15.5, 42.0], [12.6, 43.3], [2.0, 45.0], [-10.0, 42.0], [-25.0, 35.0], [-34.4, 18.5], [-15.0, 60.0]], to: [19.1, 72.9], color: '#FF1744', disrupted: true },
    ],
    markers: [
      { pos: [24.7, 46.7], fillColor: '#00C853', radius: 6, popup: 'Saudi Arabia — 9.5M bbl/day' },
      { pos: [32.4, 53.7], fillColor: '#FF1744', radius: 6, popup: 'Iran — 3.2M bbl/day (offline)' },
      { pos: [33.3, 44.4], fillColor: '#FFD600', radius: 6, popup: 'Iraq — 4.4M bbl/day (port disrupted)' },
      { pos: [24.5, 54.7], fillColor: '#00C853', radius: 6, popup: 'UAE — 3.2M bbl/day' },
      { pos: [29.4, 47.9], fillColor: '#00C853', radius: 6, popup: 'Kuwait — 2.7M bbl/day' },
    ],
  },

  // ── Layer 2: Steel ─────────────────────────────────────────────────────
  {
    key: 'steel',
    color: '#FF1744',
    status: 'disrupted',
    routes: [
      { from: [32.7, 51.7], to: [41.0, 29.0], color: '#FF1744' },
      { from: [31.3, 48.7], to: [25.3, 55.3], color: '#FF1744' },
      { from: [32.7, 51.7], to: [31.2, 121.5], color: '#FF1744' },
      { from: [41.0, 29.0], to: [51.2, 6.8], color: '#FFD600' },
    ],
    markers: [
      { pos: [32.7, 51.7], fillColor: '#FF1744', radius: 8, popup: 'Mobarakeh Steel — 7.1M tonnes/yr — STRUCK Mar 27' },
      { pos: [31.3, 48.7], fillColor: '#FF1744', radius: 7, popup: 'Khouzestan Steel — 3.6M tonnes/yr — SHUTDOWN' },
    ],
  },

  // ── Layer 3: Aluminum ──────────────────────────────────────────────────
  {
    key: 'aluminum',
    color: '#FF1744',
    status: 'disrupted',
    routes: [
      { from: [24.5, 54.6], to: [51.9, 4.5], color: '#FF1744' },
      { from: [24.5, 54.6], to: [29.8, -95.4], color: '#FF1744' },
      { from: [26.1, 50.6], to: [31.2, 121.5], color: '#FF1744' },
    ],
    markers: [
      { pos: [24.5, 54.6], fillColor: '#FF1744', radius: 8, popup: 'EGA — 2.4M tonnes/yr (4% global) — STRUCK Mar 29' },
      { pos: [26.1, 50.6], fillColor: '#FF1744', radius: 7, popup: 'Alba — 1.62M tonnes/yr — FORCE MAJEURE' },
    ],
  },

  // ── Layer 4: LNG ───────────────────────────────────────────────────────
  {
    key: 'lng',
    color: '#FF1744',
    status: 'disrupted',
    routes: [
      { from: [25.9, 51.5], to: [35.7, 139.7], color: '#FF1744' },
      { from: [25.9, 51.5], to: [37.5, 127.0], color: '#FF1744' },
      { from: [25.9, 51.5], to: [51.5, -0.1], color: '#FFD600' },
    ],
    markers: [
      { pos: [25.9, 51.5], fillColor: '#FF1744', radius: 8, popup: 'Ras Laffan — 77M tonnes LNG/yr — DAMAGED, 3-5yr repair' },
    ],
  },

  // ── Layer 5: Helium ────────────────────────────────────────────────────
  {
    key: 'helium',
    color: '#2979FF',
    status: 'disrupted',
    routes: [
      { from: [25.9, 51.5], to: [29.8, -95.4], color: '#FF1744' },
      { from: [25.9, 51.5], to: [25.0, 121.5], color: '#FF1744' },
      { from: [25.9, 51.5], to: [37.3, 127.0], color: '#FF1744' },
    ],
    markers: [
      { pos: [25.9, 51.5], fillColor: '#2979FF', radius: 6, popup: 'Qatar — 30% of global semiconductor-grade helium — OFFLINE' },
      { pos: [25.0, 121.5], fillColor: '#2979FF', radius: 5, popup: 'TSMC — 1-2 months helium inventory remaining' },
    ],
  },

  // ── Layer 6: Sulfur ────────────────────────────────────────────────────
  {
    key: 'sulfur',
    color: '#FFD600',
    status: 'partial',
    routes: [
      { from: [29.4, 47.9], to: [0.8, 117.0], color: '#FF1744' },
      { from: [29.4, 47.9], to: [-4.3, 15.3], color: '#FFD600' },
    ],
    markers: [
      { pos: [29.4, 47.9], fillColor: '#FFD600', radius: 6, popup: 'Gulf sulfur — 24% of world production, 50% of seaborne trade' },
      { pos: [-0.5, 121.5], fillColor: '#FFD600', radius: 5, popup: 'Indonesian nickel HPAL plants — 1-2 months sulfur inventory' },
    ],
  },
];


// ── Control Panel ────────────────────────────────────────────────────────────

function LayerControlPanel({
  enabledLayers,
  onToggle,
  t,
  collapsed,
  onToggleCollapse,
}: {
  enabledLayers: Record<CommodityKey, boolean>;
  onToggle: (key: CommodityKey) => void;
  t: ReturnType<typeof useTranslations>;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const layerMeta: { key: CommodityKey; color: string; status: string; statusColor: string }[] = [
    { key: 'oil', color: '#00C853', status: t('disrupted'), statusColor: '#FF1744' },
    { key: 'steel', color: '#FF1744', status: t('disrupted'), statusColor: '#FF1744' },
    { key: 'aluminum', color: '#FF1744', status: t('disrupted'), statusColor: '#FF1744' },
    { key: 'lng', color: '#FF1744', status: t('disrupted'), statusColor: '#FF1744' },
    { key: 'helium', color: '#2979FF', status: t('disrupted'), statusColor: '#FF1744' },
    { key: 'sulfur', color: '#FFD600', status: t('partial'), statusColor: '#FFD600' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 1000,
    }}>
      {/* Mobile: collapsed button */}
      {collapsed ? (
        <button
          onClick={onToggleCollapse}
          style={{
            background: 'rgba(10, 10, 15, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '10px 16px',
            color: '#e4e4e7',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          {t('layersTitle')} ▼
        </button>
      ) : (
        <div style={{
          background: 'rgba(10, 10, 15, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: 12,
          minWidth: 190,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {t('layersTitle')}
            </span>
            <button
              onClick={onToggleCollapse}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '2px 4px',
              }}
            >
              ✕
            </button>
          </div>
          {layerMeta.map(({ key, color, status, statusColor }) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 0',
                cursor: 'pointer',
                minHeight: 32,
              }}
            >
              <input
                type="checkbox"
                checked={enabledLayers[key]}
                onChange={() => onToggle(key)}
                style={{ width: 16, height: 16, accentColor: color, cursor: 'pointer' }}
              />
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: color,
                boxShadow: `0 0 4px ${color}`,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '12px', color: '#e4e4e7', flex: 1 }}>
                {t(key)}
              </span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: statusColor, letterSpacing: '0.05em' }}>
                {status}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Legend (bottom-right) ────────────────────────────────────────────────────

function MapLegend({ t }: { t: ReturnType<typeof useTranslations> }) {
  const items = [
    { color: '#00C853', label: t('legendNormal'), type: 'line' as const },
    { color: '#FFD600', label: t('legendSanctions'), type: 'line' as const },
    { color: '#FF1744', label: t('legendDisrupted'), type: 'dash' as const },
    { color: '#FF1744', label: t('legendBlocked'), type: 'fill' as const },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 12,
      right: 12,
      zIndex: 1000,
      background: 'rgba(10, 10, 15, 0.92)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8,
      padding: '8px 12px',
    }}>
      {items.map(({ color, label, type }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
          {type === 'fill' ? (
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.6 }} />
          ) : (
            <div style={{
              width: 16, height: 0,
              borderTop: type === 'dash' ? `2px dashed ${color}` : `2px solid ${color}`,
              opacity: 0.8,
            }} />
          )}
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Disrupted toggle (bottom-left) ───────────────────────────────────────────

function DisruptedToggle({
  disrupted,
  onToggle,
  t,
}: {
  disrupted: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 12,
      left: 12,
      zIndex: 1000,
    }}>
      <button
        onClick={onToggle}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          background: disrupted ? 'rgba(255,23,68,0.15)' : 'rgba(0,200,83,0.12)',
          border: `1px solid ${disrupted ? 'rgba(255,23,68,0.5)' : 'rgba(0,200,83,0.4)'}`,
          color: disrupted ? '#FF1744' : '#00C853',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.04em',
          transition: 'all 0.2s',
        }}
      >
        {disrupted ? t('normalRoutes') : t('disruptedRoutes')}
      </button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function SupplyChainMap() {
  const t = useTranslations('supplyChainMap');
  const [disrupted, setDisrupted] = useState(false);
  const [enabledLayers, setEnabledLayers] = useState<Record<CommodityKey, boolean>>({
    oil: true,
    steel: false,
    aluminum: false,
    lng: false,
    helium: false,
    sulfur: false,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setPanelCollapsed(mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleLayer = (key: CommodityKey) => {
    setEnabledLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter visible routes and markers based on enabled layers + disrupted mode
  const visibleElements = useMemo(() => {
    const routes: (RouteData & { layerKey: CommodityKey })[] = [];
    const markers: (MarkerData & { layerKey: CommodityKey })[] = [];

    for (const layer of LAYERS) {
      if (!enabledLayers[layer.key]) continue;

      for (const route of layer.routes) {
        // In disrupted mode: show disrupted routes, hide normalOnly routes
        // In normal mode: show normalOnly routes (and routes without flag), hide disrupted
        if (disrupted && route.normalOnly) continue;
        if (!disrupted && route.disrupted) continue;
        routes.push({ ...route, layerKey: layer.key });
      }

      for (const marker of layer.markers) {
        markers.push({ ...marker, layerKey: layer.key });
      }
    }

    return { routes, markers };
  }, [enabledLayers, disrupted]);

  const mapHeight = isMobile ? 350 : 500;

  return (
    <div style={{
      position: 'relative',
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <MapContainer
        center={[28, 55]}
        zoom={3}
        style={{ height: mapHeight, width: '100%', background: '#0a0a0f' }}
        zoomControl
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        {/* Hormuz chokepoint polygon */}
        <Polygon
          positions={HORMUZ_POLYGON}
          pathOptions={{
            fillColor: '#FF1744',
            fillOpacity: 0.25,
            color: '#FF1744',
            weight: 2,
            dashArray: '5, 5',
            className: 'hormuz-pulse',
          }}
        >
          <Popup>
            <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
              <strong>Strait of Hormuz</strong><br />
              21M bbl/day normally — 86-95% traffic reduction
            </div>
          </Popup>
        </Polygon>

        {/* Route polylines */}
        {visibleElements.routes.map((route, i) => (
          <Polyline
            key={`${route.layerKey}-route-${i}`}
            positions={routePositions(route)}
            pathOptions={{
              color: route.color,
              weight: 2.5,
              opacity: 0.75,
              dashArray: route.disrupted ? '4, 8' : '10, 6',
            }}
          />
        ))}

        {/* Circle markers with glow */}
        {visibleElements.markers.map((marker, i) => (
          <CircleMarker
            key={`${marker.layerKey}-marker-${i}`}
            center={marker.pos}
            radius={marker.radius}
            pathOptions={{
              fillColor: marker.fillColor,
              fillOpacity: 0.85,
              color: marker.fillColor,
              weight: 1,
              className: 'glow-marker',
            }}
          >
            <Popup>
              <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                {marker.popup}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Overlay controls */}
      <LayerControlPanel
        enabledLayers={enabledLayers}
        onToggle={toggleLayer}
        t={t}
        collapsed={panelCollapsed}
        onToggleCollapse={() => setPanelCollapsed((c) => !c)}
      />
      <DisruptedToggle disrupted={disrupted} onToggle={() => setDisrupted((d) => !d)} t={t} />
      <MapLegend t={t} />

      {/* CSS animations */}
      <style>{`
        @keyframes hormuzPulse {
          0%, 100% { fill-opacity: 0.15; }
          50% { fill-opacity: 0.35; }
        }
        .hormuz-pulse {
          animation: hormuzPulse 2s ease-in-out infinite;
        }
        .glow-marker {
          filter: drop-shadow(0 0 4px currentColor);
        }
      `}</style>
    </div>
  );
}
