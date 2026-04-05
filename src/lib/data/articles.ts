/**
 * GeoWire Analysis Articles — seed data
 *
 * Each article is a structured object with metadata and content sections.
 * Content sections drive both the rendered article and the auto-generated TOC.
 */

export type ArticleTopic = 'recession-risk' | 'energy' | 'supply-chain' | 'technology' | 'labor-market' | 'monetary-policy' | 'consumer' | 'education' | 'commodities' | 'credit';
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

// ─── Article 4: April Jobs Report and Recession Signal ───────────────────────

const aprilJobsReport: Article = {
  slug: 'april-jobs-report-recession-signal',
  title: 'What the April Jobs Report Tells Us About Recession Risk',
  subtitle: 'The Sahm Rule reading of 0.37 is accelerating toward the 0.50 trigger threshold',
  excerpt: 'April employment data shows unemployment at 4.2%, pushing the Sahm Rule indicator to 0.37. Historical acceleration patterns suggest the trigger could cross 0.50 by June.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-04-05',
  updatedAt: '2026-04-05',
  readingTime: 7,
  topics: ['recession-risk', 'labor-market'],
  severity: 'elevated',
  seoTitle: 'April Jobs Report and Recession Risk: The Sahm Rule Signal — GeoWire',
  seoDescription: 'April employment data shows unemployment rising. The Sahm Rule reading of 0.37 is accelerating toward the critical 0.50 threshold.',
  sections: [
    {
      id: 'april-jobs-data',
      heading: 'The April 2026 Employment Picture',
      body: `The Bureau of Labor Statistics released the April 2026 employment report on May 1st, showing non-farm payroll growth of 142,000 — below expectations of 180,000 and the lowest monthly figure since June 2022. The unemployment rate rose to 4.2%, up from 3.7% at the cycle low reached in December 2025. This seemingly modest 0.5 percentage point increase masks significant acceleration in labor market deterioration.

Beneath the headline numbers, the data tells a more concerning story. Initial jobless claims averaged 248,000 for the month, up 18% from the 210,000 baseline established in Q4 2025. Continuing claims rose 8.3%, suggesting that workers are taking longer to find re-employment — a characteristic pattern of early-stage recession labor markets. The Labor Force Participation Rate ticked down 0.1 percentage points to 62.4%, indicating some discouraged worker effects beginning to appear.

Sector breakdowns reveal concentrated weakness in energy-related manufacturing and construction. The Gulf Coast petrochemicals sector shed 3,200 positions as refineries delayed maintenance projects in response to volatile crude price swings. Non-residential construction employment fell 1,800, the first monthly decline in this category since mid-2023, driven by delayed commercial real estate projects as office vacancy rates persist at elevated levels.`,
    },
    {
      id: 'sahm-rule-mechanics',
      heading: 'Understanding the Sahm Rule and Its Current Reading',
      body: `The Sahm Rule, named after economist Claudia Sahm who formalized it in 2019, provides a mechanical trigger for recession risk assessment. The rule fires when the three-month moving average of the national unemployment rate rises 0.50 percentage points or more above its 12-month low. The formula is straightforward but its forecasting power is remarkable: it has correctly identified every US recession since 1970 in real time — often weeks or months before NBER official dating.

The current Sahm Rule reading stands at 0.37 as of the April jobs report. This calculation compares the 3-month moving average of unemployment (currently 4.07%) to the 12-month minimum (3.70% in December 2025). With the threshold at 0.50, the indicator is at 74% of the critical trigger level.

What matters more than the absolute level is the trajectory. The Sahm indicator has risen 0.15 percentage points in just eight weeks — from 0.22 in mid-February. If this acceleration continues at the current pace, the rule would trigger by mid-to-late June. Historically, from March to May acceleration rates of this magnitude have preceded NBER-dated recession starts by 3-7 weeks on average.`,
    },
    {
      id: 'leading-indicators-confirm',
      heading: 'Leading Indicators Confirming Labor Market Stress',
      body: `The Sahm Rule is powerful because unemployment is a lagging indicator, but it becomes a leading indicator when viewed through the lens of the 3-month moving average acceleration. To understand current momentum, we must look at forward-looking labor metrics that move before the headline unemployment rate.

Initial jobless claims, published weekly by the Department of Labor, have climbed above 240,000 and are trending upward. The four-week moving average of claims is now at 243,000, up from 198,000 in early March. Historically, when this metric sustainably exceeds 250,000, it signals early-stage labor market deterioration and precedes recession dating by 4-8 weeks.

The JOLTS (Job Openings and Labor Turnover Survey) quit rate, released monthly, stood at 2.1% in March 2026 — down from 2.3% a year earlier. A declining quit rate reflects worker uncertainty and reduced confidence in employment prospects. Workers quit when they have confidence in finding better jobs; quit rate declines signal the opposite. This metric has predicted labor market turning points with notable lead time in both 2007-2008 and 2019-2020 cycles.

Temporary staffing employment, tracked by the Bureau of Labor Statistics as "temporary help services," declined 0.8% in April. Temporary staffing is the "canary in the coal mine" of labor markets — it responds to employer demand fluctuations with just 2-3 weeks of lead time compared to permanent hiring. Declining temporary employment in the context of rising claims and declining quits is a textbook recession warning pattern.`,
    },
    {
      id: 'sector-breakdown-vulnerability',
      heading: 'Sector Breakdown: Energy, Construction, and Contagion Risk',
      body: `The April report's sector details reveal concentration of weakness in economically amplifying areas. Energy sector employment, while small in aggregate (roughly 850,000 jobs across oil, gas, and coal), is canary-like in its sensitivity to commodity prices. With Brent crude at $105, energy sector cutbacks typically ripple through transportation, equipment manufacturing, and hospitality services in oil-producing regions.

Construction employment weakness extends beyond the non-residential segment. Residential construction, while holding steady on headline figures (adding 4,200 jobs), shows concerning subcomponents. Single-family housing starts have rolled over to 4.87 million annualized units, down 12% from Q4 2025 highs. Mortgage originations for purchase intentions fell 18% in April, driven by effective mortgage rates at 7.2% — substantially above the 6.1% level that would be needed to restore affordability at current prices.

This construction weakness has contagion implications. Residential construction employs roughly 1.2 million workers directly and supports another 1.8 million in related manufacturing (lumber, windows, appliances) and logistics. History shows that construction employment declines of the magnitude now beginning flow through to higher unemployment with a 2-3 month lag as suppliers adjust production and logistics companies reduce trucking and warehouse staffing.

Professional and business services employment, at 22.4 million, is particularly sensitive to recession onset because this category includes business services firms (accounting, management consulting, IT services) that react quickly to customer demand signals. While April showed growth of 118,000 in this category, the 3-month average growth has decelerated to 91,000 per month from the 165,000 average in Q4 2025.`,
    },
    {
      id: 'what-to-watch-may-june',
      heading: 'What to Watch: May and June Employment Data',
      body: `The May 2026 employment report, due in early June, will be critical for assessing whether the April acceleration is a one-off or the beginning of structural labor market deterioration. GeoWire's models flag three thresholds that would materially increase recession probability estimates:

First, if the Sahm Rule reading rises above 0.42 in May (implying unemployment moving to approximately 4.3%), this would represent a 0.20 percentage point monthly increase — an acceleration pace consistent with the opening 60-90 days of the 2001, 2008, and 2020 recessions. We assign 60% probability to this threshold being crossed.

Second, if initial jobless claims average above 260,000 in May, this would signal that the April jump was not temporary but the onset of a deteriorating trend. The 4-week moving average exceeding 265,000 has preceded every major labor market shift since 1980 by 3-5 weeks. Current probability of this threshold: 55%.

Third, temporary staffing employment must be monitored for sustained declines. Two consecutive months of temporary staffing declines would be the first occurrence of this pattern since March 2020 (pandemic), February 2008 (financial crisis), and March 2001 (tech downturn). We estimate 45% probability of this threshold being crossed by June.

The intersection of these indicators with the yield curve un-inversion detailed in our March 31st analysis and the Hamilton NOPI oil shock framework creates a confluence of recession signals that GeoWire tracks continuously on our dashboard. The April jobs report accelerated the labor market component of this composite signal substantially.`,
    },
  ],
};

// ─── Article 5: Fed Rate Decision April 2026 ─────────────────────────────────

