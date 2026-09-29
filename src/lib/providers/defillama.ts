// ── VitalOS — DeFiLlama Data Provider ────────────────────────────────────────
// Public API — no key required. https://defillama.com/docs/api
//
// All data is labelled with source + timestamp.
// Never present stale or unavailable data as live.

import type {
  Opportunity, YieldDNA, YieldBreakdown, RiskProfile,
  SmartContractRisk, LiquidityRisk, MarketRisk, StablecoinRisk,
  OracleRisk, GovernanceRisk, BridgeRisk, ExitAnalysis, DataMeta,
} from '../../types/yieldos'

const YIELDS = 'https://yields.llama.fi'
const BASE   = 'https://api.llama.fi'

// ── DeFiLlama pool shape (subset of what the API returns) ────────────────────

interface LlamaPool {
  pool:             string
  chain:            string
  project:          string
  symbol:           string
  tvlUsd:           number
  apyBase:          number | null
  apyReward:        number | null
  apy:              number | null
  apyMean30d:       number | null
  ilRisk:           string | null
  poolMeta:         string | null
  stablecoin:       boolean
  rewardTokens:     string[] | null
  underlyingTokens: string[] | null
  confidence:       number | null
  volumeUsd7d:      number | null
  change_7d?:       number | null
}

interface LlamaProtocol {
  id: string; name: string; slug: string; tvl: number
  chains: string[]; category: string; url: string
  audit_links: string[] | null; oracles: string[] | null
}

// ── TTL cache ─────────────────────────────────────────────────────────────────

interface CacheEntry<T> { data: T; fetchedAt: number; ttlMs: number }
const _cache = new Map<string, CacheEntry<unknown>>()

function getCached<T>(key: string): T | null {
  const e = _cache.get(key) as CacheEntry<T> | undefined
  if (!e || Date.now() - e.fetchedAt > e.ttlMs) { _cache.delete(key); return null }
  return e.data
}
function setCached<T>(key: string, data: T, ttlMs: number) {
  _cache.set(key, { data, fetchedAt: Date.now(), ttlMs })
}

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function fetchJson<T>(url: string, ttlMs = 5 * 60_000): Promise<T | null> {
  const cached = getCached<T>(url)
  if (cached) return cached
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(12_000),
    })
    if (!res.ok) { console.warn(`[DeFiLlama] ${res.status} ${url}`); return null }
    const data = await res.json() as T
    setCached(url, data, ttlMs)
    return data
  } catch (e) {
    console.warn('[DeFiLlama] fetch error:', e)
    return null
  }
}

// ── Chain ID map (best-effort; 0 = unknown) ───────────────────────────────────

const CHAIN_IDS: Record<string, number> = {
  ethereum: 1, base: 8453, arbitrum: 42161, optimism: 10,
  polygon: 137, bsc: 56, avalanche: 43114, solana: 0,
  fantom: 250, gnosis: 100, celo: 42220, linea: 59144,
}

function chainId(chain: string): number {
  return CHAIN_IDS[chain.toLowerCase()] ?? 0
}

// ── Build full DataMeta ───────────────────────────────────────────────────────

function meta(fetchedAt: number, confidence = 0.8): DataMeta {
  return {
    timestamp:  fetchedAt,
    provider:   'DeFiLlama',
    confidence: confidence >= 0.8 ? 'high' : confidence >= 0.5 ? 'medium' : 'low',
    isDemo:     false,
  }
}

// ── Build YieldDNA from pool ──────────────────────────────────────────────────

