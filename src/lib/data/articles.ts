/**
 * GeoWire Analysis Articles — seed data
 *
 * Each article is a structured object with metadata and content sections.
 * Content sections drive both the rendered article and the auto-generated TOC.
 */

export type ArticleTopic = 'recession-risk' | 'energy' | 'supply-chain';
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
  readingTime: number; // minutes
  topics: ArticleTopic[];
  severity: ArticleSeverity;
  heroImage?: string;
  sections: ArticleSection[];
}

// ─── Article 1: Strait of Hormuz ─────────────────────────────────────────────

const straitOfHormuz: Article = {
  slug: 'strait-of-hormuz-recession',
  title: 'How the Strait of Hormuz Crisis Feeds a Global Recession',
  subtitle: 'Tracing the elasticity chain from crude oil to GDP contraction',
  excerpt:
    'A near-total shutdown of the world\'s most critical oil chokepoint has set off a cascade of price shocks. We trace the transmission from crude to consumer prices using measured elasticity coefficients.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-03-28',
  readingTime: 6,
  topics: ['energy', 'recession-risk'],
  severity: 'high',
  sections: [
    {
      id: 'the-chokepoint',
      heading: 'The Chokepoint That Moves 21 Million Barrels a Day',
      body: `The Strait of Hormuz is a 21-mile-wide passage between Iran and Oman through which roughly 21 million barrels of crude oil transit daily — approximately 20% of global supply. When Iran effectively closed the strait in late February 2026, the immediate result was a supply shock without modern precedent. Within 48 hours, Brent crude surged past $112 per barrel from a pre-crisis level of $68.

What makes this crisis different from previous oil shocks is the combination of magnitude and duration. The 1973 Arab oil embargo reduced global supply by roughly 7%. The current Hormuz closure has removed nearly 20% of seaborne oil from the market. Lloyd's of London suspended war-risk insurance coverage for Hormuz transit on March 1, effectively making the closure total even for vessels willing to risk passage.`,
    },
    {
      id: 'elasticity-chain',
      heading: 'The Elasticity Chain: From Crude to Consumer',
      body: `The economic damage from an oil shock does not stay contained to energy markets. It cascades through the economy via a measurable chain of price elasticities — coefficients that quantify how a price change in one commodity transmits to another.

The oil-to-gasoline elasticity is 1.12, meaning a 10% increase in crude oil prices produces an 11.2% increase in gasoline prices. This slightly greater-than-one elasticity reflects the refining margin expansion that occurs during supply crunches, as refiners pass through costs plus additional margin.

The oil-to-diesel elasticity is 1.08. Diesel is the fuel of commerce — it powers trucks, trains, and shipping vessels. When diesel prices rise, the cost of moving every physical good in the economy increases. The current $112/bbl Brent price has pushed US average diesel to $5.18/gallon, up 38% from pre-crisis levels.

The shipping-to-food elasticity is 0.38. This means a 10% increase in shipping costs produces a 3.8% increase in food prices. With container shipping rerouting via the Cape of Good Hope — adding 14 days and roughly $800,000 per voyage — food price inflation is baked in with a 3-6 month lag.

The energy-to-CPI elasticity is 0.21. For every 10% increase in energy costs, the Consumer Price Index rises by 2.1%. With energy costs up roughly 45% across the board, the implied CPI impact is approximately 9.5 percentage points of additional inflation pressure — on top of whatever baseline inflation existed before the crisis.`,
    },
    {
      id: 'gdp-transmission',
      heading: 'GDP Transmission: The -0.15 Coefficient',
      body: `The oil-to-GDP elasticity is -0.15, derived from Hamilton's (2003) analysis of oil price shocks and economic output. A 10% increase in oil prices reduces GDP by approximately 1.5%. With Brent crude up roughly 65% from pre-crisis levels, the implied GDP drag is approximately 9.75% on an annualized basis — though the actual impact depends on duration and the degree to which alternative supply routes come online.

The Federal Reserve is caught in an impossible position. War-induced supply inflation cannot be addressed with rate cuts, which would further stoke price pressures. But leaving rates elevated while GDP contracts risks deepening a recession. The March 23 emergency meeting of Fed governors acknowledged this dilemma publicly for the first time.`,
    },
    {
      id: 'cape-diversion',
      heading: 'The Cape of Good Hope Diversion',
      body: `With Hormuz closed, oil tankers must reroute around the southern tip of Africa. This adds approximately 3,500 nautical miles and 14 days to the Asia-Europe route. The additional transit time is itself a supply constraint — tankers that could previously make 20 round-trips per year can now make only 15, effectively reducing the global tanker fleet's carrying capacity by 25%.

Saudi Arabia and UAE have begun diverting approximately 3 million barrels per day through this route, but the infrastructure was never designed for this volume. Port congestion at the Cape has already added 2-3 days beyond the baseline diversion time.`,
    },
    {
      id: 'recession-probability',
      heading: 'What This Means for Recession Probability',
      body: `GeoWire's composite recession model currently estimates a 20.4% probability of US recession within 12 months. This figure would be significantly higher — likely above 40% — if the Hormuz closure persists beyond 90 days. The key variable is duration: historical analysis shows that oil price shocks lasting less than one quarter typically produce slowdowns rather than recessions, while shocks lasting two or more quarters have preceded every recession since 1973.

The Sahm Rule indicator has already risen to 0.37 — approaching the 0.50 threshold that has correctly identified every recession since 1970. The NY Fed probit model, which uses the yield curve spread, estimates an 18% probability — but this model historically lags supply-side shocks by 2-3 months.

Markets are not yet pricing a recession as the base case. The spread between GeoWire's model and consensus estimates (Goldman Sachs at 28%) reflects the market's implicit assumption that a ceasefire will reopen Hormuz within 60 days. If that assumption proves wrong, the repricing will be abrupt.`,
    },
  ],
};