const fedRateDecision: Article = {
  slug: 'fed-rate-decision-april-2026',
  title: 'Fed Holds Steady: Why the April 2026 Rate Decision Matters for Recession Timing',
  subtitle: 'The dual mandate is fracturing: oil inflation vs. weakening labor markets force the Fed into a corner',
  excerpt: 'The Fed held rates at 4.75% in April 2026, but the decision commentary signals mounting pressure for emergency cuts. The timing of those cuts will determine recession severity.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-04-04',
  updatedAt: '2026-04-04',
  readingTime: 7,
  topics: ['recession-risk', 'monetary-policy'],
  severity: 'elevated',
  seoTitle: 'Fed Rate Decision April 2026: The Dual Mandate Breaks Down — GeoWire',
  seoDescription: 'The Fed held rates steady in April, but hawkish oil inflation versus weakening labor create unprecedented policy pressure.',
  sections: [
    {
      id: 'fed-hold-april-decision',
      heading: 'The Hold Decision and Forward Guidance Shift',
      body: `On April 4, 2026, the Federal Reserve's policy committee voted unanimously to maintain the federal funds rate target at 4.75%, with a range of 4.50-4.75%. This decision was widely expected by market participants and did not surprise overnight index futures. What did surprise — and what GeoWire's models flag as significant — was the shift in forward guidance accompanying the hold decision.

The Fed's updated dot plot showed 75% of committee members now projecting rate cuts by Q4 2026, compared to only 50% three months earlier. More tellingly, the median projection moved from one quarter-point cut to two quarter-point cuts within the calendar year 2026. Committee Chair Jerome Powell's press conference acknowledged "emerging risks to the employment mandate" and stated that "appropriate monetary policy must remain flexible to address incoming data."

This language — "emerging risks," "remain flexible," "address incoming" — is central bank code for "we're preparing the market for rate cuts." The committee is caught between two historically incompatible mandates. Oil-driven inflation in gasoline, diesel, and petrochemicals is pushing the headline Personal Consumption Expenditures (PCE) inflation rate toward 3.2%, above the Fed's 2% target. Simultaneously, the labor market is showing unmistakable early-stage recession characteristics as detailed in our April jobs report analysis.

The Fed's solution — a hold decision combined with dovish guidance — is a betting strategy. By anchoring rates at a "data-dependent" posture, the committee buys time to see whether oil prices mean-revert or whether labor market deterioration continues. But this middle ground may satisfy neither mandate.`,
    },
    {
      id: 'dual-mandate-collapse',
      heading: 'The Dual Mandate in Collapse: Oil Inflation vs. Labor Weakness',
      body: `The Federal Reserve operates under a congressional dual mandate to pursue maximum employment and price stability. These objectives are typically complementary — economic growth generates both employment and inflation. But when supply shocks create stagflation (stagnating growth with rising prices), the mandate fractures.

The current situation is stagflationary in origin but its mechanics are distinct from 1970s OPEC shocks. In the 1970s, inflation was endogenous — embedded in wage-setting expectations and business behavior. Today's inflation is exogenous, driven by geopolitical supply destruction. Oil at $105 reflects Iranian production losses, Gulf aluminum smelter damage, and the absence of a spare capacity buffer (OPEC+ has limited spare capacity remaining). This inflation will not respond to Fed rate increases without causing severe employment losses.

Conversely, rate cuts to support employment will validate oil-driven inflation expectations and risk a wage-price spiral that transforms temporary supply-shock inflation into persistent inflation. The Fed faces a genuine policy constraint: they cannot simultaneously tighten to control inflation and ease to support employment without accepting either much higher inflation or much deeper recession.

The Taylor Rule — a heuristic developed by Stanford's John Taylor that prescribes policy rates as a function of inflation and output gaps — suggests the funds rate should be approximately 6.0-6.5% at current inflation and unemployment readings. The current 4.75% rate is thus 125-175 basis points looser than the Taylor Rule implies. This looseness appears consistent with a Fed that has abandoned its inflation-fighting posture in favor of employment support. But the committee's dot-plot guidance suggests patience, not immediate cuts — a contradiction that the market has noticed.`,
    },
    {
      id: 'historical-precedent-oil-shocks',
      heading: 'Historical Precedent: Oil Shocks and Policy Responses',
      body: `The Fed's current dilemma is not unprecedented, but it is rare. The committee faced similar conflicts in three prior periods: the 1973-74 Arab Oil Embargo, the 1979-80 Iranian Revolution production loss, and the 1990-91 Gulf War oil shock.

In 1973-74, the Fed tightened into recession, prioritizing inflation control under Fed Chair Arthur Burns. The oil embargo created a 400% spike in crude prices. Burns chose to raise the funds rate from 7.75% to 13% between mid-1973 and mid-1974, aiming to choke off demand and combat inflation. The strategy worked: inflation came down, but only after a severe recession (7% peak unemployment) and a persistent stagflationary overhang that took until the early 1980s to purge. Historical retrospectives note that Burns' rate increases did not prevent inflation from rising during the embargo period itself — they simply compounded the employment damage.

In 1979-80, Fed Chair Paul Volcker chose the opposite path: accept higher inflation in the near term, but break inflation expectations through rate increases (funds rate to 20%) once supply shocks began to moderate. The Volcker path was more costly in unemployment terms (recession worse than 1974) but faster in restoring price credibility. By 1983, inflation was below 3% and the economy was recovering.

In 1990-91, Fed Chair Alan Greenspan chose a hybrid approach: hold steady until the shock became clear, then ease aggressively once the supply shock (Iraq's invasion of Kuwait) produced visible recession signals. Greenspan cut rates from 8.25% to 2.75% between July 1990 and July 1992. This rapid easing cushioned the employment impact and allowed a quicker recovery.

The current Fed appears to be attempting a 1990-91 Greenspan-style path: hold, assess, then ease. But the lag time in policy transmission is critical. A rate cut in June 2026 will not support employment at t=June; it will support credit conditions 2-3 months hence. This lag means the Fed is essentially gambling that labor market deterioration can be arrested by mid-2026 cuts — a bet that depends on oil prices stabilizing or the Israel-Iran conflict de-escalating.`,
    },
    {
      id: 'rate-transmission-mechanisms',
      heading: 'Rate Transmission: Housing, Auto, and Credit Card Markets',
      body: `The practical impact of the Fed\'s policy stance flows through three transmission channels: mortgage rates, auto finance rates, and credit card rates. These are the channels through which Fed policy reaches household balance sheets.

Mortgage rates are currently at 7.2% for a 30-year fixed-rate mortgage, roughly 250 basis points above the Fed funds rate of 4.75%. This spread reflects term premiums, credit spreads, and mortgage originator margins. If the Fed cuts rates to 4.25% by September 2026 (the median dot-plot projection), mortgage rates would likely decline to approximately 6.8-6.9%, assuming no change in longer-term bond yields. This decline of 30-40 basis points would improve affordability by roughly 4-5%, enough to stabilize housing demand but insufficient to restore pre-2022 affordability levels.

Auto finance rates are more directly tied to Fed policy. A conventional auto loan at 6.2-6.5% with typical credit terms would decline to approximately 5.9-6.2% following a 50 basis point Fed cut. This improvement would reduce monthly payments by $25-30 on a $40,000 vehicle, a meaningful but not transformative change for household budgets. Auto sales have been showing weakness, with April 2026 sales running at a 15.8 million annualized unit rate, down 8% from Q4 2025. Fed rate cuts would help, but only modestly absent a larger employment confidence recovery.

Credit card rates, set by card issuers as Fed funds + a risk premium, currently average 22.4% and would decline to approximately 21.8-22.0% following a 50 basis point Fed cut. For households already burdened by credit card debt (aggregate revolving debt at $1.18 trillion), this 40-60 basis point decline provides minimal relief.

The transmission channel that matters most for recession timing is credit availability, not rates. If bank credit standards tighten — a response to rising unemployment and deteriorating loan performance — Fed rate cuts lose their punch. This is why GeoWire monitors credit spreads and bank lending officer surveys alongside policy rates.`,
    },
    {
      id: 'yield-curve-fed-interaction',
      heading: 'The Yield Curve, NY Fed Probit Model, and Policy Implications',
      body: `The relationship between Fed policy and the yield curve is indirect but consequential. The Fed controls the short end of the curve through open market operations. Longer-term rates reflect market expectations about future economic conditions and inflation. When the Fed is perceived as too tight, long rates fall (market prices in future easing), and the curve steepens. When the Fed is perceived as too loose, long rates rise, and the curve flattens or inverts.

As detailed in our March 31st yield curve analysis, the curve has now un-inverted to +0.60 on the 10-year/3-month spread. This spread is the input to the NY Federal Reserve's recession probability model, which uses the Estrella-Mishkin probit function. At a spread of +0.60, the model outputs approximately 15-18% recession probability — misleadingly low, as we noted, because the model is backward-looking.

However, the Fed's guidance toward rate cuts is steepening the curve further. Market pricing now implies fed funds at 4.25% by September 2026, which would pull the short end down and steepen the long end. The expected yield curve at that future point would likely be 10-year minus 3-month of approximately +1.2 to +1.5. Paradoxically, a more steeply positive curve — achieved through Fed cuts — would reduce the Estrella-Mishkin recession probability reading even further, creating a false sense of security precisely as recession risk is rising.

This is why GeoWire\'s composite model incorporates lag effects and forward-looking indicators (Hamilton NOPI, Sahm Rule trajectory, credit spreads) alongside the static yield curve signal. The Fed's April hold decision combined with dovish guidance is consistent with our "elevated" severity assessment for near-term recession risk, not a reduction in that risk.`,
    },
  ],
};

// ─── Article 6: Oil Price and Recession History ────────────────────────────────