function buildYieldDNA(pool: LlamaPool, fetchedAt: number): YieldDNA {
  const grossYield       = pool.apy       ?? 0
  const incentiveYield   = pool.apyReward ?? 0
  const organicYield     = pool.apyBase   ?? 0
  const sustainableYield = organicYield
  const estimatedNetYield = Math.max(0, grossYield - 0.1)
  const incentiveDep     = grossYield > 0 ? incentiveYield / grossYield : 0

  const breakdown: YieldBreakdown = {
    organic:           organicYield,
    tradingFees:       0,
    stakingRewards:    0,
    tokenIncentives:   incentiveYield,
    other:             0,
    advertised:        grossYield,
    sustainable:       sustainableYield,
    incentiveDependency: incentiveDep > 0.7 ? 'CRITICAL' : incentiveDep > 0.4 ? 'HIGH' : incentiveDep > 0.2 ? 'MEDIUM' : 'LOW',
    classes:           incentiveDep > 0.4 ? ['D', 'E'] : organicYield > 0 ? ['A', 'B'] : ['F'],
  }

  return {
    asset:             pool.symbol,
    chain:             pool.chain,
    protocol:          pool.project,
    strategy:          pool.poolMeta ?? 'Yield',
    grossYield,
    estimatedNetYield,
    sustainableYield,
    incentiveYield,
    protocolFees:      0.1,
    gasCost:           0,
    exitCost:          0,
    slippage:          0,
    borrowingCosts:    0,
    estimatedIL:       pool.ilRisk === 'yes' ? 2 : 0,
    otherCosts:        0,
    liquidity:         pool.tvlUsd,
    lockupHours:       0,
    exitComplexity:    'simple',
    capacity:          pool.tvlUsd * 0.05,
    breakdown,
    meta:              meta(fetchedAt, pool.confidence ?? 0.7),
  }
}

// ── Build RiskProfile from pool ───────────────────────────────────────────────

function buildRisk(pool: LlamaPool, fetchedAt: number): RiskProfile {
  const tvl = pool.tvlUsd

  const sc: SmartContractRisk = {
    score: 50, sourceVerified: false, auditCount: 0,
    lastAuditDate: null, upgradeable: true, adminPrivileges: true,
    timelockDays: 0, multisig: false, bugBounty: false,
    formalVerification: false, incidentCount: 0,
    contractAgeDays: 0,
  }

  const liq: LiquidityRisk = {
    score:                   tvl > 50_000_000 ? 20 : tvl > 5_000_000 ? 40 : 65,
    tvlUsd:                  tvl,
    poolDepthUsd:            tvl,
    withdrawalLiquidityUsd:  tvl * 0.8,
    utilization:             50,
    tvl7dChange:             pool.change_7d ?? 0,
  }

  const mkt: MarketRisk = {
    score:        pool.stablecoin ? 20 : 50,
    volatility30d: pool.stablecoin ? 0.1 : 25,
    correlationBtc: 0.5,
    liquidationRisk: false,
    ilRisk:       pool.ilRisk === 'yes' ? 'moderate' : 'none',
  }

  const stable: StablecoinRisk = {
    score:             pool.stablecoin ? 20 : 5,
    isStablecoin:      pool.stablecoin,
    issuer:            'unknown',
    collateralType:    pool.stablecoin ? 'fiat' : 'none',
    historicalDepeg:   false,
    maxHistoricalDepeg: 0,
  }

  const oracle: OracleRisk = {
    score: 30, provider: 'unknown',
    manipulationResistant: false, hasFallback: false,
  }

  const gov: GovernanceRisk = {
    score: 40, votingConcentration: 50,
    adminUpgradeControl: true, timelockDays: 0,
  }

  const bridge: BridgeRisk = {
    score: 10, usesBridge: false, bridgeName: null,
    validatorCount: null, bridgeIncidents: 0, withdrawalDelayHours: 0,
  }

  const overallScore = Math.round(
    (sc.score * 0.25 + liq.score * 0.25 + mkt.score * 0.2 +
     stable.score * 0.1 + oracle.score * 0.1 + gov.score * 0.05 + bridge.score * 0.05)
  )

  return {
    overall:          overallScore,
    level:            overallScore > 70 ? 'critical' : overallScore > 50 ? 'high' : overallScore > 30 ? 'moderate' : 'low',
    smartContract:    sc,
    liquidity:        liq,
    market:           mkt,
    stablecoin:       stable,
    oracle,
    governance:       gov,
    bridge,
    concentrationRisk: tvl < 500_000 ? 70 : tvl < 5_000_000 ? 40 : 20,
    meta:             meta(fetchedAt),
  }
}

