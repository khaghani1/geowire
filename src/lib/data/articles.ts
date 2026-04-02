/**
 * GeoWire Analysis Articles — seed data
 *
 * Each article is a structured object with metadata and content sections.
 * Content sections drive both the rendered article and the auto-generated TOC.
 */

export type ArticleTopic = 'recession-risk' | 'energy' | 'supply-chain' | 'technology';
export type ArticleSeverity = 'low' | 'medium' | 'elevated' | 'high' | 'critical';

export interface ArticleSection {
  id: string;
  heading: string;
  body: string; // plain text paragraphs separated by \n\n
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  author: string;
  date: string; // ISO date
  updatedAt: string; // ISO date
  readingTime: number; // minutes
  topics: ArticleTopic[];
  severity: ArticleSeverity;
  seoTitle: string;
  seoDescription: string;
  heroImage?: string;
  sections: ArticleSection[];
}

// ─── Article 1: Fortress Americas Industrial Cascade ────────────────────────

const fortressAmericas: Article = {
  slug: 'fortress-americas-industrial-cascade',
  title: 'The Industrial Cascade: How War, Tariffs, and Oil Are Rewriting the Global Map',
  subtitle: 'Israeli strikes, Iranian retaliation, and Trump tariffs are creating a hemispheric industrial moat',
  excerpt:
    'Israeli strikes on Iranian steel, Trump\'s 50% tariffs, and $105 oil are creating a cascade that enriches US industrial producers while devastating global supply chains.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-03-30',
  updatedAt: '2026-03-31',
  readingTime: 7,
  topics: ['recession-risk', 'supply-chain', 'energy'],
  severity: 'critical',
  seoTitle: 'The Industrial Cascade: War, Tariffs, and Oil Rewriting the Global Map — GeoWire',
  seoDescription: 'Israeli strikes on Iranian steel, Trump\'s 50% tariffs, and $105 oil are creating a cascade that enriches US industrial producers while devastating global supply chains.',
  sections: [
    {
      id: 'steel-strikes',
      heading: 'The Strikes That Broke Iran\'s Steel Spine',
      body: `On March 27, 2026, Israeli Air Force strikes hit the Mobarakeh Steel Complex in Isfahan — Iran's largest steel facility with 7.1 million tonnes of annual capacity, roughly 25% of total Iranian output. Within 48 hours, Khouzestan Steel Company (3.6 million tonnes annual capacity) announced an indefinite shutdown, citing damage to connected power infrastructure and employee evacuation orders. Combined, these two facilities represent approximately 33-45% of Iran's entire steel production capability.

The strikes were precision operations targeting blast furnaces and continuous casting lines — the components with the longest replacement timelines. Industry analysts at Mining Technology estimate 18-24 months minimum to restore Mobarakeh to operational capacity, assuming uninterrupted reconstruction and sanctions relief on critical equipment. Neither assumption is plausible in the current environment.

Iran's steel sector had been the country's second-largest non-oil export earner, generating roughly $4 billion annually in shipments to Turkey, China, the UAE, and Iraq. That revenue stream has been severed. Turkey, which imported approximately 2.8 million tonnes of Iranian semi-finished steel in 2025, is already scrambling for alternative suppliers — driving Turkish rebar futures up 18% in the week following the strikes.`,
    },
    {
      id: 'iranian-retaliation',
      heading: 'Iran\'s IRGC Strikes Back: The Gulf Aluminum Crisis',
      body: `Iran's Islamic Revolutionary Guard Corps responded with calculated precision, targeting the Gulf's aluminum sector rather than its oil infrastructure. On March 28, drone and ballistic missile strikes hit Emirates Global Aluminium (EGA) at Al Taweelah in Abu Dhabi — the world's largest single-site aluminum smelter with 2.4 million tonnes of annual capacity, roughly 4% of global primary aluminum production.

The following day, Aluminium Bahrain (Alba) — with 1.62 million tonnes of capacity, making it the fifth-largest smelter globally — declared force majeure after sustaining damage to its potline power systems. Aluminum smelting requires continuous electrical current; even a brief interruption causes the electrolytic cells to "freeze," requiring months of rebuild work per potline.

The combined 4+ million tonnes of Gulf aluminum capacity now at risk represents a significant fraction of global supply. The LME three-month aluminum price surged through $3,200/tonne on the news, up from $2,480 pre-crisis. European auto manufacturers, who source 15-20% of their aluminum sheet from Gulf smelters, have activated force majeure provisions in supply contracts — a move that ripples through body-in-white production lines at BMW, Mercedes, and Volkswagen.`,
    },
    {
      id: 'tariff-moat',
      heading: 'The Double Moat: Tariffs Meet Supply Destruction',
      body: `President Trump's steel and aluminum tariffs, escalated to 50% in February 2026, had already created a significant price umbrella for domestic producers. The Iran-Israel conflict has now added supply destruction on top of trade protection — creating what commodity strategists at Wood Mackenzie are calling a "double moat" for US industrial metals companies.

The market response has been dramatic. Century Aluminum, the sole remaining US primary aluminum smelter operator, has seen its stock rise 167% since the tariff escalation. Nucor, the largest US steel producer, is up 41%. Alcoa has surged 124% on the combination of tariff protection and global supply disruption.

This is not simply stock market speculation. US industrial utilization rates, which had been running at 74% for steel and 52% for aluminum before the tariff escalation, are now approaching 90% and 78% respectively. Domestic producers are running hot, hiring, and restarting mothballed capacity. Century Aluminum announced in mid-March that it would restart its Hawesville, Kentucky smelter — idle since 2022 — citing "unprecedented market conditions."

The irony is that this industrial renaissance is built on the destruction of foreign competitors. The "Fortress Americas" thesis, popularized by Columbia University's Center on Global Energy Policy, posits that hemispheric supply chains are decoupling from Eurasian ones faster than any planned reshoring initiative could have achieved. War and tariffs are accomplishing in months what industrial policy could not in decades.`,
    },
    {
      id: 'venezuela-oil',
      heading: 'Venezuela\'s Orinoco Belt: The $105 Lifeline',
      body: `With Brent crude above $105/barrel, Venezuela's extra-heavy Orinoco Belt crude — technically and economically marginal below $80 — has become viable. OFAC General Licenses 49 and 50A, issued in January 2026 under the Maduro-opposition rapprochement deal, opened the sector to BP, Chevron, Eni, Repsol, and Shell. Cleary Gottlieb's sanctions practice notes these licenses are "the broadest since the 2019 sanctions tightening," permitting new drilling, upgrader refurbishment, and crude export via designated intermediaries.

Venezuela's production has already crept from 780,000 bbl/day to approximately 920,000 bbl/day since the licenses took effect, with Chevron's Petroboscán and Petropiar joint ventures contributing the largest incremental volumes. The Maduro government has signaled it will fast-track environmental permits for Orinoco upgrader expansion, targeting 1.3 million bbl/day by Q4 2026.

This matters because Venezuelan heavy crude is a natural substitute for Iranian crude in Asian refineries configured for sour, heavy feedstock. Supply Chain Dive reports that CNPC has already redirected three VLCC charters from the Persian Gulf to José terminal in Venezuela — a logistical shift that was unthinkable six months ago.`,
    },
    {
      id: 'china-vulnerability',
      heading: 'China\'s Triple Exposure',
      body: `China is the most exposed major economy. Approximately 54-55% of Chinese crude imports originate from the Middle East, with 45-50% of total crude imports transiting the Strait of Hormuz. The conflict has simultaneously disrupted three of China's supply chain dependencies: oil (Hormuz transit risk), steel (loss of Iranian semi-finished imports for re-rolling), and petrochemicals (Iranian methanol and polyethylene exports halted).

China's strategic petroleum reserve, estimated at 950 million barrels by the IEA, provides approximately 90 days of import coverage. But this calculation assumes normal drawdown rates — in practice, releasing SPR barrels while Hormuz remains contested would deplete the reserve faster than replacement volumes from alternative sources (Russia, West Africa, Latin America) can compensate.

The People's Bank of China has already intervened twice in March to support the yuan against dollar strength driven by oil-priced capital flows. The combination of higher energy import costs, supply chain disruption, and currency pressure creates a stagflationary dynamic that Chinese policymakers have limited tools to address.`,
    },
    {
      id: 'hidden-chains',
      heading: 'The Sulfur-to-Semiconductor Chain Nobody Is Covering',
      body: `Beyond the headline commodities, the conflict has disrupted two critical supply chains that mainstream coverage has largely ignored.

The first is sulfur. The Persian Gulf produces approximately 24% of the world's seaborne sulfur, primarily as a byproduct of oil refining and natural gas processing in Kuwait, Saudi Arabia, and the UAE. Sulfur is essential for nickel High Pressure Acid Leaching (HPAL) — the process that produces battery-grade nickel for EV batteries. Indonesia's HPAL plants, which now supply over 40% of global Class 1 nickel, maintain only 1-2 months of sulfur inventory. A sustained Gulf sulfur disruption threatens the entire nickel-to-battery supply chain — a fact that battery analysts at Benchmark Minerals have flagged but that has received almost no mainstream attention.

The second is helium. Iranian strikes damaged Qatar's Ras Laffan industrial complex, which produces approximately 30% of the world's semiconductor-grade helium as a byproduct of LNG processing. Repair timelines are estimated at 3-5 years. Helium is irreplaceable in chip fabrication — it's used for wafer cooling in EUV lithography and as a carrier gas in chemical vapor deposition. TSMC, Samsung, and Intel maintain 1-2 months of helium inventory. Spot helium prices have surged 40-100% since the conflict began, with no meaningful substitute available. This is the supply chain crisis that connects Persian Gulf bombs to your next smartphone's delivery date.`,
    },
  ],
};

