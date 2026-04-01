/**
 * GeoWire Recession Scoring Engine
 *
 * Implements 6 models producing a composite recession probability.
 * Each function includes a JSDoc citation or explicit HEURISTIC label.
 *
 * IMPORTANT: Only coefficients explicitly listed in the spec appear in this file.
 * Threshold-based models are labeled HEURISTIC to distinguish them from
 * peer-reviewed coefficient estimates.
 */

import type { FredSeriesResult } from '../data/fred';
import { latestValue, recentValues } from '../data/fred';

// ─── Shared types ─────────────────────────────────────────────────────────────

export type SignalLevel = 'low' | 'elevated' | 'warning' | 'recession';

export interface ModelResult {
  /** Model identifier */
  model: string;
  /** Human-readable model name */
  name: string;
  /** Recession probability 0–100 */
  probability: number;
  /** Qualitative signal */
  signal: SignalLevel;
  /** Primary input value shown in UI */
  inputValue: number | null;
  /** Whether the model's threshold/rule was triggered */
  triggered: boolean;
  /** One-line status for UI */
  status: string;
  /** Source citation or HEURISTIC label */
  citation: string;
}

export interface CompositeResult {
  /** Composite score 0–100 */
  probability: number;
  /** Confidence tier based on data availability */
  confidence: 'high' | 'medium' | 'low';
  signal: SignalLevel;
  models: ModelResult[];
  /** Chauvet-Piger sanity check value (RECPROUSM156N) */
  chauvetPigerProb: number | null;
  /** Whether composite diverges >20pp from Chauvet-Piger */
  divergenceWarning: boolean;
  fetchedAt: string;
  dataSource: string;
}

// ─── Normal CDF (Abramowitz & Stegun) ─────────────────────────────────────────

/**
 * Standard normal CDF Φ(x) using the Abramowitz & Stegun rational approximation.
 *
 * Source: Abramowitz, M. & Stegun, I.A. (1972). Handbook of Mathematical Functions,
 *         formula 26.2.17. Maximum error < 7.5×10⁻⁸.
 *
 * @param x - Standard normal deviate
 * @returns P(Z ≤ x) in [0, 1]
 */
export function normalCDF(x: number): number {
  // Constants from Abramowitz & Stegun 26.2.17
  const p = 0.2316419;
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;

  const t = 1.0 / (1.0 + p * Math.abs(x));
  const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
  const pdf = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  const tail = pdf * poly;

  return x >= 0 ? 1 - tail : tail;
}

// ─── Clamp helper ─────────────────────────────────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function signalFromProb(p: number): SignalLevel {
  if (p < 25) return 'low';
  if (p < 50) return 'elevated';
  if (p < 75) return 'warning';
  return 'recession';
}

// ─── Model 1: NY Fed Probit ───────────────────────────────────────────────────

/**
 * Model 1: New York Federal Reserve Probit Model.
 *
 * Citation: Estrella, A. & Mishkin, F.S. (1998). "Predicting U.S. Recessions:
 *   Financial Variables as Leading Indicators." The Review of Economics and
 *   Statistics, 80(1), 45–61.
 *
 * Formula: P(recession in 12 months) = Φ(β₀ + β₁ × spread)
 * Coefficients: β₀ = −0.5333, β₁ = −0.6330
 * Input: Treasury 10Y–3M yield spread (T10Y3M)
 */
export function nyFedProbit(t10y3m: FredSeriesResult): ModelResult {
  const BETA_0 = -0.5333;
  const BETA_1 = -0.6330;

  const spread = latestValue(t10y3m);

  if (spread === null) {
    return {
      model: 'ny_fed_probit',
      name: 'NY Fed Probit (Estrella-Mishkin)',
      probability: 50,
      signal: 'elevated',
      inputValue: null,
      triggered: false,
      status: 'No data available',
      citation: 'Estrella & Mishkin (1998), REStat 80(1):45–61',
    };
  }

  const z = BETA_0 + BETA_1 * spread;
  const prob = clamp(normalCDF(z) * 100);

  return {
    model: 'ny_fed_probit',
    name: 'NY Fed Probit (Estrella-Mishkin)',
    probability: prob,
    signal: signalFromProb(prob),
    inputValue: spread,
    triggered: prob >= 50,
    status: `10Y–3M spread: ${spread.toFixed(2)}% → ${prob.toFixed(1)}% recession prob (12-month horizon)`,
    citation: 'Estrella & Mishkin (1998), REStat 80(1):45–61',
  };
}