// ─── Article 2: Helium Semiconductor Shortage ────────────────────────────────

const heliumSemiconductor: Article = {
  slug: 'helium-semiconductor-shortage',
  title: 'The Helium Shortage Nobody\'s Talking About',
  subtitle: 'How a noble gas crisis threatens the global semiconductor supply chain',
  excerpt:
    'While the world focuses on oil, a parallel crisis is unfolding in helium markets — with direct implications for semiconductor manufacturing, MRI machines, and quantum computing research.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-03-25',
  readingTime: 5,
  topics: ['supply-chain'],
  severity: 'medium',
  sections: [
    {
      id: 'invisible-crisis',
      heading: 'The Invisible Crisis in Noble Gas Markets',
      body: `Helium is the second most abundant element in the universe but one of the scarcest on Earth. Unlike other industrial gases, helium cannot be synthesized — it must be extracted from natural gas deposits where it exists in trace concentrations, typically 0.1% to 0.5% by volume. Once released into the atmosphere, it escapes Earth's gravity permanently. Every liter of helium we waste is gone forever.

Global helium production is concentrated in a remarkably small number of facilities. The United States produces approximately 40% of the world's helium, primarily from the Federal Helium Reserve in Amarillo, Texas and from natural gas processing plants in Wyoming and Kansas. Qatar produces roughly 25% through its massive LNG operations at Ras Laffan. Algeria contributes about 12%, Russia 8%, and Australia has been ramping up to approximately 6%.

The Hormuz crisis has effectively taken Qatar's 25% share offline. The Ras Laffan facility, which produces helium as a byproduct of LNG processing, routes its exports through the Strait of Hormuz. With the strait closed and Lloyd's of London suspending war-risk coverage, no helium tankers are transiting.`,
    },
    {
      id: 'semiconductor-dependency',
      heading: 'Why Semiconductors Cannot Function Without Helium',
      body: `Helium's unique physical properties make it irreplaceable in semiconductor fabrication. With a boiling point of -269°C — just 4 degrees above absolute zero — liquid helium is used as a coolant in the cryogenic systems that operate extreme ultraviolet (EUV) lithography machines. ASML's latest EUV systems, which produce every advanced chip below 7nm, consume approximately 100,000 liters of helium per year per machine.

Beyond cooling, helium serves as a carrier gas in chemical vapor deposition (CVD) processes, where thin films are deposited onto silicon wafers. Its chemical inertness means it does not react with the exotic materials being deposited, while its small atomic radius allows it to purge reaction chambers more effectively than any substitute. Attempts to use hydrogen (the only smaller atom) introduce explosion risks in fab environments.

The semiconductor industry consumes approximately 15% of global helium production. TSMC, Samsung, and Intel collectively operate over 200 EUV lithography systems worldwide. A sustained helium shortage would not immediately halt production — fabs maintain 30-60 day reserves — but would force a reduction in output that cascades through the entire electronics supply chain.`,
    },
    {
      id: 'beyond-chips',
      heading: 'Beyond Chips: Medical and Research Impact',
      body: `Semiconductors are not the only helium-dependent industry facing disruption. Medical MRI machines use superconducting magnets cooled by liquid helium. The approximately 50,000 MRI machines installed worldwide each require periodic helium refills — and a shortage means hospitals must ration diagnostic imaging.

Quantum computing research, which relies on dilution refrigerators operating at temperatures below 15 millikelvin, is entirely dependent on helium-3, an even rarer isotope. NASA, CERN, and every major quantum computing lab from IBM to Google uses helium-3 for their systems. Current global helium-3 production is approximately 15,000 liters per year, mostly derived from tritium decay in nuclear weapons maintenance — a supply chain with zero elasticity.

Space launch operations also depend on helium for pressurizing fuel tanks and purging propellant lines. SpaceX, ULA, and Arianespace all use helium in launch operations. A sustained shortage could delay satellite deployments and resupply missions.`,
    },
    {
      id: 'strategic-reserve',
      heading: 'The Strategic Reserve Problem',
      body: `The US Federal Helium Reserve, once the world's backstop supply, has been in managed drawdown since 1996 under the Helium Privatization Act. The reserve, stored in a porous rock formation near Amarillo, Texas, once held over 1 billion cubic meters. As of early 2026, it contained approximately 80 million cubic meters — enough to supply US demand for roughly 18 months, but not designed to compensate for a 25% global supply loss.

The Bureau of Land Management, which manages the reserve, has not yet announced emergency release protocols. Unlike the Strategic Petroleum Reserve, which has established drawdown mechanisms, the helium reserve lacks a crisis playbook. This bureaucratic gap could delay response by weeks even after a shortage becomes acute.`,
    },
    {
      id: 'market-outlook',
      heading: 'Market Outlook and Supply Chain Implications',
      body: `Helium prices have already risen 35% since the Hormuz closure, from approximately $8 per liter to $10.80. Industry analysts project prices could reach $15-18 per liter if the closure persists beyond 60 days — a level that would force some semiconductor fabs to reduce EUV utilization rates.

The downstream effects would appear with a 60-90 day lag. Consumer electronics — smartphones, laptops, automotive chips — would see supply constraints by mid-2026 if the crisis continues. Auto manufacturers, already scarred by the 2021-2022 chip shortage, have begun building buffer inventories, further straining available supply.

Australia's Darwin LNG facility and a new plant in Siberia could partially offset Qatar's lost production, but neither will reach full capacity before late 2027. In the near term, there is no substitute for Qatar's helium output. The world's semiconductor supply chain is, for the moment, hostage to a 21-mile-wide strait.`,
    },
  ],
};