const oilPriceHistory: Article = {
  slug: 'oil-price-recession-history',
  title: 'Every Oil Shock Since 1973: What History Tells Us About 2026',
  subtitle: "Hamilton's NOPI framework reveals why current $105 oil carries serious recession risk",
  excerpt: 'From 1973 Arab Embargo to 2022 Russia-Ukraine, each major oil shock tells a story. The 2026 shock has characteristics most similar to 1990.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-04-03',
  updatedAt: '2026-04-03',
  readingTime: 8,
  topics: ['energy', 'recession-risk'],
  severity: 'high',
  seoTitle: 'Oil Shocks and Recessions Since 1973: The Hamilton Framework — GeoWire',
  seoDescription: 'A comprehensive history of oil shocks and their recession impacts. Current $105 oil and 0.55 NOPI signal elevated recession risk.',
  sections: [
    {
      id: 'hamilton-nopi-framework',
      heading: 'The Hamilton Framework: Net Oil Price Increase (NOPI)',
      body: `Economist James Hamilton at UC San Diego developed the Net Oil Price Increase (NOPI) framework through his 2003 paper analyzing the relationship between oil prices and recessions. The NOPI measures the increase in the price of oil above its highest level in the prior three years. This approach captures the economically meaningful shock — new prices relative to the recent historical baseline that businesses had adapted to — rather than absolute prices, which can be misleading across decades with different real interest rates and commodity super-cycles.

The formula is straightforward: NOPI(t) = max(0, P(t) - max(P(t-36 months))) ÷ max(P(t-36 months)). When oil rises from a baseline of $50 to $75, NOPI is 0.50. The framework captures how much "newness" the price increase represents for the economy.

Hamilton's empirical finding: a NOPI of 0.10 (10% increase above the prior 3-year high) reduces GDP growth by approximately 1.5% on an annualized basis. The relationship is nearly linear up to NOPI of approximately 0.35, after which the relationship flattens slightly as demand destruction accelerates. The -0.15 elasticity coefficient — meaning a 100% increase in oil prices (NOPI = 1.0) reduces GDP by 15% — has proven robust across multiple recessions and time periods.

The current NOPI reading is extreme. Brent crude at $105 per barrel represents a roughly 55% increase above its 3-year trailing high of approximately $68 (June 2023). The NOPI is therefore 0.55. Using Hamilton's -0.15 coefficient, this implies an 8.25% GDP drag — though this is an annualized calculation that assumes sustained elevated prices. If oil stabilizes at $105 for 6 months, the annual GDP impact would be approximately 4.1%.`,
    },
    {
      id: 'arab-embargo-1973',
      heading: '1973-1974: The Arab Oil Embargo',
      body: `The Yom Kippur War, initiated on October 6, 1973, triggered the Organization of Arab Petroleum Exporting Countries (OAPEC) to impose an oil embargo on nations supporting Israel — specifically the United States and the Netherlands. The embargo cut approximately 5 million barrels per day of global supply, roughly 10% of world production at the time.

The immediate effect was dramatic. Crude prices surged from $2.59 per barrel in September 1973 to $11.65 by year-end — a 350% increase. In NOPI terms, oil had been running at approximately $2.50 per barrel; the spike to $11.65 represented a NOPI of 3.66. This was the largest NOPI shock in modern history.

The recession that followed was severe. US GDP contracted 3.2% in 1974, the worst year since the Great Depression. Unemployment rose from 4.8% to 9.0%. Inflation hit 11% by year-end. The stagflation created a policy dilemma identical to today's: Fed Chair Arthur Burns faced rising inflation and rising unemployment simultaneously.

The embargo lasted until March 1974 — six months. But the damage was permanent: inflation expectations became unanchored, and recovery was slow. NOPI modeled the shock correctly: a 366% NOPI shock should produce severe recession, and it did.`,
    },
    {
      id: 'iranian-revolution-1979',
      heading: '1979-1980: Iranian Revolution Production Loss',
      body: `The Iranian Revolution, culminating in the overthrow of Shah Mohammad Reza Pahlavi in February 1979, removed Iran from global oil markets. Iranian production, which had been running at approximately 5.7 million barrels per day, collapsed to below 1 million bbl/day within weeks.

This was a pure supply shock of roughly 4.7 million bbl/day lost capacity — larger in absolute terms than the 1973 embargo but occurring in a market 30% larger. Brent crude surged from $24 per barrel in December 1978 to $42 by June 1980 — a 75% increase. The prior 3-year high was approximately $14 per barrel, making the NOPI 2.0.

The Fed, now under Paul Volcker, responded with aggressive rate increases (funds rate hit 20% by mid-1981) to break inflation expectations. The recession that followed was deep: GDP contracted 2.7% in 1980, unemployment hit 9.7%, but the inflation kill was fast and permanent. By 1983, inflation was below 3%.

Hamilton's framework predicted this correctly: NOPI of 2.0 implies 30% GDP reduction on an annualized basis, a prediction consistent with the observed recession severity. The policy response mattered for duration but not for the fact of recession — that was determined by oil shock magnitude.`,
    },
    {
      id: 'gulf-war-1990',
      heading: '1990-1991: The Gulf War Shock',
      body: `Iraq's invasion of Kuwait on August 2, 1990, removed approximately 4 million bbl/day of Kuwait's production and threatened Saudi Arabia's 8 million bbl/day capacity. The market feared supply loss of up to 10% of global production. Brent crude spiked from $15 per barrel pre-invasion to $40 within weeks — a 167% jump.

However, the geopolitics shifted quickly. Saudi Arabia remained in the US security umbrella. A coalition military campaign pushed Iraq out of Kuwait within six months. Production was restored by mid-1991. The NOPI, while serious (approximately 1.67 above the $24 three-year baseline), was temporary.

The recession of 1990-1991 was mild — GDP contracted 1.6%, unemployment hit 7.8%, and recovery began by Q2 1991. Fed Chair Alan Greenspan responded with aggressive rate cuts (from 8.25% to 2.75% between July 1990 and July 1992), which cushioned the employment impact. The short-lived NOPI shock combined with rapid policy easing produced a mild recession followed by a fast recovery.

This 1990 case shows that duration matters. A temporary oil shock with appropriate policy accommodation is recessionary but not catastrophic.`,
    },
    {
      id: 'financial-crisis-2008',
      heading: '2008: The Oil Shock Within the Financial Crisis',
      body: `The 2008 financial crisis was fundamentally a credit shock, not an oil shock. However, oil prices spiked in the run-up to the crisis. Brent crude rose from $33 in January 2007 to $147 in July 2008 — a 345% increase. The NOPI, measured from the $31 baseline of 2004, was approximately 3.74 at the peak.

But the timeline reveals the relative importance of the oil shock. Oil peaked in July 2008 — after Bear Stearns' collapse in March, after the first major unemployment rises in spring 2008, but before the Lehman Brothers collapse in September. In other words, the recession was well underway before oil peaked. The oil shock amplified the financial crisis recession but did not cause it.

By year-end 2008, oil had collapsed to $30, and the NOPI returned to near-zero. The GDP contraction of 2.5% in 2008 cannot be attributed to oil shock mechanics; it flowed from credit destruction and the loss of $16 trillion in household wealth.

This case shows the interaction between multiple shocks: an oil shock layered on top of a financial shock amplifies damage. The current environment has some of this quality — oil shock (energy), supply chain shock (aluminum, helium), and labor market deterioration combining for elevated risk.`,
    },
    {
      id: 'russia-ukraine-2022-no-recession',
      heading: '2022: Russia-Ukraine War, High Oil, and No Recession',
      body: `Russia's invasion of Ukraine on February 24, 2022, created an oil shock through supply disruption and energy market uncertainty. Russia and Ukraine together export approximately 5 million bbl/day of oil and petroleum products. Brent crude spiked from $92 to $137 within weeks — a 49% jump. The NOPI, measured from the $77 three-year baseline (June 2019), reached approximately 0.78.

The US did not enter recession in 2022 despite this NOPI shock — the most significant shock without a recession outcome since the 1970s. Why? The answer points to the constraints on the current shock.

First, the US is now a net energy exporter (though still importing crude for refining). Energy production added to the economy rather than reducing it. This was not true in 1973, 1979, or 1990, when the US was a major net importer.

Second, the oil shock proved temporary. By late 2022, prices had fallen back to $85, and NOPI had returned to manageable levels. The supply disruption was managed through spare capacity releases from the Strategic Petroleum Reserve and temporary demand destruction.

Third, the shock did not coincide with other major adverse signals. The yield curve had not un-inverted. The Sahm Rule had not triggered. Credit spreads were not widening. The oil shock was isolated.`,
    },
    {
      id: 'current-2026-situation',
      heading: 'The 2026 Shock: Which Historical Case Applies?',
      body: `Current NOPI is 0.55 — roughly between the 1990 Gulf War magnitude (1.67) and the 2022 Russia-Ukraine shock (0.78), placing it squarely in "recession-risk" territory. But the critical question is duration: will this shock be temporary like 1990/2022 or persistent like 1973/1979?

The geopolitical situation differs from prior cases. The Israel-Iran conflict is not a temporary war with a clear resolution timeline. It could escalate, de-escalate, or settle into a persistent low-level conflict state. Iranian steel is offline for years. Gulf aluminum smelters are damaged with 3-5 year repair timelines. These are multi-year supply losses, not temporary disruptions.

Critically, the 2026 shock coincides with other adverse signals: yield curve un-inversion, Sahm Rule rising, credit spreads widening, consumer sentiment falling. This conjunction is most similar to 1973-74 and 1979-80, not 1990 or 2022. In those earlier cases, oil shock combined with other macro deterioration produced severe recessions.

The difference in the current case: if the Fed cuts rates (as current guidance suggests), the policy response will be more Greenspan-like (1990) than Volcker-like (1979). This matters for amplitude and duration but not direction. A recession with Greenspan-style accommodation would be milder than Volcker's path, but still a recession.

Hamilton's framework suggests 0.55 NOPI at 4+ months duration implies 8% GDP annualized drag, translating to roughly 2% negative GDP growth if sustained for one quarter. This alone would not trigger recession NBER definition (two consecutive quarters of negative growth), but combined with the labor market deterioration tracked by the Sahm Rule, the probability rises substantially.`,
    },
  ],
};

// ─── Article 7: Credit Spreads Explained ──────────────────────────────────────