// ─── Model 2: Sahm Rule ───────────────────────────────────────────────────────

/**
 * Model 2: Sahm Rule Recession Indicator.
 *
 * Citation: Sahm, C. (2019). "Direct Stimulus Payments to Individuals."
 *   Brookings Hamilton Project. The rule fires when the 3-month moving
 *   average of the national unemployment rate rises ≥ 0.50 percentage points
 *   above the prior 12-month minimum.
 *
 * Cross-validation: If the engine-computed Sahm value disagrees with
 * FRED's pre-computed SAHMCURRENT by more than 0.1pp, the FRED value is
 * preferred and a warning is logged.
 *
 * @param unrate       - UNRATE series (unemployment rate)
 * @param sahmCurrent  - SAHMCURRENT series (FRED pre-computed Sahm value)
 */
export function sahmRule(
  unrate: FredSeriesResult,
  sahmCurrent: FredSeriesResult
): ModelResult {
  const THRESHOLD = 0.5;

  // Try to get FRED's pre-computed value first for cross-validation
  const fredSahmValue = latestValue(sahmCurrent);

  // Compute from UNRATE independently
  const unrateObs = recentValues(unrate, 15); // need 12 + 3 months

  let engineSahmValue: number | null = null;
  if (unrateObs.length >= 15) {
    const last3 = unrateObs.slice(-3);
    const ma3 = last3.reduce((a, b) => a + b, 0) / 3;
    const prior12Min = Math.min(...unrateObs.slice(0, 12));
    engineSahmValue = parseFloat((ma3 - prior12Min).toFixed(2));
  }

  // Cross-validate: prefer FRED value, log discrepancy
  let sahmValue: number | null = null;
  if (fredSahmValue !== null && engineSahmValue !== null) {
    const discrepancy = Math.abs(fredSahmValue - engineSahmValue);
    if (discrepancy > 0.1) {
      console.warn(
        `[sahm] Engine computed ${engineSahmValue.toFixed(2)}, FRED SAHMCURRENT = ${fredSahmValue.toFixed(2)}. ` +
          `Discrepancy: ${discrepancy.toFixed(2)}pp. Using FRED value.`
      );
    }
    sahmValue = fredSahmValue; // prefer FRED
  } else {
    sahmValue = fredSahmValue ?? engineSahmValue;
  }

  if (sahmValue === null) {
    return {
      model: 'sahm_rule',
      name: 'Sahm Rule',
      probability: 50,
      signal: 'elevated',
      inputValue: null,
      triggered: false,
      status: 'Insufficient unemployment data',
      citation: 'Sahm (2019), Brookings Hamilton Project',
    };
  }

  const triggered = sahmValue >= THRESHOLD;
  // HEURISTIC: linear mapping from [0, 1.0] → [0%, 100%] probability
  const prob = clamp(sahmValue * 100);

  return {
    model: 'sahm_rule',
    name: 'Sahm Rule',
    probability: prob,
    signal: signalFromProb(prob),
    inputValue: sahmValue,
    triggered,
    status: triggered
      ? `TRIGGERED: Sahm value ${sahmValue.toFixed(2)}pp ≥ 0.50pp threshold`
      : `Not triggered: Sahm value ${sahmValue.toFixed(2)}pp (threshold: 0.50pp)`,
    citation: 'Sahm (2019), Brookings Hamilton Project',
  };
}

// ─── Model 3: Hamilton NOPI (Oil Shock) ───────────────────────────────────────

/**
 * Model 3: Hamilton Net Oil Price Increase (NOPI) Model.
 *
 * Citation: Hamilton, J.D. (2003). "What is an Oil Shock?"
 *   Journal of Econometrics, 113(2), 363–398.
 *
 * Rule: An oil shock occurs when the current WTI price exceeds the maximum
 * price of the prior 36 months. The magnitude determines shock severity.
 *
 * HEURISTIC: The probability mapping from shock magnitude to recession
 * probability (below) is an approximation based on historical recession
 * episodes following oil shocks. No single regression coefficient is
 * published for this mapping in Hamilton (2003).
 *
 * @param wtiOil - DCOILWTICO series (WTI crude oil price)
 */
