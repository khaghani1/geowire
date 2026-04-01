/**
 * Seed data for GeoWire recession indicators.
 * Used as fallback when FRED API is unavailable.
 * Values are sourced from publicly available FRED data as of early 2025.
 *
 * _note field records the approximate data vintage for transparency.
 */

export interface FredObservation {
  date: string;
  value: number | null;
}

export interface SeedSeries {
  seriesId: string;
  label: string;
  unit: string;
  frequency: string;
  observations: FredObservation[];
  _note: string;
}

/**
 * Seed data keyed by FRED series ID.
 * Each array is ordered oldest → newest (last element = most recent).
 */
export const SEED_DATA: Record<string, SeedSeries> = {
  T10Y2Y: {
    seriesId: 'T10Y2Y',
    label: 'Treasury 10Y-2Y Yield Spread',
    unit: 'Percent',
    frequency: 'Daily',
    observations: [
      { date: '2024-01-02', value: -0.33 },
      { date: '2024-04-01', value: -0.37 },
      { date: '2024-07-01', value: -0.29 },
      { date: '2024-10-01', value: 0.01 },
      { date: '2024-11-01', value: 0.05 },
      { date: '2024-12-01', value: 0.22 },
      { date: '2025-01-01', value: 0.30 },
    ],
    _note: 'Seed vintage: 2025-01. Positive values indicate normal curve.',
  },
  T10Y3M: {
    seriesId: 'T10Y3M',
    label: 'Treasury 10Y-3M Yield Spread',
    unit: 'Percent',
    frequency: 'Daily',
    observations: [
      { date: '2024-01-02', value: -1.34 },
      { date: '2024-04-01', value: -1.14 },
      { date: '2024-07-01', value: -1.33 },
      { date: '2024-10-01', value: -0.56 },
      { date: '2024-11-01', value: -0.29 },
      { date: '2024-12-01', value: -0.17 },
      { date: '2025-01-01', value: -0.09 },
    ],
    _note: 'Seed vintage: 2025-01. Used in NY Fed Probit model (Estrella & Mishkin 1998).',
  },
  T10YFF: {
    seriesId: 'T10YFF',
    label: 'Treasury 10Y minus Fed Funds Rate',
    unit: 'Percent',
    frequency: 'Daily',
    observations: [
      { date: '2024-01-02', value: -2.03 },
      { date: '2024-04-01', value: -1.88 },
      { date: '2024-07-01', value: -1.77 },
      { date: '2024-10-01', value: -0.85 },
      { date: '2024-11-01', value: -0.45 },
      { date: '2024-12-01', value: -0.30 },
      { date: '2025-01-01', value: -0.24 },
    ],
    _note: 'Seed vintage: 2025-01.',
  },
  UNRATE: {
    seriesId: 'UNRATE',
    label: 'Unemployment Rate',
    unit: 'Percent',
    frequency: 'Monthly',
    observations: [
      { date: '2024-01-01', value: 3.7 },
      { date: '2024-02-01', value: 3.9 },
      { date: '2024-03-01', value: 3.8 },
      { date: '2024-04-01', value: 3.9 },
      { date: '2024-05-01', value: 4.0 },
      { date: '2024-06-01', value: 4.1 },
      { date: '2024-07-01', value: 4.3 },
      { date: '2024-08-01', value: 4.2 },
      { date: '2024-09-01', value: 4.1 },
      { date: '2024-10-01', value: 4.1 },
      { date: '2024-11-01', value: 4.2 },
      { date: '2024-12-01', value: 4.2 },
    ],
    _note: 'Seed vintage: 2025-01. Used in Sahm Rule calculation.',
  },
  ICSA: {
    seriesId: 'ICSA',
    label: 'Initial Jobless Claims',
    unit: 'Number',
    frequency: 'Weekly',
    observations: [
      { date: '2024-10-05', value: 228000 },
      { date: '2024-10-12', value: 242000 },
      { date: '2024-10-19', value: 227000 },
      { date: '2024-10-26', value: 216000 },
      { date: '2024-11-02', value: 221000 },
      { date: '2024-11-09', value: 218000 },
      { date: '2024-11-16', value: 213000 },
      { date: '2024-11-23', value: 225000 },
      { date: '2024-11-30', value: 224000 },
      { date: '2024-12-07', value: 242000 },
      { date: '2024-12-14', value: 220000 },
      { date: '2024-12-21', value: 219000 },
      { date: '2024-12-28', value: 211000 },
      { date: '2025-01-04', value: 201000 },
    ],
    _note: 'Seed vintage: 2025-01.',
  },
  SAHMCURRENT: {
    seriesId: 'SAHMCURRENT',
    label: 'Sahm Rule Recession Indicator (FRED pre-computed)',
    unit: 'Percentage Points',
    frequency: 'Monthly',
    observations: [
      { date: '2024-01-01', value: 0.0 },
      { date: '2024-02-01', value: 0.13 },
      { date: '2024-03-01', value: 0.03 },
      { date: '2024-04-01', value: 0.13 },
      { date: '2024-05-01', value: 0.27 },
      { date: '2024-06-01', value: 0.43 },
      { date: '2024-07-01', value: 0.53 },
      { date: '2024-08-01', value: 0.57 },
      { date: '2024-09-01', value: 0.43 },
      { date: '2024-10-01', value: 0.40 },
      { date: '2024-11-01', value: 0.43 },
      { date: '2024-12-01', value: 0.43 },
    ],
    _note: 'Seed vintage: 2025-01. FRED pre-computed Sahm rule value. Cross-validate engine output against this.',
  },
  UMCSENT: {
    seriesId: 'UMCSENT',
    label: 'University of Michigan Consumer Sentiment',
    unit: 'Index 1966:Q1=100',
    frequency: 'Monthly',
    observations: [
      { date: '2024-01-01', value: 79.0 },
      { date: '2024-02-01', value: 76.9 },
      { date: '2024-03-01', value: 79.4 },
      { date: '2024-04-01', value: 77.2 },
      { date: '2024-05-01', value: 69.1 },
      { date: '2024-06-01', value: 68.2 },
      { date: '2024-07-01', value: 66.4 },
      { date: '2024-08-01', value: 67.9 },
      { date: '2024-09-01', value: 70.1 },
      { date: '2024-10-01', value: 70.5 },
      { date: '2024-11-01', value: 71.8 },
      { date: '2024-12-01', value: 74.0 },
    ],
    _note: 'Seed vintage: 2025-01.',
  },
  USSLIND: {
    seriesId: 'USSLIND',
    label: 'Philadelphia Fed Leading Index (US)',
    unit: 'Percent Change (annualized, 6-month)',
    frequency: 'Monthly',
    observations: [
      { date: '2024-01-01', value: 0.38 },
      { date: '2024-02-01', value: 0.37 },
      { date: '2024-03-01', value: 0.21 },
      { date: '2024-04-01', value: 0.22 },
      { date: '2024-05-01', value: 0.32 },
      { date: '2024-06-01', value: 0.35 },
      { date: '2024-07-01', value: 0.40 },
      { date: '2024-08-01', value: 0.43 },
      { date: '2024-09-01', value: 0.49 },
      { date: '2024-10-01', value: 0.43 },
      { date: '2024-11-01', value: 0.44 },
      { date: '2024-12-01', value: 0.42 },
    ],
    _note: 'Seed vintage: 2025-01. USSLIND is the Philadelphia Fed Leading Index — NOT the Conference Board LEI (proprietary, not on FRED). Thresholds: warning <-2.0%, recession <-4.4%.',
  },
  RECPROUSM156N: {
    seriesId: 'RECPROUSM156N',
    label: 'Chauvet-Piger Smoothed Recession Probability',
    unit: 'Percent',
    frequency: 'Monthly',
    observations: [
      { date: '2024-01-01', value: 0.58 },
      { date: '2024-02-01', value: 0.72 },
      { date: '2024-03-01', value: 0.52 },
      { date: '2024-04-01', value: 0.56 },
      { date: '2024-05-01', value: 0.67 },
      { date: '2024-06-01', value: 0.78 },
      { date: '2024-07-01', value: 0.89 },
      { date: '2024-08-01', value: 0.92 },
      { date: '2024-09-01', value: 0.78 },
      { date: '2024-10-01', value: 0.71 },
      { date: '2024-11-01', value: 0.69 },
    ],
    _note: 'Seed vintage: 2025-01. Used as sanity-check against composite GeoWire score. Divergence >20pp should trigger log warning.',
  },
  BAMLH0A0HYM2: {
    seriesId: 'BAMLH0A0HYM2',
    label: 'ICE BofA US High Yield Index OAS',
    unit: 'Percent',
    frequency: 'Daily',
    observations: [
      { date: '2024-01-02', value: 3.35 },
      { date: '2024-04-01', value: 3.25 },
      { date: '2024-07-01', value: 3.29 },
      { date: '2024-08-05', value: 4.06 },
      { date: '2024-09-01', value: 3.28 },
      { date: '2024-10-01', value: 3.04 },
      { date: '2024-11-01', value: 2.83 },
      { date: '2024-12-01', value: 2.92 },
      { date: '2025-01-01', value: 2.96 },
    ],
    _note: 'Seed vintage: 2025-01. Thresholds: normal <4.0%, elevated 4.0-5.5%, warning 5.5-7.0%, recession >7.0%.',
  },
  DCOILWTICO: {
    seriesId: 'DCOILWTICO',
    label: 'Crude Oil Prices: West Texas Intermediate (WTI)',
    unit: 'Dollars per Barrel',
    frequency: 'Daily',
    observations: [
      { date: '2022-03-07', value: 123.64 },
      { date: '2022-06-14', value: 119.75 },
      { date: '2022-09-26', value: 76.55 },
      { date: '2023-09-27', value: 93.63 },
      { date: '2024-01-02', value: 70.77 },
      { date: '2024-04-01', value: 83.19 },
      { date: '2024-07-01', value: 82.14 },
      { date: '2024-10-01', value: 68.16 },
      { date: '2024-11-01', value: 68.72 },
      { date: '2024-12-01', value: 67.49 },
      { date: '2025-01-01', value: 73.95 },
    ],
    _note: 'Seed vintage: 2025-01. Hamilton NOPI model checks if current price exceeds max of prior 36 months.',
  },
  CPIAUCSL: {
    seriesId: 'CPIAUCSL',
    label: 'Consumer Price Index for All Urban Consumers: All Items',
    unit: 'Index 1982-84=100',
    frequency: 'Monthly',
    observations: [
      { date: '2024-01-01', value: 308.417 },
      { date: '2024-02-01', value: 309.685 },
      { date: '2024-03-01', value: 311.228 },
      { date: '2024-04-01', value: 311.801 },
      { date: '2024-05-01', value: 312.120 },
      { date: '2024-06-01', value: 312.557 },
      { date: '2024-07-01', value: 313.522 },
      { date: '2024-08-01', value: 313.997 },
      { date: '2024-09-01', value: 314.686 },
      { date: '2024-10-01', value: 315.664 },
      { date: '2024-11-01', value: 315.493 },
      { date: '2024-12-01', value: 315.605 },
    ],
    _note: 'Seed vintage: 2025-01.',
  },
  GDPC1: {
    seriesId: 'GDPC1',
    label: 'Real Gross Domestic Product',
    unit: 'Billions of Chained 2017 Dollars, Seasonally Adjusted Annual Rate',
    frequency: 'Quarterly',
    observations: [
      { date: '2023-04-01', value: 22390.1 },
      { date: '2023-07-01', value: 22694.7 },
      { date: '2023-10-01', value: 22885.4 },
      { date: '2024-01-01', value: 23003.1 },
      { date: '2024-04-01', value: 23206.7 },
      { date: '2024-07-01', value: 23379.6 },
      { date: '2024-10-01', value: 23515.7 },
    ],
    _note: 'Seed vintage: 2025-01.',
  },
};

/** All supported FRED series IDs for Session 2 */
export const ALLOWED_SERIES = Object.keys(SEED_DATA) as Array<keyof typeof SEED_DATA>;