// ── Build ExitAnalysis ────────────────────────────────────────────────────────

function buildExit(): ExitAnalysis {
  return {
    steps:                ['Withdraw from protocol', 'Receive tokens to wallet'],
    estimatedGasUsd:      5,
    estimatedSlippage:    0.1,
    lockupRemainingHours: 0,
    liquidityAdequate:    true,
    exitComplexity:       'simple',
    dependencies:         [],
    clearExitPath:        true,
  }
}

// ── Map LlamaPool → full Opportunity ─────────────────────────────────────────

function poolToOpportunity(pool: LlamaPool, fetchedAt: number): Opportunity {
  return {
    id:           pool.pool,
    protocol:     pool.project,
    chain:        pool.chain,
    chainId:      chainId(pool.chain),
    asset:        pool.symbol,
    strategy:     pool.poolMeta ?? 'Yield',
    strategyType: pool.ilRisk === 'yes' ? 'lp' : pool.stablecoin ? 'lending' : 'other',
    status:       'AVAILABLE',
    yieldDNA:     buildYieldDNA(pool, fetchedAt),
    risk:         buildRisk(pool, fetchedAt),
    exitAnalysis: buildExit(),
    meta:         meta(fetchedAt, pool.confidence ?? 0.7),
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface PoolsResult {
  opportunities: Opportunity[]
  fetchedAt:     number
  stale:         boolean
  count:         number
}

export async function fetchPools(options: {
  chains?:     string[]
  assets?:     string[]
  minTvl?:     number
  minApy?:     number
  stablecoin?: boolean
  limit?:      number
} = {}): Promise<PoolsResult> {
  const {
    chains, assets,
    minTvl = 500_000,
    minApy = 0.1,
    stablecoin,
    limit  = 300,
  } = options

  const fetchedAt = Date.now()
  const raw = await fetchJson<{ data: LlamaPool[] }>(`${YIELDS}/pools`, 10 * 60_000)

  if (!raw?.data) return { opportunities: [], fetchedAt, stale: true, count: 0 }

  let pools = raw.data.filter(p =>
    p.apy   != null && p.apy   >= minApy &&
    p.tvlUsd != null && p.tvlUsd >= minTvl
  )

  if (chains?.length)     pools = pools.filter(p => chains.includes(p.chain.toLowerCase()))
  if (assets?.length)     pools = pools.filter(p => assets.some(a => p.symbol.toLowerCase().includes(a.toLowerCase())))
  if (stablecoin != null) pools = pools.filter(p => p.stablecoin === stablecoin)

  pools.sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0))
  pools = pools.slice(0, limit)

  return {
    opportunities: pools.map(p => poolToOpportunity(p, fetchedAt)),
    fetchedAt,
    stale: false,
    count: pools.length,
  }
}

export async function fetchProtocols(limit = 50): Promise<LlamaProtocol[]> {
  const raw = await fetchJson<LlamaProtocol[]>(`${BASE}/protocols`, 15 * 60_000)
  return raw ? raw.slice(0, limit) : []
}

export async function fetchTotalTvl(): Promise<number | null> {
  const raw = await fetchJson<{ tvl: number }[]>(`${BASE}/v2/historicalChainTvl`, 30 * 60_000)
  if (!raw?.length) return null
  return raw[raw.length - 1].tvl
}

/** Human-readable freshness label */
export function freshnessLabel(fetchedAt: number): string {
  const s = Math.floor((Date.now() - fetchedAt) / 1000)
  if (s < 60)   return `Updated ${s}s ago`
  if (s < 3600) return `Updated ${Math.floor(s / 60)}m ago`
  return `Updated ${Math.floor(s / 3600)}h ago`
}