export function hamiltonNOPI(wtiOil: FredSeriesResult): ModelResult {
  // Need at least 37 observations: 36 for window + 1 current
  const obs = recentValues(wtiOil, 37);
  const current = latestValue(wtiOil);

  if (current === null || obs.length < 2) {
    return {
      model: 'hamilton_nopi',
      name: 'Hamilton NOPI (Oil Shock)',
      probability: 20,
      signal: 'low',
      inputValue: null,
      triggered: false,
      status: 'Insufficient oil price history',
      citation: 'Hamilton (2003), J. Econometrics 113(2):363–398',
    };
  }

  // Prior 36-month maximum (exclude current observation)
  const priorWindow = obs.slice(0, -1);
  const prior36Max = Math.max(...priorWindow);

  const shockExists = current > prior36Max;

  let prob: number;
  let signal: SignalLevel;
  let status: string;

  if (!shockExists) {
    // HEURISTIC: baseline oil-related recession risk when no shock present
    prob = 10;
    signal = 'low';
    status = `No oil shock: WTI $${current.toFixed(2)} below 36-month high of $${prior36Max.toFixed(2)}`;
  } else {
    const shockMagnitude = ((current - prior36Max) / prior36Max) * 100;
    // HEURISTIC: probability mapping from shock magnitude
    // Based on historical observation of Hamilton-defined oil shocks
    // preceding recessions in 1973, 1979, 1990, 2008
    if (shockMagnitude < 10) {
      prob = 30;
    } else if (shockMagnitude < 25) {
      prob = 55;
    } else if (shockMagnitude < 50) {
      prob = 70;
    } else {
      prob = 85;
    }
    signal = signalFromProb(prob);
    status = `Oil shock detected: WTI $${current.toFixed(2)} (+${shockMagnitude.toFixed(1)}% above 36-month high of $${prior36Max.toFixed(2)})`;
  }

  return {
    model: 'hamilton_nopi',
    name: 'Hamilton NOPI (Oil Shock)',
    probability: clamp(prob),
    signal,
    inputValue: current,
    triggered: shockExists,
    status,
    citation: 'Hamilton (2003), J. Econometrics 113(2):363–398 [HEURISTIC probability mapping]',
  };
}

// ─── Model 4: Philadelphia Fed Leading Index ─────────────────────────────────

/**
 * Model 4: Philadelphia Fed Leading Index Signal.
 *
 * FRED series: USSLIND — Philadelphia Fed Leading Index for the United States.
 * NOTE: This is NOT the Conference Board LEI. The Conference Board LEI is
 * proprietary and not available on FRED. USSLIND is the Philadelphia Fed's
 * state-level leading index aggregated nationally.
 *
 * HEURISTIC: The warning (−2.0%) and recession (−4.4%) thresholds are
 * adapted from Conference Board methodology applied to this different index.
 * These thresholds are approximate and should be treated as indicative,
 * not as published Philadelphia Fed recession signals.
 *
 * @param usslind - USSLIND series (Philadelphia Fed Leading Index)
 */
export function phillyFedLeadingIndex(usslind: FredSeriesResult): ModelResult {
  const WARNING_THRESHOLD = -2.0;
  const RECESSION_THRESHOLD = -4.4;

  const value = latestValue(usslind);

  if (value === null) {
    return {
      model: 'philly_fed_leading',
      name: 'Philadelphia Fed Leading Index',
      probability: 30,
      signal: 'elevated',
      inputValue: null,
      triggered: false,
      status: 'No Philadelphia Fed Leading Index data available',
      citation: 'USSLIND (Philadelphia Fed Leading Index) — NOT Conference Board LEI [HEURISTIC thresholds]',
    };
  }

  // The USSLIND series provides an annualized 6-month growth rate directly
  let prob: number;
  let signal: SignalLevel;
  let triggered: boolean;
  let status: string;

  if (value >= 0) {
    prob = 10;
    signal = 'low';
    triggered = false;
    status = `Positive trend: +${value.toFixed(2)}% (6-month annualized)`;
  } else if (value >= WARNING_THRESHOLD) {
    prob = 25;
    signal = 'low';
    triggered = false;
    status = `Weak growth: ${value.toFixed(2)}% (watch level: ${WARNING_THRESHOLD}%)`;
  } else if (value >= RECESSION_THRESHOLD) {
    prob = 55;
    signal = 'warning';
    triggered = true;
    status = `WARNING: ${value.toFixed(2)}% below warning threshold of ${WARNING_THRESHOLD}%`;
  } else {
    prob = 80;
    signal = 'recession';
    triggered = true;
    status = `RECESSION SIGNAL: ${value.toFixed(2)}% below recession threshold of ${RECESSION_THRESHOLD}%`;
  }

  return {
    model: 'philly_fed_leading',
    name: 'Philadelphia Fed Leading Index (USSLIND)',
    probability: clamp(prob),
    signal,
    inputValue: value,
    triggered,
    status,
    citation: 'USSLIND (Philadelphia Fed, NOT Conference Board LEI) [HEURISTIC thresholds adapted from CB methodology]',
  };
}