const creditSpreadsExplained: Article = {
  slug: 'credit-spreads-explained',
  title: 'Credit Spreads: The Bond Market\'s Recession Early Warning System',
  subtitle: 'High-yield spreads at 420 bps remain below crisis levels — but are rising fast',
  excerpt: 'Credit spreads are widening as recession risk rises. History shows spreads explode to 900-2000 bps at recession onset. Current 420 bps is entering yellow zone.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-04-02',
  updatedAt: '2026-04-02',
  readingTime: 6,
  topics: ['recession-risk', 'credit'],
  severity: 'medium',
  seoTitle: 'Credit Spreads as Recession Warning: What Investors Need to Know — GeoWire',
  seoDescription: 'High-yield credit spreads have risen to 420 bps, entering the yellow zone. History shows spreads spike to 900-2000 bps at recession onset.',
  sections: [
    {
      id: 'what-are-credit-spreads',
      heading: 'What Are Credit Spreads and Why Do They Matter?',
      body: `A credit spread is the difference in yield between a corporate bond and a risk-free Treasury bond of the same maturity. For example, if a 7-year Treasury note yields 4.1% and a corporate bond rated BB (high-yield, sub-investment-grade) yields 6.9%, the spread is 280 basis points (2.80 percentage points). This spread compensates investors for bearing credit risk — the possibility that the corporation cannot pay interest or principal when due.

The ICE BofA High Yield Option-Adjusted Spread (HY OAS) is the market's primary real-time measure of credit risk appetite. It measures the average spread across all US high-yield bonds (ratings BB and below, generally issued by non-investment-grade corporations). When spreads are tight (100-200 bps), the market is pricing in low default risk and strong economic conditions. When spreads are wide (700+ bps), the market is pricing in significant default risk and economic stress.

Credit spreads are economically significant because they directly affect corporate borrowing costs. When spreads widen, companies must pay higher interest to access credit markets. This increase in borrowing costs dampens capital expenditure, hiring, and expansion. Conversely, when spreads compress, credit becomes cheap, and businesses accelerate spending. Credit spreads are thus a transmission mechanism between the bond market's expectations and real economic behavior.

The bond market is "smarter than stocks" in the technical sense that it incorporates forward-looking information more efficiently. Bond investors are focused on whether they will receive their principal repayment; stocks are focused on future profits. When recession risk rises, bond investors react first — spreads widen — because default risk rises before equities reflect the earnings impact. This makes credit spreads a leading indicator.`,
    },
    {
      id: 'historical-spread-levels',
      heading: 'Historical Credit Spreads at Recession Onset',
      body: `A review of credit spreads during historical recessions reveals a clear pattern: spreads explode upward at the onset of recession, reaching specific thresholds that correlate with economic severity.

In the 2001 recession (tech downturn), HY spreads rose from 300 bps in late 2000 to approximately 900 bps by September 2001, coinciding with the NBER-dated recession peak. The recession was mild (GDP contraction of 0.5%), and the spread level at 900 bps remained below levels seen in worse recessions.

In the 2008-2009 financial crisis, HY spreads peaked at approximately 2,000 bps in November 2008 — the highest level recorded in the modern data series beginning in 1986. This corresponded to a 2.5% GDP contraction and peak unemployment of 10.0%. The extreme spread level accurately reflected the severity of the crisis.

In the 2020 pandemic recession (the mildest recent recession by GDP metrics), HY spreads peaked at approximately 1,000-1,100 bps in March 2020, then recovered quickly to 400-500 bps by summer 2020 as Fed emergency measures stabilized financial conditions. The spread levels were more severe than 2001 despite the recession being mild in duration and GDP terms, reflecting the exceptional financial system stress.

The pattern is clear: severe recessions show spreads at 1,000+ bps. Mild recessions show spreads at 700-1,000 bps. The current level of 420 bps is still well below recession onset levels, but this is the key question: are spreads about to widen sharply, or will economic conditions stabilize?`,
    },
    {
      id: 'current-spreads-signal',
      heading: 'Current Spread Levels and What They Signal',
      body: `As of April 2, 2026, the ICE BofA HY OAS stands at 420 basis points. This represents a widening of 75 bps from the February 2026 level of 345 bps, and a significant widening from the late-2023 low of 240 bps. The direction is concerning; the absolute level remains below historical crisis levels.

The widening from 345 to 420 bps in six weeks signals rising credit risk assessment in the market. The pace of widening — roughly 12 bps per week — is not yet at crisis rates (during 2008, spreads widened at 20-30 bps per week), but the trajectory is negative.

The composition of spreads matters as well. Within the broad HY index, the riskiest segments (single-B and CCC-rated bonds) have widened more aggressively than higher-quality BB bonds. This indicates that the market is correctly identifying which companies face the greatest refinancing and default risk. Energy companies (affected by oil volatility), retail companies (facing consumer demand pressure), and real estate companies (threatened by interest rate exposure and the rising unemployment discussed in our April jobs report analysis) are showing the most significant spread widening.

The interpretation GeoWire applies is "yellow zone" — spreads are rising in a way consistent with early-stage recession probability increases, but they have not yet reached the levels that indicate recession has begun. The thresholds we monitor are: 500 bps (current level is 25% below this), 650 bps (enters severe recession territory), and 900 bps (historical level associated with moderate recessions).`,
    },
    {
      id: 'relationship-to-fed-policy',
      heading: 'Credit Spreads and Fed Policy Interaction',
      body: `The relationship between Fed policy and credit spreads is direct but nonlinear. When the Fed is tightening (raising rates), spreads widen because higher rates reduce borrowing capacity and increase default risk. When the Fed is easing (cutting rates), spreads compress because lower rates increase asset values and improve refinancing conditions.

However, the current situation shows this relationship breaking down. The Fed has held rates steady and signaled future easing, yet spreads have widened. This disconnect indicates that the market is not responding to Fed policy expectations; it is responding to deteriorating economic fundamentals (oil shock, labor market weakness, geopolitical risk) that overshadow policy accommodation.

This is precisely the pattern seen in 2007 — the Fed maintained 2007 rates at 5.25% while HY spreads widened from 240 bps to 410 bps in the second half of the year. The widening happened not because Fed policy was tight, but because market participants recognized credit deterioration was underway. It was only in 2008 that the Fed cut rates sharply, after spreads had already signaled the problem.

The current dynamic suggests that Fed rate cuts (likely coming in June 2026 based on committee guidance) will help stabilize spreads if they are modest (50 bps total). However, if cuts are deeper (100+ bps) or more rapid, the market may interpret this as Fed panic and spreads could widen further. The Fed is constrained to small cuts on a slow trajectory — their April guidance signals exactly this approach.`,
    },
    {
      id: 'geowire-methodology',
      heading: 'How GeoWire\'s Credit Spread Model Works',
      body: `GeoWire\'s proprietary credit spread model incorporates three components: the current OAS level, the trajectory of widening over the prior 8 weeks, and the composition of spreads by credit rating segment.

The model outputs three thresholds:
1. Green zone (below 350 bps): Credit markets are pricing low recession probability. Recession probability contribution: 0-15%.
2. Yellow zone (350-550 bps): Credit deterioration is occurring. Recession probability contribution: 15-35%.
3. Red zone (above 550 bps): Credit markets are pricing recession. Recession probability contribution: 35-60%.

At the current 420 bps level, we are in the yellow zone, contributing approximately 25% to GeoWire's composite recession probability model. The widening trajectory of 12 bps per week suggests a potential crossing into red zone (550 bps) in approximately 10 weeks, or by mid-June 2026, assuming the pace continues.

However, spread momentum is not linear. A positive shock (e.g., Iran-Israel conflict de-escalation) could compress spreads by 50+ bps within days. A negative shock (e.g., major energy infrastructure further damaged, or a bank credit loss surprise) could widen spreads by 100+ bps in a matter of hours.

GeoWire monitors the credit spread model in real-time on our dashboard, updated hourly with ICE data feeds. The model incorporates a forward-looking elasticity that estimates the spread widening likely to follow a given economic deterioration (unemployment rise, GDP miss, earnings surprise). This elasticity allows us to signal spread movements before they happen in the market.`,
    },
    {
      id: 'what-to-watch',
      heading: 'What to Watch in Credit Markets',
      body: `For investors and business leaders tracking recession risk, credit spreads offer a real-time temperature reading of financial system stress. The next key thresholds are:

First, any widening above 450 bps on strong volume (>$2 billion traded per day) would confirm that the widening is not random noise but a systematic re-pricing of credit risk.

Second, if single-B spreads (the lowest-quality high-yield issuers) widen to 600+ bps while BB spreads remain at 450 bps, this would indicate a "bifurcation" of the market — a pattern that precedes broader credit deterioration by 2-4 weeks in 2007-2008 and 2019-2020 data.

Third, if investment-grade credit spreads (BBB-rated and higher) begin widening in sympathy with high-yield spreads, this would signal contagion from sub-investment-grade stress to the broader corporate bond market — a development that historically precedes corporate default rate acceleration by 6-8 weeks.

The credit spread model is one of six inputs to GeoWire's composite recession probability framework. It is currently signaling "yellow zone" risk, but the trajectory is negative and monitoring is warranted.`,
    },
  ],
};

// ─── Article 8: Hormuz Closure and Global Shipping ─────────────────────────────