// ─── Article 3: Yield Curve 2026 ─────────────────────────────────────────────

const yieldCurve2026: Article = {
  slug: 'yield-curve-2026',
  title: 'Reading the Yield Curve: What 2026\'s Inversion Tells Us',
  subtitle: 'Inside the NY Fed probit model and what the current T10Y3M spread signals',
  excerpt:
    'The yield curve has predicted every US recession since 1955. We examine the Estrella-Mishkin model behind the NY Fed\'s probability estimates and what today\'s spread implies for the next 12 months.',
  author: 'GeoWire Intelligence Desk',
  date: '2026-03-22',
  readingTime: 7,
  topics: ['recession-risk'],
  severity: 'elevated',
  sections: [
    {
      id: 'the-signal',
      heading: 'The Most Reliable Signal in Macroeconomics',
      body: `Since 1955, every US recession has been preceded by an inversion of the yield curve — a condition where short-term Treasury yields exceed long-term yields. The track record is remarkable: seven correct signals in seven recessions, with only two brief false positives (1966 and 1998) that produced slowdowns rather than technical recessions.

The yield curve works as a recession predictor because it reflects the collective judgment of the bond market about future economic conditions. When investors expect growth to slow, they buy long-term bonds for safety, pushing long-term yields down. When the Fed raises short-term rates to fight inflation, short-term yields rise. The resulting inversion is the bond market's way of saying: "The Fed is tightening into a weakening economy."

The spread most commonly watched is the 10-year minus 3-month Treasury spread (T10Y3M), which the NY Fed uses in its official recession probability model. As of late March 2026, this spread stands at approximately -0.45%, having been negative since mid-2025.`,
    },
    {
      id: 'estrella-mishkin',
      heading: 'The Estrella-Mishkin Probit Model',
      body: `The NY Fed's recession probability model was developed by Arturo Estrella and Frederic Mishkin in their 1998 paper "Predicting U.S. Recessions: Financial Variables as Leading Indicators." The model uses a probit regression — a statistical technique that estimates the probability of a binary outcome (recession or no recession) based on a continuous input (the yield spread).

The model's specification is elegant in its simplicity. It takes a single input — the T10Y3M spread — and produces a probability using two coefficients: β₀ = -0.5333 (the intercept) and β₁ = -0.6330 (the slope on the spread). The probability is computed as Φ(β₀ + β₁ × spread), where Φ is the standard normal cumulative distribution function.

At the current T10Y3M spread of approximately -0.45%, the model outputs a recession probability of roughly 18%. This may seem surprisingly low given the geopolitical crisis, but the model is designed to capture the yield curve's signal about credit conditions and monetary policy — not supply-side shocks. The probit model is a monetary policy thermometer; it does not measure geopolitical fevers.`,
    },
    {
      id: 'historical-timing',
      heading: 'Historical Timing: Inversion to Recession',
      body: `One of the most important features of the yield curve signal is its lead time. Historically, the gap between initial inversion and recession onset has ranged from 6 to 24 months, with a median of approximately 14 months.

The 2006-2007 inversion preceded the Great Recession by 23 months — long enough that many commentators had dismissed the signal as a false positive before the recession began. The 2019 inversion preceded the 2020 recession by roughly 8 months, though the proximate cause was the COVID pandemic rather than the credit cycle the curve was measuring.

The current inversion began in approximately September 2025, placing us roughly 6 months into the inversion window. If the historical median holds, the recession risk window peaks around November 2026 — but the Hormuz crisis could accelerate the timeline significantly.

An important nuance: the yield curve often un-inverts (returns to positive slope) shortly before the recession actually begins. This un-inversion occurs because the Fed begins cutting rates in response to deteriorating conditions. The un-inversion is not an "all clear" — it is typically the final warning.`,
    },
    {
      id: 'limitations',
      heading: 'What the Yield Curve Cannot Tell Us',
      body: `For all its predictive power, the yield curve has significant blind spots. It measures expectations about monetary policy and credit conditions, not external shocks. The 1973 oil embargo, which triggered a severe recession, was not predicted by the yield curve — the inversion followed rather than preceded the shock.

The current situation presents a similar challenge. The Hormuz crisis is a supply-side shock that operates through a different transmission mechanism than the monetary tightening cycles the yield curve is designed to detect. The 18% probability from the Estrella-Mishkin model likely understates the true recession risk because the model's training data does not include scenarios where a geopolitical event removes 20% of global oil supply.

This is why GeoWire's composite model incorporates five additional indicators beyond the yield curve: the Sahm Rule (labor market deterioration), Hamilton's NOPI model (oil shock detection), the Philadelphia Fed Leading Index, the credit spread, and a geopolitical risk adjustment. The composite probability of 20.4% is higher than the yield curve alone would suggest, and could rise significantly if the crisis persists.`,
    },
    {
      id: 'what-to-watch',
      heading: 'What to Watch: Key Thresholds Ahead',
      body: `Several yield curve signals bear watching in the weeks ahead. First, the slope of the un-inversion: if the T10Y3M spread begins moving toward zero rapidly, it could signal that the Fed is preparing emergency rate action — historically a bearish signal despite the intuitive appeal of "normalization."

Second, the 10-year minus 2-year spread (T10Y2Y), which has been negative since mid-2025, is approaching the -0.50% level that has preceded the last three recessions with a 100% hit rate. A sustained move below -0.50% would push the NY Fed model's implied probability above 25%.

Third, credit spreads — specifically the ICE BofA High Yield spread — are widening. When this spread exceeds 500 basis points, it has historically coincided with or preceded recession in 85% of cases. The current spread is approximately 420 basis points, elevated but not yet at crisis levels.

The yield curve is not a crystal ball. It is a barometer — one that has proven remarkably reliable over seven decades. Its current reading is cautionary but not yet alarming in isolation. Combined with the oil shock transmission and labor market signals, however, the overall picture warrants significantly more concern than any single indicator suggests alone.`,
    },
  ],
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [straitOfHormuz, heliumSemiconductor, yieldCurve2026];

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