// ─── Model 5: Credit Spread Signal ───────────────────────────────────────────

/**
 * Model 5: ICE BofA High Yield Credit Spread Signal.
 *
 * HEURISTIC: Threshold levels are based on historical observation of
 * ICE BofA US High Yield Option-Adjusted Spread (BAMLH0A0HYM2) behavior
 * around US recessions. No single published paper defines these exact levels;
 * they represent practitioner consensus on spread regimes.
 *
 * Thresholds (percent):
 *   Normal:    < 4.0%
 *   Elevated:  4.0 – 5.5%
 *   Warning:   5.5 – 7.0%
 *   Recession: > 7.0%
 *
 * @param hySpread - BAMLH0A0HYM2 series (ICE BofA HY OAS)
 */
export function creditSpreadSignal(hySpread: FredSeriesResult): ModelResult {
  const ELEVATED_THRESHOLD = 4.0;
  const WARNING_THRESHOLD = 5.5;
  const RECESSION_THRESHOLD = 7.0;

  const spread = latestValue(hySpread);

  if (spread === null) {
    return {
      model: 'credit_spread',
      name: 'Credit Spread (ICE BofA HY)',
      probability: 30,
      signal: 'elevated',
      inputValue: null,
      triggered: false,
      status: 'No high yield spread data available',
      citation: 'BAMLH0A0HYM2 (ICE BofA HY OAS) [HEURISTIC thresholds from historical observation]',
    };
  }

  let prob: number;
  let signal: SignalLevel;
  let triggered: boolean;
  let status: string;

  if (spread < ELEVATED_THRESHOLD) {
    prob = 10;
    signal = 'low';
    triggered = false;
    status = `Normal credit conditions: HY spread ${spread.toFixed(2)}% (normal: <${ELEVATED_THRESHOLD}%)`;
  } else if (spread < WARNING_THRESHOLD) {
    prob = 35;
    signal = 'elevated';
    triggered = false;
    status = `Elevated credit stress: HY spread ${spread.toFixed(2)}% (elevated: ${ELEVATED_THRESHOLD}–${WARNING_THRESHOLD}%)`;
  } else if (spread < RECESSION_THRESHOLD) {
    prob = 65;
    signal = 'warning';
    triggered = true;
    status = `WARNING: HY spread ${spread.toFixed(2)}% (warning zone: ${WARNING_THRESHOLD}–${RECESSION_THRESHOLD}%)`;
  } else {
    prob = 88;
    signal = 'recession';
    triggered = true;
    status = `RECESSION SIGNAL: HY spread ${spread.toFixed(2)}% above ${RECESSION_THRESHOLD}% recession threshold`;
  }

  return {
    model: 'credit_spread',
    name: 'Credit Spread (ICE BofA HY)',
    probability: clamp(prob),
    signal,
    inputValue: spread,
    triggered,
    status,
    citation: 'BAMLH0A0HYM2 (ICE BofA HY OAS) [HEURISTIC thresholds from historical observation]',
  };
}

// ─── Model 6: Composite GeoWire Score ────────────────────────────────────────