const hormuzClosure: Article = {
  slug: 'hormuz-closure-global-shipping',
  title: '21 Million Barrels Per Day: What a Hormuz Closure Means for Global Shipping',
  subtitle: 'Strait of Hormuz carries one-third of global seaborne oil. A closure would redirect 21M bbl/d via Cape of Good Hope.',
  excerpt: 'The Strait of Hormuz carries 21 million barrels per day. Japan, South Korea, India, and China depend critically on this chokepoint. A closure would spike oil to $200+.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-04-01',
  updatedAt: '2026-04-01',
  readingTime: 6,
  topics: ['supply-chain', 'energy'],
  severity: 'high',
  seoTitle: 'Strait of Hormuz Chokepoint: 21M bbl/d at Risk — GeoWire',
  seoDescription: 'The Strait of Hormuz carries one-third of global seaborne oil. A closure would require 21M bbl/d redirect via Cape of Good Hope.',
  sections: [
    {
      id: 'hormuz-geography',
      heading: 'The Geography of Hormuz: Width, Depth, Traffic',
      body: `The Strait of Hormuz, separating Oman from Iran, is the world\'s most critical oil chokepoint. The strait is approximately 55 kilometers (34 miles) wide at its narrowest point, with two distinct shipping lanes for inbound and outbound traffic separated by a buffer zone. The channel\'s depth is approximately 160 meters (525 feet) at its deepest, though shipping lanes are maintained at approximately 25 meters minimum draft — tight enough that the largest ULCC (ultra-large crude carrier) tankers at full displacement cannot freely transit.

Traffic volume is staggering. Approximately 21 million barrels per day of crude oil and petroleum products pass through Hormuz — roughly 30% of all globally traded crude oil. This excludes LNG traffic through Qatar\'s submarine export terminal north of the strait, which carries approximately 110 million tonnes per year (roughly 20% of global LNG supplies) and would face disruption in a closure scenario.

The narrowness creates vulnerability. A single large ship sunk in the main channel could block transit for weeks while salvage operations proceed. Iran maintains speedboats and anti-ship missiles deployed along its coastline, giving it the capability to threaten traffic at will. The combination of geographic narrowness and military capability on one side of the border (Iran) creates asymmetric leverage.`,
    },
    {
      id: 'country-dependencies',
      heading: 'Asymmetric Country Dependencies on Hormuz Oil',
      body: `Four countries have critical dependencies on Hormuz-transited oil that would create immediate economic disruption in a closure scenario:

Japan imports approximately 85% of its crude from the Middle East, with roughly 80% of that traffic transiting Hormuz. Japan\'s strategic petroleum reserve (SPR) contains approximately 150 million barrels, sufficient for roughly 90 days at normal consumption rates of 1.8 million bbl/d. But Japan has zero domestic production and cannot shift rapidly to alternative sources (Russia and North Sea supplies are committed to Europe via long-term contracts). A Hormuz closure would deplete Japan\'s SPR within 3 months, then require demand destruction (industrial energy rationing).

South Korea imports approximately 70% of its crude from the Middle East via Hormuz. The country\'s SPR is approximately 110 million barrels, sufficient for 90 days. South Korea\'s petrochemical sector (major downstream user) would face production constraints within 4 months of a closure.

India imports approximately 60% of its crude from the Middle East, but India has the additional vulnerability of low SPR reserves — only 36 million barrels, sufficient for 15-20 days at consumption of 1.9 million bbl/d. India would face immediate energy rationing in a closure scenario.

China imports approximately 45-50% of its crude from the Middle East via Hormuz, but China has strategic leverage unavailable to other countries: its 950 million-barrel SPR (the world\'s largest) provides 90 days of coverage, and China maintains alternative supply relationships with Russia (via pipeline), Central Asia, and Latin America (Venezuela). A Hormuz closure would strain China\'s energy supplies but would not be immediately catastrophic.`,
    },
    {
      id: 'cape-good-hope-alternative',
      heading: 'The Cape of Good Hope Alternative: Time and Cost',
      body: `A Hormuz closure would force rerouting of 21M bbl/d around Africa\'s Cape of Good Hope, approximately 6,000 additional nautical miles compared to the Hormuz route. The additional transit time is approximately 2-3 weeks, depending on tanker speed and weather conditions.

The economic impact of this rerouting is substantial. A VLCC (very large crude carrier) tanker of 300,000-barrel capacity costs approximately $45,000-$55,000 per day to operate. The additional 2-3 week voyage requires an additional tanker of similar size and cost to maintain the same throughput — effectively a 20-30% increase in global tanker fleet requirement or a 20-30% increase in daily operating costs for crude transport.

At 21 million bbl/d diverted, the additional daily cost of Cape routing would be approximately $6.3 billion per day (assuming 30 additional tankers of $55,000/day operating cost each, not accounting for spot rate increases that would occur under supply-constrained conditions). Over a year, this represents $2.3 trillion in additional shipping costs — an effective "tax" on global oil consumption that would flow to tanker owners and shipping companies.

More critically, the global tanker fleet is not sized to accommodate a Hormuz closure. Current global fleet utilization is approximately 87%, meaning roughly 13% of tankers are available for spot charters. A 20-30% capacity increase cannot be absorbed without pushing utilization to 100% and triggering spot rates to spike 5-10x normal levels. This is what occurred during the Tanker Wars of 1984-88 when Iran and Iraq attacked oil tankers in the Gulf.`,
    },
    {
      id: 'insurance-premiums-tanker-wars',
      heading: 'Insurance Premiums and the Tanker Wars Historical Parallel',
      body: `During the Iran-Iraq War (1980-1988), the so-called Tanker Wars saw systematic attacks on oil tankers in the Persian Gulf. Between 1984 and 1988, approximately 250 merchant vessels were attacked, with 62 sunk and dozens more damaged. The attacks created a war risk premium on tankers operating in the region that peaked at approximately 12% of vessel value per transit — meaning a tanker owner faced $36 million in potential war loss on a $300 million vessel.

War risk insurance rates spiked from 0.25% of cargo value to 5-8% during peak Tanker Wars periods. For a 300,000-barrel tanker with crude at $40/barrel (1987 prices), the cargo value was approximately $12 million, and insurance at 5% meant a $600,000 insurance cost per voyage — added to the normal $45,000/day operating cost.

A modern Hormuz closure would likely trigger similar insurance dynamics. Under-insurance would be unavailable (insurers would withdraw coverage entirely), and spot war-risk rates would spike dramatically. Combined with physical shipping cost increases and the effective reduction in global throughput, a closure would create an immediate $200+ oil price scenario within days.`,
    },
    {
      id: 'lng-transit-qatar',
      heading: 'LNG Transit: Qatar\'s Alternative Vulnerability',
      body: `While crude oil can be rerouted around the Cape, LNG (liquefied natural gas) cannot be easily redirected. Qatar produces approximately 110 million tonnes of LNG annually (roughly 20% of global LNG supply), nearly all of which is exported via tanker through the Strait of Hormuz. Qatar\'s LNG export terminal at Ras Laffan (which also produces 30% of the world\'s semiconductor-grade helium, as discussed in our March 29 helium article) is north of the Hormuz strait, meaning all export traffic must transit the channel.

If Hormuz were closed, Qatar\'s LNG would be trapped. The country could theoretically pipe LNG overland via pipeline to the Arabian Peninsula and transport it via truck to alternative ports (Oman or the Red Sea), but this would require months of infrastructure buildout and would be economically ruinous for Qatar. The country\'s income would collapse until exports resumed.

This creates a secondary crisis: LNG prices would spike globally, affecting power generation and heating in Europe, Asia, and other LNG-dependent regions. Winter energy crises would become possible even in spring months if demand destruction pushed consumption sharply lower.`,
    },
    {
      id: 'current-naval-posture',
      heading: 'Current Naval Posture and Closure Risk Assessment',
      body: `The US Navy maintains a continuous carrier strike group (CSG) presence in the region, typically rotating through the 5th Fleet (covering the Persian Gulf and Indian Ocean). The current CSG includes a Nimitz-class carrier, two guided-missile cruisers, two guided-missile destroyers, and approximately 65 carrier air wing aircraft. The mission of this force is explicitly to maintain freedom of navigation through Hormuz and other critical sea lanes.

However, a determined Iran-backed blockade of Hormuz would not be broken by a single CSG. A closure scenario would require sustained naval presence and likely amphibious or air operations against shore-based Iranian anti-ship systems. The US military is capable of this, but the logistics are complex and the escalation risks are real.

The current elevated geopolitical risk (Israeli strikes on Iran, Iranian retaliation, ongoing US-Iran tensions) has raised the closure probability materially above the baseline. During normal times, closure probability is assessed by shipping insurers at below 1% annual likelihood. Current market estimates (implied by tanker spread markets and insurance pricing) suggest 8-15% probability of a Hormuz closure lasting 30+ days within the next 12 months.

A 12% closure probability, combined with a 60%+ impact to global oil supply if closure occurs, creates an expected value (probability × impact) that is substantial. GeoWire incorporates this Hormuz closure probability into our geopolitical risk adjustment factor on the dashboard.`,
    },
  ],
};

// ─── Article 9: Consumer Sentiment and Recession ───────────────────────────────

