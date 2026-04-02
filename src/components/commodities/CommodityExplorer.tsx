'use client';

import { useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

type CommodityStatus = 'DISRUPTED' | 'CRITICAL' | 'ELEVATED' | 'NORMAL';

interface Commodity {
  name: string;
  icon: string;
  status: CommodityStatus;
  keyStat: string;
  topProducers: string[];
  tradeRoute: string;
  cpiImpact: string;
  details: string;
}

const STATUS_COLORS: Record<CommodityStatus, string> = {
  DISRUPTED: '#FF1744',
  CRITICAL: '#FF1744',
  ELEVATED: '#FFD600',
  NORMAL: '#00C853',
};

const COMMODITIES: Commodity[] = [
  {
    name: 'Crude Oil',
    icon: '🛢️',
    status: 'DISRUPTED',
    keyStat: '$105/bbl Brent',
    topProducers: ['Saudi Arabia', 'Russia', 'USA'],
    tradeRoute: 'Strait of Hormuz (86-95% reduction)',
    cpiImpact: 'Energy (gasoline, heating), Transport, Food (via shipping costs)',
    details: 'The Strait of Hormuz normally transits 21 million barrels per day — approximately 20% of global crude supply. The current conflict has reduced transit to near-zero, with Lloyd\'s of London suspending war-risk insurance. Saudi and UAE volumes are rerouting via the Cape of Good Hope, adding 14 days and $800,000 per voyage. Brent crude has surged from $68 to $105/bbl. The oil-to-GDP elasticity of -0.15 (Hamilton 2003) implies a significant drag on global growth. Venezuela\'s Orinoco Belt crude is becoming viable as a partial substitute via OFAC General Licenses 49/50A.',
  },
  {
    name: 'Steel',
    icon: '🏗️',
    status: 'DISRUPTED',
    keyStat: '10.7M tonnes Iranian capacity offline',
    topProducers: ['China', 'India', 'Japan', 'Iran (10th globally)'],
    tradeRoute: 'Iran → Turkey, Iran → China (both disrupted)',
    cpiImpact: 'Construction materials, Autos, Appliances, Infrastructure',
    details: 'Israeli strikes on March 27 hit Mobarakeh Steel (7.1M tonnes annual capacity) in Isfahan and damaged power infrastructure supporting Khouzestan Steel (3.6M tonnes). Combined, 33-45% of Iranian steel production is offline with an 18-24 month estimated recovery time. Turkey, which imported 2.8M tonnes of Iranian semi-finished steel in 2025, is scrambling for alternatives. Turkish rebar futures are up 18%. Trump\'s 50% steel tariffs create a double moat for US producers like Nucor (+41%) and US Steel.',
  },
  {
    name: 'Aluminum',
    icon: '⚡',
    status: 'DISRUPTED',
    keyStat: '4M+ tonnes Gulf capacity at risk',
    topProducers: ['China', 'India', 'Russia', 'UAE', 'Bahrain'],
    tradeRoute: 'UAE/Bahrain → Europe, USA (disrupted)',
    cpiImpact: 'Packaging, Auto parts, Construction, Electronics',
    details: 'Iranian IRGC strikes on March 28-29 hit Emirates Global Aluminium (EGA) at Al Taweelah (2.4M tonnes, 4% of global primary aluminum) and Aluminium Bahrain (Alba, 1.62M tonnes, force majeure declared). Aluminum smelting requires continuous electrical current — even brief interruptions cause cells to freeze, requiring months to rebuild per potline. LME 3-month aluminum surged through $3,200/tonne from $2,480 pre-crisis. Century Aluminum stock up 167% on combined tariff protection + supply destruction.',
  },
  {
    name: 'LNG',
    icon: '🔥',
    status: 'DISRUPTED',
    keyStat: 'Ras Laffan 77M tonnes — damaged',
    topProducers: ['Qatar', 'Australia', 'USA'],
    tradeRoute: 'Qatar → Japan, South Korea, Europe (disrupted)',
    cpiImpact: 'Electricity, Industrial heating, Fertilizer production',
    details: 'Qatar\'s Ras Laffan Industrial City — the world\'s largest LNG hub — sustained Iranian missile damage. While hardened underground LNG trains survived, above-ground processing and export infrastructure requires extensive repair. Qatar supplies approximately 22% of global LNG. Japan and South Korea, which receive 30-35% of their LNG from Qatar, are competing for spot cargoes from Australia and the US Gulf Coast, driving Asian spot LNG above $18/mmBtu. European TTF futures have also surged, threatening industrial heating costs ahead of the next winter.',
  },
  {
    name: 'Helium',
    icon: '🎈',
    status: 'CRITICAL',
    keyStat: '30% of semiconductor-grade supply offline',
    topProducers: ['USA', 'Qatar', 'Algeria'],
    tradeRoute: 'Qatar → global chip fabs (disrupted)',
    cpiImpact: 'Semiconductors, Electronics, Medical equipment',
    details: 'Qatar\'s Ras Laffan produced ~30% of global semiconductor-grade helium. IRGC strikes damaged helium separation and purification units — 3-5 year repair estimated. Helium is irreplaceable in chip fabrication (EUV lithography cooling, CVD carrier gas). TSMC, Samsung, and Intel fabs maintain 1-2 month inventory buffers. Spot helium prices surged 40-100%. No meaningful substitute exists. The US Federal Helium Reserve (~80M cubic meters) provides limited backstop. First fab production cuts expected by mid-2026 if situation persists.',
  },
  {
    name: 'Sulfur',
    icon: '🧪',
    status: 'ELEVATED',
    keyStat: '50% of seaborne trade from Gulf',
    topProducers: ['Canada', 'Russia', 'Middle East'],
    tradeRoute: 'Kuwait → Indonesia, DRC (disrupted)',
    cpiImpact: 'Batteries (via nickel processing), Fertilizers, Chemicals',
    details: 'The Persian Gulf produces approximately 24% of the world\'s seaborne sulfur as a byproduct of oil refining and gas processing. Sulfur is critical for nickel HPAL (High Pressure Acid Leaching) plants in Indonesia, which supply 40%+ of global battery-grade nickel. These plants maintain only 1-2 months of sulfur inventory. A sustained disruption threatens the nickel-to-battery supply chain for EVs. Sulfur is also essential for fertilizer production (sulfuric acid → phosphate fertilizers), linking this disruption to agricultural input costs.',
  },
  {
    name: 'Fertilizers (Potash/Urea)',
    icon: '🌾',
    status: 'ELEVATED',
    keyStat: '20-30% of trade via Hormuz',
    topProducers: ['Russia', 'Canada', 'China', 'Belarus'],
    tradeRoute: 'Multiple routes disrupted by shipping costs',
    cpiImpact: 'Food prices (corn, wheat, soy), Agriculture input costs',
    details: 'While major fertilizer producers (Russia, Canada, Belarus) are not directly in the conflict zone, the disruption cascades through shipping costs and energy prices. Natural gas is the primary input for urea production — with gas prices elevated, urea costs have risen 25-30%. Potash shipments from the Middle East (primarily Jordan and Israel) face Hormuz transit risk. The combined effect is a 20-30% increase in fertilizer costs that will flow through to food prices with a 3-6 month lag, hitting developing economies hardest.',
  },
  {
    name: 'Wheat',
    icon: '🌿',
    status: 'ELEVATED',
    keyStat: 'Shipping costs +40% on rerouted grain',
    topProducers: ['Russia', 'EU', 'Canada', 'USA', 'Australia'],
    tradeRoute: 'Black Sea → MENA (indirect disruption via energy costs)',
    cpiImpact: 'Bread, Cereals, Food staples, Animal feed',
    details: 'Wheat production itself is not directly disrupted, but the conflict impacts wheat markets through three channels: elevated shipping costs (Cape of Good Hope rerouting adds $800K+ per voyage), higher energy inputs for farming and processing, and increased fertilizer costs flowing through to planting decisions. MENA countries — Egypt, Algeria, Morocco, Iraq — are the world\'s largest wheat importers and most exposed to these cost increases. CBOT wheat futures have risen 22% since the conflict began, with the shipping cost premium accounting for roughly half the increase.',
  },
];

export function CommodityExplorer() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return COMMODITIES;
    const q = search.toLowerCase();
    return COMMODITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.cpiImpact.toLowerCase().includes(q) ||
        c.topProducers.some((p) => p.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search commodities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {filtered.map((commodity) => {
          const statusColor = STATUS_COLORS[commodity.status];
          const isExpanded = expanded === commodity.name;

          return (
            <GlassCard key={commodity.name} style={{ padding: '20px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{commodity.icon}</span>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-heading)',
                      margin: 0,
                    }}
                  >
                    {commodity.name}
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: `${statusColor}18`,
                    color: statusColor,
                    border: `1px solid ${statusColor}40`,
                    fontFamily: 'var(--font-data)',
                  }}
                >
                  {commodity.status}
                </span>
              </div>

              {/* Key Stat */}
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: statusColor,
                  fontFamily: 'var(--font-data)',
                  marginBottom: '14px',
                }}
              >
                {commodity.keyStat}
              </div>

              {/* Info rows */}
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Top Producers: </span>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{commodity.topProducers.join(', ')}</span>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Trade Route: </span>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{commodity.tradeRoute}</span>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>CPI/PPI Impact: </span>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{commodity.cpiImpact}</span>
                </div>
              </div>

              {/* Expand toggle */}
              <button
                onClick={() => setExpanded(isExpanded ? null : commodity.name)}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#2979FF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 0',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {isExpanded ? 'Hide Details ▲' : 'View Details ▼'}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {commodity.details}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
          No commodities match your search.
        </p>
      )}
    </div>
  );
}