/**
 * Model 6: Composite GeoWire Recession Score.
 *
 * HEURISTIC: Weights and geo-risk adjustment are GeoWire's proprietary
 * combination of the above models. No single academic paper defines this
 * exact weighting scheme.
 *
 * Weights:
 *   NY Fed Probit:            25%
 *   Sahm Rule:                20%
 *   Hamilton NOPI:            15%
 *   Philadelphia Fed Leading: 15%
 *   Credit Spread:            15%
 *   Geo-Risk (placeholder):   10%
 *
 * Geo-risk is hardcoded at 0.6 (60 on 0–100 scale) pending Session 7B
 * (Claude AI integration for geopolitical risk scoring).
 *
 * Sanity check: composite is compared against RECPROUSM156N (Chauvet-Piger).
 * Divergence > 20pp triggers a console warning.
 */
export function compositeScore(models: ModelResult[]): number {
  const WEIGHTS: Record<string, number> = {
    ny_fed_probit: 0.25,
    sahm_rule: 0.20,
    hamilton_nopi: 0.15,
    philly_fed_leading: 0.15,
    credit_spread: 0.15,
  };
  const GEO_RISK_WEIGHT = 0.10;
  const GEO_RISK_PLACEHOLDER = 60; // 0–100 scale; hardcoded until Session 7B

  let weighted = 0;
  let totalWeight = 0;

  for (const model of models) {
    const w = WEIGHTS[model.model];
    if (w !== undefined) {
      weighted += model.probability * w;
      totalWeight += w;
    }
  }

  // Add geo-risk component
  weighted += GEO_RISK_PLACEHOLDER * GEO_RISK_WEIGHT;
  totalWeight += GEO_RISK_WEIGHT;

  // Normalize in case any model was missing
  const normalized = totalWeight > 0 ? weighted / totalWeight : 50;

  return clamp(Math.round(normalized * 10) / 10);
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Run the full GeoWire scoring pipeline against a set of FRED series results.
 *
 * @param series     - Map of FRED series results keyed by series ID
 * @param fetchedAt  - ISO timestamp of when data was fetched
 * @param dataSource - 'live' | 'cached' | 'seed'
 */
export function runScoringEngine(
  series: Record<string, { observations: Array<{ date: string; value: number | null }>; label: string; unit: string; frequency: string; dataSource: string; fetchedAt: string }>,
  fetchedAt: string,
  dataSource: string
): CompositeResult {
  // Build typed results (cast to FredSeriesResult — same shape)
  const get = (id: string) => series[id] as FredSeriesResult;

  // Run individual models
  const model1 = nyFedProbit(get('T10Y3M'));
  const model2 = sahmRule(get('UNRATE'), get('SAHMCURRENT'));
  const model3 = hamiltonNOPI(get('DCOILWTICO'));
  const model4 = phillyFedLeadingIndex(get('USSLIND'));
  const model5 = creditSpreadSignal(get('BAMLH0A0HYM2'));

  const models = [model1, model2, model3, model4, model5];

  // Compute composite
  const prob = compositeScore(models);

  // Sanity check against Chauvet-Piger (RECPROUSM156N)
  const cpSeries = get('RECPROUSM156N');
  const cpProb = cpSeries ? latestValue(cpSeries) : null;
  const divergenceWarning = cpProb !== null && Math.abs(prob - cpProb) > 20;

  if (divergenceWarning) {
    console.warn(
      `[scoring] Composite score ${prob.toFixed(1)} diverges from Chauvet-Piger ` +
        `${cpProb!.toFixed(1)} by ${Math.abs(prob - cpProb!).toFixed(1)}pp — investigate inputs.`
    );
  }

  // Confidence: based on data availability
  const missingModels = models.filter((m) => m.inputValue === null).length;
  const confidence: 'high' | 'medium' | 'low' =
    missingModels === 0 ? 'high' : missingModels <= 2 ? 'medium' : 'low';

  // Build composite model result
  const compositeModel: ModelResult = {
    model: 'composite',
    name: 'GeoWire Composite Score',
    probability: prob,
    signal: signalFromProb(prob),
    inputValue: prob,
    triggered: prob >= 50,
    status: `Composite: ${prob.toFixed(1)}% (NY Fed 25% + Sahm 20% + Hamilton 15% + PhillyFed 15% + Credit 15% + Geo 10%)`,
    citation: 'GeoWire composite [HEURISTIC weights; geo-risk placeholder 60/100 pending AI integration]',
  };

  return {
    probability: prob,
    confidence,
    signal: signalFromProb(prob),
    models: [...models, compositeModel],
    chauvetPigerProb: cpProb,
    divergenceWarning,
    fetchedAt,
    dataSource,
  };
}