const consumerSentiment: Article = {
  slug: 'consumer-sentiment-recession',
  title: 'Why Consumer Sentiment Is Crashing — And Why It Matters',
  subtitle: 'Michigan Consumer Sentiment at 77.2 — down 22 points from the cycle high. Gas prices are the primary driver.',
  excerpt: 'Consumer sentiment has collapsed to multi-year lows. Sentiment-to-spending lag of 2-3 months suggests retail sales weakness ahead.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-03-30',
  updatedAt: '2026-03-30',
  readingTime: 6,
  topics: ['recession-risk', 'consumer'],
  severity: 'elevated',
  seoTitle: 'Consumer Sentiment Crash: What It Means for Recession Risk — GeoWire',
  seoDescription: 'Michigan Consumer Sentiment index at 77.2. Sentiment declines preceded recessions by 60-90 days historically.',
  sections: [
    {
      id: 'michigan-sentiment-readings',
      heading: 'Michigan Consumer Sentiment: Current Reading and Trend',
      body: `The University of Michigan\'s Index of Consumer Sentiment (UMCSent) is released in two parts: a preliminary reading mid-month and a final reading at month-end. The March 2026 final reading came in at 77.2, down 4.8 points from the February reading of 82.0 and down substantially from the cycle high of 99.1 reached in December 2024.

The decline of 22 points over 15 months represents the sharpest sentiment deterioration since 2021-2022 (the inflation shock period) and is steeper than the 16-point decline seen during the 2019-2020 pandemic recession lead-up. The subcomponents of the sentiment index reveal concentrated weakness in consumer expectations and buying intentions, not just current conditions assessment.

The current conditions component (based on household assessment of current financial situation and economic conditions) stands at 87.3, down 6.2 points from December. The expectations component (6-month-ahead outlook) is at 69.5, down 18.1 points from December. This bifurcation — conditions falling modestly while expectations plummet — is a classic recession-leading pattern. Consumers are saying: "Things are okay now, but I believe they will be much worse in six months."`,
    },
    {
      id: 'gas-prices-primary-driver',
      heading: 'Gas Prices as the #1 Driver of Sentiment Collapse',
      body: `The University of Michigan\'s monthly survey asks respondents to identify the most important factor affecting their personal finances and economic outlook. The March 2026 survey revealed that gasoline prices were cited by 38% of respondents as the primary concern — the highest share since 2008, when oil spiked to $147 and triggered the financial crisis.

Gasoline prices have indeed spiked. Regular unleaded gasoline is currently averaging $3.89 per gallon nationally, up from $2.61 in December 2025 — a 49% increase in just four months. Diesel is up 52%, to $4.27 per gallon. These increases flow directly from the $105 Brent crude price driven by the Israel-Iran conflict and resulting supply destruction, as detailed in our oil price history article.

The psychological impact of gas price increases is disproportionate to the actual household budget impact. At current driving patterns, a 49% gas price increase adds approximately $1,200-$1,500 annually to the typical household's transportation budget. For a household earning $75,000 per year, this represents roughly 1.8% of annual income — material but not catastrophic. Yet survey data shows that consumers perceive gasoline price increases as roughly 3-4x their actual budget impact.

This perception gap matters because consumer spending is driven by perceived wealth and expectations, not just actual cash flow. A consumer who believes gas will hit $5 per gallon and stay there is more likely to cut discretionary spending today in anticipation of future constraints, even if current finances are stable. This precautionary saving behavior is precisely what survey data shows: buying intentions for durable goods (cars, appliances, furniture) have collapsed 15-18% in the March sentiment survey, the largest drop since April 2020.`,
    },
    {
      id: 'sentiment-spending-mechanism',
      heading: 'The Sentiment-to-Spending Transmission Mechanism',
      body: `Consumer spending comprises roughly 70% of US GDP. Sentiment indices like the Michigan reading are leading indicators of consumer spending because they capture consumer expectations about the future. When sentiment falls, consumers cut discretionary spending in anticipation of lower future income or economic stress.

The transmission mechanism operates with a 2-3 month lag. A sentiment decline in March typically shows up as retail sales weakness in May. This lag reflects the time it takes for survey respondents\' changed expectations to translate into actual spending behavior. Historically, the correlation between Michigan sentiment changes and subsequent retail sales changes is approximately 0.72 — strong but not perfect, indicating sentiment captures 50%+ of the variance in spending.

The current March 2026 sentiment decline of 4.8 points is substantial. Using historical elasticity estimates, a 4.8-point decline should translate to approximately 1.8-2.2% decline in retail sales growth over the subsequent 2-3 months, all else equal. Forward-looking retail sales forecasts for April-May 2026 (made before the March sentiment data was fully absorbed) were projecting 2.5-3.0% year-over-year sales growth. The sentiment decline suggests actual April-May sales will likely run at 0.5-1.5% year-over-year growth, a significant deceleration.`,
    },
    {
      id: 'sentiment-recession-precedent',
      heading: 'Sentiment Declines and Recession: Historical Precedent',
      body: `The historical record is clear: sharp sentiment declines precede recessions. In the lead-up to the 2001 recession, Michigan sentiment fell from 107 (cycle high in 2000) to 82 by August 2001 — a 25-point decline that began 6-9 months before the NBER-dated recession. The lag reflected the tech bubble unwind and post-9/11 uncertainty.

In the lead-up to the 2008-2009 financial crisis, sentiment fell from 89.6 (October 2007) to 54.9 (February 2009) — a 34.7-point collapse that reflected both the financial shock (declining wealth, falling home prices) and deteriorating labor market (job losses accelerating). The sharpest declines occurred 6 months before the trough, not at the trough.

In the 2020 pandemic recession, sentiment fell from 101.4 (November 2019) to 71.0 (April 2020) — a 30.4-point collapse in just five months, the sharpest decline on record. Recovery was nearly as fast (sentiment back above 80 by September 2020) because stimulus and reopening confidence rebounded expectations quickly.

The current decline of 22 points over 15 months is substantial but not yet at historical recession-onset magnitudes. The 2001, 2008, and 2020 precedents all show declines exceeding 25-30 points before official recession. However, the current trajectory matters: if sentiment falls another 10-15 points over the next 2-3 months (a risk given potential further oil price increases or labor market deterioration), the current cycle would match historical precedent.`,
    },
    {
      id: 'retail-housing-sentiment-breakdown',
      heading: 'Retail Sales and Housing Sentiment Subcomponents',
      body: `The overall Michigan sentiment reading of 77.2 masks sector-specific weakness. Survey respondents were asked about buying intentions for various categories: automobiles, home furnishings, major appliances, and home purchases (intent to buy in next 6 months). The automobile buying intention index fell 18% in March, the steepest monthly decline since April 2020. Home purchase intentions fell 12%, also a multi-year low.

These declines are driven by the combination of gas prices and higher interest rates. Automobile purchases are elastic to gas price expectations (when gas is perceived as expensive and rising, consumers delay car purchases in favor of more efficient vehicles or hold existing vehicles longer). Home purchase intentions are elastic to mortgage rates — at 7.2%, mortgage rates have priced out entry-level buyers and are pushing existing homeowners to delay downsizing or upgrading. A 1% rise in mortgage rates reduces home purchase demand by approximately 10-15% historically.

Retail sales have held up better than sentiment would suggest (January-February 2026 retail sales were at +3.2% year-over-year), but this strength is likely driven by earlier economic momentum and tax refunds rather than forward-looking demand. The sentiment data suggests this momentum is about to hit a wall.

Housing sentiment is particularly concerning because housing is the asset that drives consumer wealth for median households. A decline in home purchase intentions coupled with falling home price expectations (down 8 points in the March survey from February) creates a wealth destruction narrative that amplifies precautionary saving behavior.`,
    },
    {
      id: 'what-to-watch-ahead',
      heading: 'What to Watch: April Retail Sales and Unemployment',
      body: `The intersection of consumer sentiment data with the labor market deterioration tracked by the Sahm Rule (currently 0.37 and rising, as detailed in our April jobs report analysis) creates a pincer movement on consumer behavior. Falling sentiment suggests consumer are preparing for worse times ahead; rising unemployment validates those concerns and turns pessimistic expectations into actual income loss.

For business leaders and investors, the key thresholds to monitor in April-May 2026 are:

First, April retail sales (due May 15) must show deceleration to below 1.5% year-over-year growth for the sentiment transmission to be confirming recession signal.

Second, unemployment must not creep above 4.3% — the Sahm Rule threshold of 0.50 — in May. Any further Sahm acceleration would lock in the recession signal from sentiment and labor market simultaneously.

Third, Michigan sentiment in April 2026 (preliminary reading due May 15, final reading May 30) must stabilize or begin recovering. Further declines below 75 would indicate that sentiment is entering the "recession begins" territory.

GeoWire\'s composite recession probability model incorporates the Michigan sentiment reading as one of six inputs. The current reading contributes approximately 20% to overall recession probability. Combined with the Sahm Rule trajectory (30%), oil shock (25%), yield curve un-inversion (12%), credit spreads (8%), and geopolitical risk (5%), the consumer sentiment factor is one of the more material forward indicators in our dashboard model.`,
    },
  ],
};

// ─── Article 10: Recession Indicator Guide ────────────────────────────────────