// ─── Article 2: Helium Semiconductor Shortage ────────────────────────────────

const heliumSemiconductor: Article = {
  slug: 'helium-semiconductor-shortage',
  title: 'The Helium Crisis Nobody\'s Talking About',
  subtitle: 'How Iranian strikes on Qatar knocked offline 30% of semiconductor-grade helium',
  excerpt:
    'Iranian strikes on Qatar\'s Ras Laffan knocked offline 30% of global semiconductor-grade helium. Chip fabs have 1-2 months of inventory.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-03-29',
  updatedAt: '2026-03-31',
  readingTime: 6,
  topics: ['supply-chain', 'technology'],
  severity: 'high',
  seoTitle: 'The Helium Crisis Nobody\'s Talking About — GeoWire',
  seoDescription: 'Iranian strikes on Qatar\'s Ras Laffan knocked offline 30% of global semiconductor-grade helium. Chip fabs have 1-2 months of inventory.',
  sections: [
    {
      id: 'ras-laffan-damage',
      heading: 'What Happened at Ras Laffan',
      body: `On March 28, 2026, Iranian IRGC missiles struck Qatar's Ras Laffan Industrial City as part of a broader retaliatory campaign following Israeli strikes on Iranian industrial targets. Ras Laffan is the world's largest LNG production hub — but it is also, less visibly, one of the world's most critical helium production facilities.

Qatar produces approximately 30% of the world's semiconductor-grade helium, extracted as a byproduct of its massive LNG operations. The helium separation and purification units at Ras Laffan, operated by RasGas and Qatargas, require specialized cryogenic equipment that cannot be quickly replaced. Initial damage assessments from QatarEnergy suggest a 3-5 year repair timeline for full helium production restoration — an estimate that assumes no further military escalation and uninterrupted access to specialized equipment from Air Liquide and Linde, the primary technology suppliers.

The strike did not destroy the LNG trains themselves — those are underground and hardened — but the above-ground helium separation units, storage dewars, and pipeline infrastructure sustained significant damage. Qatar has prioritized LNG restoration over helium recovery, meaning the helium timeline may slip further.`,
    },
    {
      id: 'why-chips-need-helium',
      heading: 'Why Chips Cannot Be Made Without Helium',
      body: `Helium's unique physical properties make it literally irreplaceable in modern semiconductor fabrication. With a boiling point of -269°C (4.2 Kelvin) — just four degrees above absolute zero — liquid helium is the only practical coolant for the superconducting magnets in extreme ultraviolet (EUV) lithography machines. ASML's latest High-NA EUV systems, which are required for every chip at 3nm and below, consume approximately 100,000 liters of liquid helium per year per machine.

Beyond lithography cooling, helium serves as an inert carrier gas in chemical vapor deposition (CVD) and physical vapor deposition (PVD) processes. Its small atomic radius (the smallest of any noble gas) allows it to purge reaction chambers more effectively than any alternative, while its chemical inertness prevents contamination of the exotic materials being deposited on silicon wafers. Attempts to substitute hydrogen (the only element with a smaller atom) introduce explosion risks in fab cleanroom environments where even trace sparks are unacceptable.

Helium also plays a critical role in fiber optics manufacturing, where it is used as a cooling gas in the fiber drawing process. The same fiber optics that carry the internet depend on a steady helium supply for their production.`,
    },
    {
      id: 'inventory-countdown',
      heading: 'The Inventory Countdown',
      body: `The semiconductor industry is now in a race against its own inventory buffers. TSMC maintains approximately 45-60 days of helium reserves at its Hsinchu, Tainan, and Kaohsiung fabs in Taiwan. Samsung's Pyeongtaek complex in South Korea has roughly 30-45 days. Intel's fabs in Oregon, Arizona, and Ireland operate on 40-55 day reserves, with some variation by process node.

These buffers were designed to handle temporary logistics disruptions — a delayed tanker, a plant outage, a scheduling mismatch. They were never designed to absorb the loss of 30% of global supply for years. At current consumption rates, the first fabs to face rationing decisions will be those running the most advanced nodes (3nm and below), where helium consumption per wafer is highest due to the intensity of EUV exposure steps.

Spot helium prices have already surged 40-100% since the conflict began, depending on grade and delivery location. Semiconductor-grade helium (99.9999% purity, or "six nines") has seen the sharpest increases because it requires additional purification steps that are capacity-constrained even under normal conditions. Praxair and Air Products, the two largest US helium distributors, have both implemented allocation programs — effectively rationing supply to existing contract customers.`,
    },
    {
      id: 'no-substitutes',
      heading: 'Why There Is No Substitute',
      body: `Unlike most industrial gases, helium has no drop-in replacement for its critical semiconductor applications. Nitrogen can substitute in some low-criticality purging operations, but it lacks helium's thermal conductivity and atomic size advantages in CVD/PVD processes. Hydrogen has a smaller atom but is flammable. Neon, which is used in DUV lithography, cannot substitute for helium in EUV systems because it has a much higher boiling point and different thermal properties.

The fundamental problem is physics: helium is the only element that remains liquid below 5 Kelvin without solidifying under pressure. The superconducting magnets in EUV lithography systems require this property. There is no engineering workaround — you cannot build an EUV machine that doesn't use liquid helium with current technology.

Alternative helium sources exist but cannot scale quickly. The US Federal Helium Reserve near Amarillo, Texas holds approximately 80 million cubic meters — enough for roughly 18 months of US demand. Algeria's Skikda plant and Russia's Gazprom operations can increase output by an estimated 10-15%, but this takes 6-12 months of ramp time. Australia's Darwin facility, not yet at full production, might contribute an additional 5-8% of global supply by late 2027.

The arithmetic is unforgiving: 30% of supply is offline for years, alternative sources can add perhaps 15-20% within 12 months, and demand continues to grow at 5-7% annually as new fabs come online. The gap will persist until Ras Laffan is rebuilt.`,
    },
    {
      id: 'downstream-impact',
      heading: 'From Fabs to Phones: The Downstream Impact',
      body: `If the helium shortage forces EUV utilization cuts at leading-edge fabs, the downstream effects cascade through the entire electronics supply chain with a 60-90 day lag. The sequence is predictable: first, wafer starts decline at TSMC and Samsung foundry. Then, fabless chip designers (Apple, Qualcomm, Nvidia, AMD) receive reduced allocation. Finally, end products — smartphones, laptops, GPUs, automotive ECUs — face supply constraints.

The automotive sector, still scarred by the 2021-2022 chip shortage, has already begun defensive inventory building. Toyota and Volkswagen have both been reported by Supply Chain Dive as accelerating chip orders, further straining available foundry capacity and creating a self-reinforcing shortage dynamic.

Medical MRI machines, which use superconducting magnets cooled by liquid helium, face a parallel crisis. The approximately 50,000 MRI machines installed worldwide require periodic helium refills. Hospitals are already reporting allocation limitations from their helium suppliers — a development that could force rationing of diagnostic imaging capacity.

GeoWire tracks this supply chain disruption in real time through our Supply Chain Cascade Map, which shows the helium flow routes from Qatar to global chip fabs and the current disruption status. The dashboard's recession probability model incorporates the semiconductor supply chain impact through its technology disruption adjustment factor.`,
    },
  ],
};

