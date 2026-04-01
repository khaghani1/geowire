/**
 * FRED Data Service — server-side only.
 *
 * Provides typed access to Federal Reserve Economic Data (FRED) API.
 * Runs exclusively in API routes and server actions; never imported by browser code.
 *
 * Fallback chain:
 *   1. Live FRED API (FRED_API_KEY must be set)
 *   2. In-memory cache (stale data, marked source: 'cached')
 *   3. Seed data (marked source: 'seed')
 */

import { SEED_DATA, ALLOWED_SERIES, type FredObservation, type SeedSeries } from './seed/indicators';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataSource = 'live' | 'cached' | 'seed';

export interface FredSeriesResult {
  seriesId: string;
  label: string;
  unit: string;
  frequency: string;
  observations: FredObservation[];
  dataSource: DataSource;
  fetchedAt: string; // ISO timestamp
  stale?: boolean;
}

export interface AllIndicatorsResult {
  series: Record<string, FredSeriesResult>;
  dataSource: DataSource;
  fetchedAt: string;
  errors: Record<string, string>;
}

// ─── In-memory cache ──────────────────────────────────────────────────────────

interface CacheEntry {
  data: FredSeriesResult;
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const cache = new Map<string, CacheEntry>();

function getCached(seriesId: string): FredSeriesResult | null {
  const entry = cache.get(seriesId);
  if (!entry) return null;
  return entry.data; // callers check staleness themselves
}

function setCached(seriesId: string, data: FredSeriesResult): void {
  cache.set(seriesId, { data, timestamp: Date.now() });
}

function isCacheFresh(seriesId: string): boolean {
  const entry = cache.get(seriesId);
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

// ─── FRED API fetch ───────────────────────────────────────────────────────────

const FRED_BASE = 'https://api.stlouisfed.org/fred/series';

interface FredApiObservation {
  date: string;
  value: string;
}

interface FredObservationsResponse {
  observations: FredApiObservation[];
}

/**
 * Fetch a single FRED series from the live API.
 * Returns null if the API key is missing or the request fails.
 */
async function fetchFromFredApi(
  seriesId: string,
  limit = 36
): Promise<FredObservation[] | null> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return null;

  const url = new URL(`${FRED_BASE}/observations`);
  url.searchParams.set('series_id', seriesId);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('file_type', 'json');
  url.searchParams.set('sort_order', 'asc');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sort_order', 'desc'); // get most recent first then reverse

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`[fred] FRED API error for ${seriesId}: ${res.status}`);
      return null;
    }

    const json: FredObservationsResponse = await res.json();

    // Reverse so observations are oldest → newest
    const observations = json.observations
      .reverse()
      .map((obs) => ({
        date: obs.date,
        value: obs.value === '.' ? null : parseFloat(obs.value),
      }));

    return observations;
  } catch (err) {
    console.error(`[fred] Fetch failed for ${seriesId}:`, err);
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch a single FRED series with full fallback chain.
 *
 * @param seriesId - Must be in ALLOWED_SERIES
 * @param limit    - Max observations to fetch from live API (default 36)
 */
export async function fetchSeries(
  seriesId: string,
  limit = 36
): Promise<FredSeriesResult> {
  const fetchedAt = new Date().toISOString();
  const seed = SEED_DATA[seriesId as keyof typeof SEED_DATA];

  if (!seed) {
    throw new Error(`Unknown series ID: ${seriesId}. Must be one of: ${ALLOWED_SERIES.join(', ')}`);
  }

  const base: Pick<FredSeriesResult, 'seriesId' | 'label' | 'unit' | 'frequency'> = {
    seriesId,
    label: seed.label,
    unit: seed.unit,
    frequency: seed.frequency,
  };

  // 1. Fresh cache hit
  if (isCacheFresh(seriesId)) {
    const cached = getCached(seriesId)!;
    return { ...cached, fetchedAt };
  }

  // 2. Live API
  const liveObs = await fetchFromFredApi(seriesId, limit);
  if (liveObs !== null) {
    const result: FredSeriesResult = {
      ...base,
      observations: liveObs,
      dataSource: 'live',
      fetchedAt,
    };
    setCached(seriesId, result);
    return result;
  }

  // 3. Stale cache (any age)
  const staleEntry = getCached(seriesId);
  if (staleEntry) {
    return { ...staleEntry, fetchedAt, stale: true, dataSource: 'cached' };
  }

  // 4. Seed data
  return {
    ...base,
    observations: seed.observations,
    dataSource: 'seed',
    fetchedAt,
  };
}

/**
 * Batch fetch all 13 Session 2 indicators.
 * Runs concurrently. Individual failures fall back gracefully.
 */
export async function fetchAllIndicators(): Promise<AllIndicatorsResult> {
  const fetchedAt = new Date().toISOString();
  const errors: Record<string, string> = {};

  const results = await Promise.allSettled(
    ALLOWED_SERIES.map((id) => fetchSeries(id as string))
  );

  const series: Record<string, FredSeriesResult> = {};
  let anyLive = false;
  let anySeed = false;

  results.forEach((result, i) => {
    const id = ALLOWED_SERIES[i];
    if (result.status === 'fulfilled') {
      series[id] = result.value;
      if (result.value.dataSource === 'live') anyLive = true;
      if (result.value.dataSource === 'seed') anySeed = true;
    } else {
      errors[id] = String(result.reason);
      // Fallback to seed synchronously
      const seed = SEED_DATA[id as keyof typeof SEED_DATA];
      series[id] = {
        seriesId: id,
        label: seed.label,
        unit: seed.unit,
        frequency: seed.frequency,
        observations: seed.observations,
        dataSource: 'seed',
        fetchedAt,
      };
      anySeed = true;
    }
  });

  const dataSource: DataSource = anyLive ? 'live' : anySeed ? 'seed' : 'cached';

  return { series, dataSource, fetchedAt, errors };
}

/**
 * Returns the most recent non-null value from a series result.
 */
export function latestValue(result: FredSeriesResult): number | null {
  const obs = [...result.observations].reverse();
  for (const o of obs) {
    if (o.value !== null) return o.value;
  }
  return null;
}

/**
 * Returns the N most recent non-null values, newest last.
 */
export function recentValues(result: FredSeriesResult, n: number): number[] {
  const values: number[] = [];
  const obs = [...result.observations].reverse();
  for (const o of obs) {
    if (o.value !== null) {
      values.unshift(o.value);
      if (values.length >= n) break;
    }
  }
  return values;
}