const recessionGuide: Article = {
  slug: 'recession-indicator-guide',
  title: 'A Beginner\'s Guide to Reading Recession Indicators',
  subtitle: 'Evergreen educational guide: what is a recession, how do economists predict them, and what are the key warning signs?',
  excerpt: 'What is a recession? How do economists know one is coming? A primer on recession indicators for investors and business leaders.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-03-29',
  updatedAt: '2026-03-29',
  readingTime: 8,
  topics: ['recession-risk', 'education'],
  severity: 'low',
  seoTitle: 'Recession Indicators Explained: A Beginner\'s Guide — GeoWire',
  seoDescription: 'Understand what a recession is, how economists predict them, and how to read the six most important recession leading indicators.',
  sections: [
    {
      id: 'what-is-recession',
      heading: 'What Is a Recession? NBER Definition vs. Common Myth',
      body: `A common misconception is that a recession is defined as two consecutive quarters of negative real GDP growth. This definition is widespread in finance media but is incorrect. The actual definition, used by the National Bureau of Economic Research (NBER), is more subtle.

The NBER defines a recession as "a significant decline in economic activity spread across the economy, lasting more than a few months." The operative word is "significant" — not automatically "negative GDP growth." A recession can coincide with positive GDP growth if growth is substantially below trend and employment is falling. Conversely, negative GDP growth in a single quarter is not automatically a recession if the deterioration is brief and localized.

The NBER\'s Business Cycle Dating Committee determines recession start and end dates retrospectively, typically announcing them 6-12 months after the actual turning point. This means we are never in "official" recession until after significant time has passed. For real-time decision-making, economists use leading indicators (discussed below) to estimate recession probability before NBER official dating.

The 2020 pandemic recession is the clearest example. GDP fell 3.4% in Q2 2020 — a severe contraction. But the NBER dated the recession as lasting only two months (February-April 2020) despite the fact that unemployment remained above 7% through August 2020 and didn\'t return to pre-recession levels until late 2020. In other words, even after the recession officially "ended," labor market damage persisted for months.

For business planning purposes, thinking of recession as "period when unemployment is rising and business conditions are deteriorating" is more practical than waiting for GDP growth numbers that arrive months late.`,
    },
    {
      id: 'six-key-indicators',
      heading: 'The Six Most Important Recession Leading Indicators',
      body: `Economists and market participants use six primary indicators to assess recession risk in real time. These indicators have been validated against historical recessions since 1970 and each has demonstrated predictive power independently.

1. The Yield Curve (10-year minus 3-month Treasury spread). An inverted yield curve (where short-term rates are higher than long-term rates) has predicted every US recession since 1970. The mechanism is that an inversion signals that the bond market expects future rate cuts and economic stress. However, the recession typically comes AFTER the curve un-inverts, not during the inversion. Current reading: +0.60 (positive, post-inversion).

2. The Sahm Rule (3-month unemployment moving average above prior 12-month low by 0.50+ percentage points). This indicator has triggered before every recession since 1970 in real time. It is mechanically simple and has never given a false positive (not triggered when no recession followed). Current reading: 0.37, approaching the 0.50 trigger threshold.

3. Initial Jobless Claims (Department of Labor weekly claims data). When claims sustainably exceed 250,000 and show uptrend, this signals early-stage labor market deterioration. Claims are released every Thursday and provide weekly real-time data. Current reading: 248,000 four-week average, rising.

4. The Philadelphia Fed Leading Economic Index (includes six components: housing permits, unemployment rate, average weekly hours, ISM new orders, etc.). This index turns negative for three consecutive months as recession approaches. Current reading: -0.8 in February, turning negative.

5. High-Yield Credit Spreads (ICE BofA HY OAS). When spreads widen above 500 basis points and continue widening, this signals that the bond market is pricing in elevated default risk — a recession signal. Current reading: 420 bps, rising.

6. Consumer Confidence / Sentiment (Michigan Consumer Sentiment Index). Sharp declines in consumer sentiment precede consumer spending weakness and recession by 2-3 months. Current reading: 77.2, down significantly from recent highs.`,
    },
    {
      id: 'yield-curve-analogy',
      heading: 'The Yield Curve: A Simple Analogy',
      body: `The yield curve\'s inverted state signals recession risk but can be confusing to non-economists. Here\'s a simple way to think about it:

Imagine a seesaw with short-term interest rates on one end and long-term interest rates on the other. Under normal conditions, investors demand higher interest rates for lending money for longer periods (you want higher interest for lending $100 for 10 years than for 10 months). So the seesaw is balanced with long-term rates higher.

If investors begin expecting a recession and lower interest rates in the future, they will pay more for long-term bonds now (betting that rates will fall), driving down long-term rates. Simultaneously, the short-term rate is set by the Fed, which may hold it steady. The seesaw flips — short-term rates are now higher than long-term rates. This inversion is the "recession signal" because it reflects bond market expectations of future economic stress.

Once the recession actually begins, the Fed typically starts cutting short-term rates, pushing the short end down. Long-term rates may rise or stay steady. The seesaw returns to normal (long-term above short-term). This un-inversion looks like good news, but historically, the un-inversion happens just as the recession is beginning. So the curve "returning to normal" is actually a warning sign, not an all-clear.

The current curve is un-inverted (+0.60), suggesting the recession period is near or underway, not far in the future.`,
    },
    {
      id: 'sahm-rule-plain-english',
      heading: 'The Sahm Rule in Plain English',
      body: `The Sahm Rule, named after economist Claudia Sahm, is mechanically simple but powerful. Here\'s how it works:

Step 1: Take the current unemployment rate (e.g., 4.2% in April 2026).
Step 2: Average this with the prior two months\' unemployment rates. (April 4.2% + March 4.0% + February 3.9% = 12.1% ÷ 3 = 4.03% three-month average).
Step 3: Find the lowest unemployment rate in the prior 12 months. (In April 2026, the low is 3.7% from December 2025).
Step 4: Subtract step 3 from step 2. (4.03% - 3.7% = 0.33%).
Step 5: If this number reaches 0.50 percentage points or higher, the Sahm Rule triggers and signals recession probability.

Current reading is 0.37, meaning we are at 74% of the trigger threshold. Why does this work? Because unemployment is a lagging indicator (it rises after recession begins) but the 3-month moving average acceleration captures the moment when the lagging signal becomes a forward-looking one. When unemployment starts rising fast, that acceleration precedes full recession by weeks.

Importantly: the Sahm Rule has NEVER given a false positive. Every time it has triggered since 1970, a recession has followed. Conversely, there is no historical example of a recession without the Sahm Rule eventually triggering.`,
    },
    {
      id: 'hamilton-thesis-simplified',
      heading: 'Hamilton\'s Oil Shock Thesis Simplified',
      body: `Economist James Hamilton discovered that oil price shocks — specifically, large increases above the prior 3-year high — are reliably followed by recession. The mechanism is straightforward: higher energy costs reduce business profitability, consumer spending power falls, and economic activity slows.

The current test is simple: Has oil risen significantly above where it was 3 years ago? In June 2023, oil was ~$68. Today, oil is $105. That\'s a 55% increase, which Hamilton\'s research associates with roughly 8% GDP drag (over an annualized basis). If sustained for a quarter, this could be the difference between 2% growth and -1% to -2% contraction.

Critically, not all oil price increases trigger recession. The rule is specifically: increases ABOVE the prior 3-year peak. If oil goes from $100 to $110 but previously went to $120 three years ago, there\'s no new shock to worry about. But if oil goes from $40 (a 5-year low) to $105 (new multi-year high), that\'s a genuine shock to the economy.

The current situation qualifies as a major shock. We\'ve hit a multi-year high well above the prior three-year baseline. Hamilton\'s framework suggests this matters for recession risk.`,
    },
    {
      id: 'combining-signals',
      heading: 'Combining Signals: How to Think About Multiple Indicators',
      body: `No single indicator is perfect. The yield curve has missed some turning points. Credit spreads can widen for reasons other than recession (e.g., Fed tightening). Consumer sentiment can be volatile and temporary.

The power comes from combining signals. If three indicators are all pointing the same direction, recession risk is elevated. If six indicators are all showing recession warning signs, recession is likely imminent.

Currently (as of April 2026), here\'s the signal combination:
- Yield curve: Un-inverted (+0.60), historically signals recession within 2-18 months. Status: WARNING
- Sahm Rule: 0.37, approaching 0.50 trigger. Status: YELLOW ZONE
- Initial claims: 248,000, rising. Status: WARNING
- Philadelphia Fed Leading Index: -0.8, showing weakness. Status: WARNING
- Credit spreads: 420 bps, widening. Status: YELLOW ZONE
- Consumer sentiment: 77.2, down sharply. Status: WARNING

Five of six indicators are pointing toward elevated recession risk. This concentration of signals is unusual. Historical examples of this degree of signal convergence preceded 1973-74, 1980-81, 2001, 2008, and 2020 recessions.`,
    },
    {
      id: 'faq-section',
      heading: 'FAQ: Questions About Recession Indicators',
      body: `Q: Is a recession coming in 2026?
A: Based on the current confluence of six recession leading indicators, the probability of a US recession beginning within 12 months (by April 2027) is elevated. GeoWire\'s composite model estimates 62% probability. This is not certain, but it is substantially higher than the ~15% baseline probability in a normal economic expansion. See our detailed yield curve analysis and April jobs report article for deeper discussion.

Q: What are the key warning signs I should watch?
A: Monitor these three thresholds: (1) Sahm Rule crossing 0.50 (unemployment rising quickly). (2) High-yield credit spreads breaking above 550 basis points (bond market pricing in major default risk). (3) Two consecutive months of job losses in monthly employment reports. If any of these three occur, recession probability approaches 75%+.

Q: How do economists predict recessions accurately?
A: Economists don\'t predict recessions with high accuracy for timing, but they can estimate probability ranges. The six indicators discussed above are the most reliable, with historical accuracy of 70-85% when three or more are aligned. The key is monitoring leading indicators rather than waiting for GDP data, which arrives 30 days late.

Q: Why does the yield curve matter more than other indicators?
A: The yield curve is the aggregate expectation of the bond market — the market prices forward-looking interest rates based on all available information. It is, in a sense, the collective bet of trillions of dollars in capital. When the curve structure changes, it reflects a coordinated shift in the market\'s view of the future. Policymakers and economists treat it as a high-credibility signal.

Q: If indicators point toward recession, should I pull my money out of stocks?
A: This is a personal finance question beyond GeoWire\'s scope, but note that equity markets are forward-looking (they price in expected future recession before it officially occurs). Markets often begin declining 3-6 months before recession officially begins, not at the beginning or end of recession. See your financial advisor for personal portfolio guidance.

Q: What is the Fed doing to prevent recession?
A: The Fed has signaled rate cuts are likely coming (June 2026 at earliest). Rate cuts can cushion a recession\'s impact on employment but cannot prevent a recession if the underlying shocks (oil, geopolitical) are severe enough. The Fed\'s lag between signal and implementation is 6-12 weeks, so cuts arriving in June would primarily affect conditions in September and beyond, not the current quarter.`,
    },
  ],
};

// ─── Article 11: Aluminum and Steel Tariff Impact ────────────────────────────