// ─── Article 3: Yield Curve Un-Inversion ────────────────────────────────────

const yieldCurveUninversion: Article = {
  slug: 'yield-curve-2026-recession-signal',
  title: 'Reading the Yield Curve: What the 2026 Un-Inversion Tells Us',
  subtitle: 'The yield curve just un-inverted after the longest inversion in history — and that\'s the danger signal',
  excerpt:
    'The yield curve just un-inverted after the longest inversion in history. History says the un-inversion is the danger signal, not the inversion itself.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-03-31',
  updatedAt: '2026-03-31',
  readingTime: 6,
  topics: ['recession-risk'],
  severity: 'elevated',
  seoTitle: 'Yield Curve Un-Inversion 2026: The Recession Signal — GeoWire',
  seoDescription: 'The yield curve just un-inverted after the longest inversion in history. History says the un-inversion is the danger signal, not the inversion itself.',
  sections: [
    {
      id: 'the-un-inversion',
      heading: 'The Un-Inversion Nobody Expected',
      body: `As of March 31, 2026, the 10-year minus 3-month Treasury spread (T10Y3M) has turned positive at 0.60 — ending the longest sustained yield curve inversion in modern history. The spread had been negative since mid-2022, roughly 42 months of continuous inversion that eclipsed the previous record of 21 months set in 1978-1980.

Financial media is treating the un-inversion as good news. "Yield Curve Normalizes" read one headline. "Recession Signal Clears" announced another. This interpretation is dangerously wrong.

The historical pattern is unambiguous: recessions begin AFTER the yield curve un-inverts, not during the inversion. The inversion is the warning. The un-inversion is the starting gun. In every recession since 1970 — 1973, 1980, 1981, 1990, 2001, 2008, 2020 — the curve un-inverted (returned to positive slope) within 2-18 months before the recession officially began. The median lag from un-inversion to recession onset is approximately 5 months.

The mechanism is straightforward: the curve un-inverts because either the Fed begins cutting short-term rates in response to deteriorating economic data (pushing the short end down) or because long-term rates spike on rising inflation expectations (pushing the long end up). In the current case, both forces are at work — the market is pricing in emergency Fed cuts while the oil shock is driving long-term inflation expectations higher.`,
    },
    {
      id: 'estrella-mishkin-model',
      heading: 'Inside the Estrella-Mishkin Probit Model',
      body: `The NY Fed's recession probability model, developed by Arturo Estrella and Frederic Mishkin in their seminal 1998 paper "Predicting U.S. Recessions: Financial Variables as Leading Indicators," uses a probit regression with a single input: the T10Y3M spread. The model's coefficients (β₀ = -0.5333, β₁ = -0.6330) produce a probability via Φ(β₀ + β₁ × spread), where Φ is the standard normal CDF.

At the current spread of +0.60, the model outputs a recession probability of approximately 15-18%. This is actually LOWER than when the curve was inverted — which seems counterintuitive but reflects the model's design. The probit model captures the credit conditions signal embedded in the yield curve. A positive spread means the bond market currently sees easier credit conditions ahead. What the model cannot capture is the lag effect: the economic damage from the 42-month inversion is already baked in and working through the system.

This is the fundamental limitation of the Estrella-Mishkin model in the current environment. It is a real-time thermometer that reads "normal" the moment the fever breaks — even if the underlying infection is worsening. GeoWire's composite model addresses this by incorporating five additional signals that capture the lagged effects the yield curve alone misses.`,
    },
    {
      id: 'oil-shock-compound',
      heading: 'The Oil Shock Compounding Factor',
      body: `James Hamilton's 2003 analysis of oil price shocks and economic activity introduced the Net Oil Price Increase (NOPI) framework — a measure of how much oil prices have risen above their previous 3-year peak. When NOPI is positive and large, recessions follow with high reliability.

The current NOPI reading is extreme. Brent crude at $105/barrel represents a roughly 55% increase above its 3-year trailing high of approximately $68. Hamilton's coefficient (-0.15 oil-to-GDP elasticity) implies a GDP drag of approximately 8.25% on an annualized basis — though the actual impact depends on duration and the speed of supply adjustment.

What makes the current situation historically unusual is the combination of a yield curve un-inversion signal AND a major oil shock occurring simultaneously. In 1973, the oil shock preceded the yield curve signal. In 2008, the yield curve inverted well before oil spiked. In 2026, we have both signals firing together, which amplifies the recession risk beyond what either indicator alone would suggest.

GeoWire's Hamilton NOPI model currently contributes the largest single upward adjustment to our composite recession probability — more than the yield curve, more than credit spreads, more than the Sahm Rule. The oil shock is the dominant risk factor.`,
    },
    {
      id: 'sahm-rule',
      heading: 'The Sahm Rule: Labor Market Early Warning',
      body: `The Sahm Rule, developed by economist Claudia Sahm in 2019, triggers when the 3-month moving average of the national unemployment rate rises 0.50 percentage points or more above its low from the prior 12 months. It has correctly identified every recession since 1970 in real time — often before official NBER dating.

The current Sahm Rule reading is 0.37 — below the 0.50 trigger threshold but rising. The March jobs report showed unemployment at 4.2%, up from 3.7% at its cycle low. The trajectory matters: the Sahm indicator has risen 0.15 points in the last two months alone, an acceleration rate consistent with the early stages of the 2001 and 2008 recessions.

Initial jobless claims, the weekly leading indicator of labor market stress, have crept above 240,000 — not yet alarming in isolation, but up 15% from the 210,000 average in Q4 2025. Energy-sector layoffs in the Gulf Coast and rising construction sector unemployment (as interest rates suppress housing starts) are the primary drivers.

If the Sahm Rule triggers at 0.50, it will be the first time in history that the trigger coincides with both a yield curve un-inversion and an active oil shock. The triple confluence has no modern precedent.`,
    },
    {
      id: 'what-to-watch',
      heading: 'What to Watch: A Triple Threat Without Modern Precedent',
      body: `The convergence of three historically reliable recession signals — yield curve un-inversion, Hamilton NOPI oil shock, and an approaching Sahm Rule trigger — creates a risk environment that deserves more attention than it is receiving. No single prior recession featured all three signals activating within the same quarter.

For investors, the key thresholds to monitor are: the Sahm Rule crossing 0.50 (currently 0.37 and rising), high-yield credit spreads crossing 500 basis points (currently approximately 420 and widening), and the Philadelphia Fed Leading Index turning negative for three consecutive months (currently at -0.8 for February, following -0.2 in January).

For business owners, the practical implications are more immediate. The oil shock is already flowing through to transportation costs, with diesel up 38% from pre-crisis levels. The steel and aluminum supply disruptions are adding 15-25% to construction material costs. And the semiconductor supply chain — threatened by the helium shortage — could constrain technology equipment availability by mid-2026.

GeoWire's composite recession probability model currently estimates a 62% probability of US recession within 12 months. This figure incorporates all six of our academic models: the NY Fed Probit (yield curve), Hamilton NOPI (oil shock), Sahm Rule (labor market), Philadelphia Fed Leading Index (broad leading indicators), credit spreads (financial conditions), and our geopolitical risk adjustment. The live reading is available on our dashboard, updated hourly with fresh FRED data.

The yield curve "normalizing" is not the all-clear signal the headlines suggest. It is, historically, the final warning.`,
    },
  ],
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [fortressAmericas, heliumSemiconductor, yieldCurveUninversion];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByTopic(topic: ArticleTopic): Article[] {
  return ARTICLES.filter((a) => a.topics.includes(topic));
}

export function getRelatedArticles(slug: string, limit?: number): Article[] {
  const related = ARTICLES.filter((a) => a.slug !== slug);
  return limit ? related.slice(0, limit) : related;
}