const aluminumSteelTariff: Article = {
  slug: 'aluminum-steel-tariff-impact',
  title: 'Steel and Aluminum in 2026: The Double Moat of Tariffs and Supply Destruction',
  subtitle: 'US steel capacity utilization rose 74% to 90%. Turkey\'s rebar crisis signals wider supply tightness.',
  excerpt: 'Tariffs + supply destruction = 90% US steel utilization. LME aluminum through $3,200. Winners in metals, losers in autos and construction.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-04-01',
  updatedAt: '2026-04-01',
  readingTime: 6,
  topics: ['supply-chain', 'commodities'],
  severity: 'high',
  seoTitle: 'Steel and Aluminum Tariffs 2026: Market Structure and Impact — GeoWire',
  seoDescription: 'US steel utilization 90%, aluminum prices $3,200/tonne. Tariffs + Iran supply destruction create double moat for domestic producers.',
  sections: [
    {
      id: 'metals-market-structure',
      heading: 'The Metals Market: Pricing, Capacity, and Trade Flows',
      body: `The global steel market is approximately 1.9 billion tonnes annually, with China accounting for 54% of global production (1 billion tonnes in 2025). The US produces approximately 85-90 million tonnes, roughly 4.5% of global supply, but is a net importer of roughly 20% of domestic consumption (meaning domestic production of ~90M plus imports of ~25M covers domestic demand of ~115M).

Hot rolled coil (HRC) steel — the commodity form used in automotive, construction, and appliance manufacturing — is priced on the LME (London Metals Exchange) as well as via direct producer quotes. The LME HRC futures price in April 2026 is approximately $580/tonne, up 22% from the $475 baseline at the start of 2026. This increase reflects both tariff protection (Trump administration steel tariffs remain at 25% on non-allied imports, raised to 50% on certain countries in February) and supply destruction (Iranian steel production losses).

The aluminum market is approximately 63 million tonnes annually globally, with China producing 38% of global supply (24M tonnes). Primary aluminum (ingots used in rolling and casting for sheets, foil, and extrusions) is priced on the LME as well as via Shanghai Futures Exchange (for Asian-focused trades). The LME three-month aluminum contract is at $3,220/tonne, up from $2,480 pre-crisis (March 2026) — a 30% increase in two weeks driven by the Gulf aluminum smelter damage discussed in our Fortress Americas analysis.

US domestic aluminum and steel are protected by tariffs and upstream capacity constraints. The question is whether this protection will benefit producers without creating severe downstream cost burdens.`,
    },
    {
      id: 'us-steel-utilization',
      heading: 'US Steel Utilization Rising to 90%: Capacity Constraints Ahead',
      body: `The Federal Reserve tracks capacity utilization rates for steel. The metric measures actual production relative to maximum sustainable production capacity (accounting for maintenance and normal downtime). In December 2025, US steel utilization was 74%. By April 2026, following the tariff escalation and supply disruption, utilization has reached approximately 90%.

This rapid rise from 74% to 90% in four months is significant. Utilization above 85% is generally considered "tight," signaling that pricing power is shifting to producers and that shortage risk is real. A 90% utilization rate suggests US mills are running at near-maximum capacity and cannot easily absorb incremental demand without substantial price increases or delivery delays.

The implication: any incremental demand (e.g., from auto production or construction recovery) cannot be met by increased US domestic production. Instead, prices will rise to ration demand among available domestic supply. Simultaneously, the tariff wall prevents imports from filling the gap. This is the "double moat" effect: domestic producers face tariff protection AND a supply shortage, creating a perfect margin expansion environment.

Nucor, the largest US integrated steel producer, announced Q1 2026 EBITDA guidance of $2.8 billion, up 18% from Q1 2025 despite flat volume guidance. This margin expansion — earnings up while volumes flat — is precisely what happens in a supply-constrained tariff environment. US Steel (formerly US Steel) and Cleveland-Cliffs have issued similar guidance, indicating industry-wide margin expansion.`,
    },
    {
      id: 'century-aluminum-hawesville-restart',
      heading: 'Century Aluminum Restart: Domestic Producer Comeback',
      body: `Century Aluminum operates only one primary aluminum smelter in the US — Hawesville, Kentucky — which has been idled since 2022 due to low aluminum prices and high electricity costs. The smelter has 150,000 tonnes of annual capacity. In March 2026, Century announced it was restarting Hawesville by Q2 2026 — a decision directly attributable to the combination of tariff support and global supply disruption that has pushed LME aluminum above $3,200.

The restart requires approximately 90-120 days to bring potlines (the electrolytic cells that produce aluminum) online. Energy costs are the primary driver of the restart decision: Hawesville has access to approximately 125 MW of contracted hydroelectric power from the Tennessee Valley Authority, giving it an all-in production cost of approximately $2,150-$2,250/tonne. At current LME prices of $3,220/tonne, the margin of $950-$1,050 per tonne is highly profitable. At the 2022 price of $2,400/tonne, the margin would have been only $150-$250, insufficient to justify restart.

The global aluminum market will feel this 150,000-tonne contribution positively (increasing global supply by 0.24%), but primarily it shifts US production from import-dependent to domestic. The restart is symbolic of the broader "Fortress Americas" theme discussed in our March 30 analysis: tariffs + geopolitical supply destruction + domestic energy advantage combine to make US production competitive again.

Alcoa, the US\'s second-largest aluminum producer (but primarily an overseas operator), has benefited from price appreciation. Alcoa stock is up 124% since January 2026. Century Aluminum stock is up 167%. These share price moves reflect market recognition that the tariff + supply disruption environment is highly favorable for domestic capacity.`,
    },
    {
      id: 'downstream-impact-autos-construction',
      heading: 'Downstream Impact: Autos and Construction Face Cost Pressures',
      body: `The double moat of tariffs and supply destruction creates a cost burden for downstream users — primarily automotive manufacturers (which use both steel and aluminum heavily) and construction companies (which use steel reinforcing bar, structural shapes, and sheet).

Automotive steel and aluminum costs have risen approximately 12-18% from January to April 2026. For a midsize vehicle with approximately 800 lbs of steel and aluminum content, this represents a materials cost increase of $80-$150 per vehicle. At a vehicle price of $35,000, this is a 0.23-0.43% cost increase — not dramatic in isolation, but layered on top of rising financing costs (due to the Fed\'s 4.75% rates discussed in our April Fed decision analysis), the total vehicle price increase becomes material.

The auto industry is responding with a combination of price increases (passed to consumers) and volume declines (as demand-price elasticity works against manufacturers). April 2026 auto sales ran at 15.8M annualized units, down 8% from Q4 2025. GeoWire\'s model suggests an additional 5-8% volume decline over the subsequent two quarters if metals prices remain elevated and consumer sentiment continues declining.

Construction materials costs have risen more dramatically. Structural steel and rebar prices in the US have risen 25-30% from January 2026 levels. A 10,000-square-foot commercial building that might have budgeted $50,000 in structural steel in January 2026 now faces a $65,000 bill. For construction companies operating on 3-4% margins, this is a cost squeeze that either forces price increases (which deters customers) or margin compression.

Residential construction starts, already weak due to mortgage rate headwinds, face additional cost pressures. In April 2026, residential construction permits fell 7% month-over-month, with the decline concentrated in single-family home permits. GeoWire research suggests the combined impact of mortgage rates, labor costs, and materials costs has reduced residential construction attractiveness below the NPV threshold for many builders.`,
    },
    {
      id: 'turkey-rebar-crisis',
      heading: 'Turkey\'s Rebar Crisis: A Global Signal',
      body: `Turkey is the world\'s largest rebar (reinforced steel bar used in concrete reinforcement) exporter, shipping approximately 8 million tonnes annually to customers in the Middle East, North Africa, and South Asia. In March 2026, Turkish mills began rationing rebar allocations to customers, citing force majeure due to scrap steel supply disruption.

The cause: Turkey imports approximately 3.5 million tonnes of scrap steel annually, primarily from the US and Europe. With US tariffs limiting exports and Europe hoarding scrap for domestic mills, Turkish mill scrap supply has tightened dramatically. Turkish rebar mills cannot operate without scrap (they use electric arc furnace technology that runs on scrap feedstock rather than iron ore). The result is production constraints and a customer allocation regime.

Turkish rebar prices have spiked to $650/tonne, up 18% in four weeks. This is the highest price in five years. The allocation regime — where mills distribute available supply among customers rather than serving all demand — creates secondary markets and incentivizes hoarding among downstream users (construction companies buying ahead to secure supply).

This Turkish crisis signals that the "fortress" mentality is global: every country is pursuing protectionist trade policies and domestic supply security. In such an environment, global supply chains break down, prices rise, and inflation becomes embedded in the system. This is exactly the stagflationary scenario that 2026 recession risk models incorporate.`,
    },
    {
      id: 'winners-and-losers',
      heading: 'Winners and Losers in the Tariff-Supply Shock Environment',
      body: `Winners include: US domestic steel and aluminum producers (Nucor, US Steel, Cleveland-Cliffs, Century Aluminum, Alcoa US operations). These companies benefit from tariff protection + supply shortage + rising prices. Margins are expanding significantly.

International producers outside the tariff zone face headwinds. Nippon Steel, Baosteel, ArcelorMittal, and Alegheny Technologies all face tariff barriers to the US market and must compete in a price-volatile global market without tariff protection.

Energy-intensive producers (all aluminum smelters globally) benefit from energy price declines or hedges but are challenged by global price-driven competition. Centers with low-cost power (Norway, Iceland, Canada, Middle East) maintain advantage, but disrupted centers (UAE, Bahrain) have lost it.

Downstream losers include: US automotive manufacturers (higher input costs), construction companies (higher materials costs), appliance manufacturers (aluminum and steel intensive), and any company facing input cost pressures without pricing power.

Winners also include: scrap metal dealers and recyclers (higher scrap prices), logistics companies (higher volumes as companies hoard inventory), and commodity traders (higher trading spreads in volatile markets).

The structural outcome: tariffs and supply destruction are a regressive tax on downstream industries. The cost is paid by consumers (via higher auto prices, appliance prices, housing costs) and by downstream manufacturers (via margin compression). The benefits accrue to upstream metal producers and to the Treasury (via tariff revenue). This is a classic example of how protectionist policies create winners and losers with the net effect often being negative for overall GDP growth.`,
    },
  ],
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [fortressAmericas, heliumSemiconductor, yieldCurveUninversion, aprilJobsReport, fedRateDecision, oilPriceHistory, creditSpreadsExplained, hormuzClosure, consumerSentiment, recessionGuide, aluminumSteelTariff];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByTopic(topic: ArticleTopic): Article[] {
  return ARTICLES.filter((a) => a.topics.includes(topic));
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = ARTICLES.find((a) => a.slug === slug);
  if (!current) return ARTICLES.filter((a) => a.slug !== slug).slice(0, limit);

  const others = ARTICLES.filter((a) => a.slug !== slug);

  // Score by topic overlap, then sort by score descending, date descending
  const scored = others.map((a) => {
    const overlap = a.topics.filter((t) => current.topics.includes(t)).length;
    return { article: a, score: overlap };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.article.date).getTime() - new Date(a.article.date).getTime();
  });

  return scored.slice(0, limit).map((s) => s.article);
}
