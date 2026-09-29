// ─────────────────────────────────────────────────────────────────────────────
// VitalOS — Demo data
// ALL values here are clearly labelled DEMO. Never present as live financial data.
// Real data requires live onchain indexing + data providers (DeFiLlama, RPCs etc.)
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Portfolio, PortfolioPosition, Opportunity, CapitalMandate,
  RiskBudget, GuardAlert, YieldPassport, ScenarioConfig,
  DataMeta, YieldDNA, RiskProfile,
} from '../types/yieldos'

const NOW = Date.now()

const demoMeta = (provider = 'DEMO'): DataMeta => ({
  timestamp: NOW,
  provider,
  confidence: 'low',
  isDemo: true,
})

// ── Demo Capital Mandate ──────────────────────────────────────────────────────

export const DEMO_MANDATE: CapitalMandate = {
  id: 'mandate-demo-1',
  name: 'Growth Strategy',
  objective: 'growth',
  liquidityHorizon: '24h',
  maxProtocolExposure: 15,
  maxChainExposure: 40,
  maxIlliquidCapital: 20,
  maxLeverage: 0,
  experimentalProtocols: 5,
  minLiquidity: 75,
  minNetYieldImprovement: 0.5,
  allowedAssets: [],
  allowedChains: [],
  createdAt: NOW - 86400000 * 30,
  updatedAt: NOW,
}

// ── Demo Risk Budget ──────────────────────────────────────────────────────────

export const DEMO_RISK_BUDGET: RiskBudget = {
  id: 'riskbudget-demo-1',
  mandateId: 'mandate-demo-1',
  maxSmartContractRisk: 60,
  maxMarketRisk: 65,
  maxLiquidityRisk: 50,
  maxStablecoinRisk: 40,
  maxOracleRisk: 55,
  maxGovernanceRisk: 50,
  maxBridgeRisk: 30,
  maxConcentrationRisk: 15,
  maxLeverageRisk: 0,
  currentUsage: {
    smartContract: 42,
    market: 38,
    liquidity: 22,
    stablecoin: 18,
    oracle: 31,
    governance: 27,
    bridge: 12,
    concentration: 18,
    leverage: 0,
    overall: 63,
  },
  updatedAt: NOW,
}

// ── Demo Yield DNA helper ─────────────────────────────────────────────────────

function makeYieldDNA(
  protocol: string,
  asset: string,
  chain: string,
  strategy: string,
  gross: number,
  net: number,
  sustainable: number,
  incentive: number,
  liquidity: number,
  lockupHours = 0,
): YieldDNA {
  return {
    asset, chain, protocol, strategy,
    grossYield: gross,
    estimatedNetYield: net,
    sustainableYield: sustainable,
    incentiveYield: incentive,
    protocolFees: 0.1,
    gasCost: 4.20,
    exitCost: 3.80,
    slippage: 0.05,
    borrowingCosts: 0,
    estimatedIL: strategy === 'lp' ? 0.8 : 0,
    otherCosts: 0.50,
    liquidity,
    lockupHours,
    exitComplexity: lockupHours === 0 ? 'simple' : lockupHours < 168 ? 'moderate' : 'complex',
    capacity: liquidity * 0.03,
    breakdown: {
      organic: sustainable * 0.6,
      tradingFees: sustainable * 0.25,
      stakingRewards: sustainable * 0.15,
      tokenIncentives: incentive,
      other: 0,
      advertised: gross,
      sustainable,
      incentiveDependency: incentive > gross * 0.5 ? 'HIGH' : incentive > gross * 0.25 ? 'MEDIUM' : 'LOW',
      classes: incentive > 0 ? ['B', 'C', 'D'] : ['A', 'B'],
    },
    meta: demoMeta('DEMO'),
  }
}

// ── Demo Risk Profile helper ──────────────────────────────────────────────────

function makeRisk(
  sc: number, liq: number, mkt: number,
  tvl: number, upgradeable = false, bridges = false,
): RiskProfile {
  const overall = Math.round((sc + liq + mkt) / 3)
  return {
    overall,
    level: overall < 30 ? 'low' : overall < 55 ? 'moderate' : overall < 75 ? 'high' : 'critical',
    smartContract: {
      score: sc, sourceVerified: true, auditCount: 3,
      lastAuditDate: '2024-08-15', upgradeable,
      adminPrivileges: upgradeable, timelockDays: upgradeable ? 2 : 0,
      multisig: true, bugBounty: true, formalVerification: false,
      incidentCount: 0, contractAgeDays: 520,
    },
    liquidity: {
      score: liq, tvlUsd: tvl, poolDepthUsd: tvl * 0.4,
      withdrawalLiquidityUsd: tvl * 0.35, utilization: 68, tvl7dChange: -1.2,
    },
    market: {
      score: mkt, volatility30d: 12.4, correlationBtc: 0.62,
      liquidationRisk: false, ilRisk: 'none',
    },
    stablecoin: {
      score: 15, isStablecoin: true, issuer: 'Circle',
      collateralType: 'fiat', historicalDepeg: false, maxHistoricalDepeg: 0.01,
    },
    oracle: {
      score: 22, provider: 'Chainlink', manipulationResistant: true, hasFallback: true,
    },
    governance: {
      score: 28, votingConcentration: 18, adminUpgradeControl: upgradeable, timelockDays: 2,
    },
    bridge: {
      score: bridges ? 38 : 5, usesBridge: bridges, bridgeName: bridges ? 'Stargate' : null,
      validatorCount: bridges ? 19 : null, bridgeIncidents: 0, withdrawalDelayHours: bridges ? 0.5 : 0,
    },
    concentrationRisk: 8,
    meta: demoMeta('DEMO'),
  }
}

// ── Demo Opportunities ────────────────────────────────────────────────────────

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-aave-usdc-eth',
    protocol: 'Aave v3',
    chain: 'Ethereum',
    chainId: 1,
    asset: 'USDC',
    strategy: 'Lending',
    strategyType: 'lending',
    status: 'AVAILABLE',
    yieldDNA: makeYieldDNA('Aave v3', 'USDC', 'Ethereum', 'lending', 4.8, 4.2, 4.8, 0, 1_800_000_000),
    risk: makeRisk(18, 12, 22, 1_800_000_000),
    exitAnalysis: {
      steps: ['Withdraw USDC from Aave supply pool'],
      estimatedGasUsd: 4.20, estimatedSlippage: 0,
      lockupRemainingHours: 0, liquidityAdequate: true,
      exitComplexity: 'simple', dependencies: [], clearExitPath: true,
    },
    meta: demoMeta('DEMO'),
  },
  {
    id: 'opp-compound-usdc-eth',
    protocol: 'Compound v3',
    chain: 'Ethereum',
    chainId: 1,
    asset: 'USDC',
    strategy: 'Lending',
    strategyType: 'lending',
    status: 'AVAILABLE',
    yieldDNA: makeYieldDNA('Compound v3', 'USDC', 'Ethereum', 'lending', 5.1, 4.6, 4.9, 0.2, 920_000_000),
    risk: makeRisk(22, 18, 24, 920_000_000, true),
    exitAnalysis: {
      steps: ['Withdraw cUSDC', 'Redeem for USDC'],
      estimatedGasUsd: 5.10, estimatedSlippage: 0,
      lockupRemainingHours: 0, liquidityAdequate: true,
      exitComplexity: 'simple', dependencies: [], clearExitPath: true,
    },
    meta: demoMeta('DEMO'),
  },
  {
    id: 'opp-aerodrome-usdc-base',
    protocol: 'Aerodrome',
    chain: 'Base',
    chainId: 8453,
    asset: 'USDC/ETH LP',
    strategy: 'Liquidity Provision',
    strategyType: 'lp',
    status: 'AVAILABLE',
    yieldDNA: makeYieldDNA('Aerodrome', 'USDC/ETH', 'Base', 'lp', 18.4, 11.2, 6.8, 11.6, 380_000_000),
    risk: makeRisk(35, 28, 52, 380_000_000, true),
    exitAnalysis: {
      steps: ['Remove LP position', 'Receive USDC + ETH', 'Swap ETH if needed'],
      estimatedGasUsd: 3.80, estimatedSlippage: 0.12,
      lockupRemainingHours: 0, liquidityAdequate: true,
      exitComplexity: 'moderate', dependencies: [], clearExitPath: true,
    },
    meta: demoMeta('DEMO'),
  },
  {
    id: 'opp-lido-eth-eth',
    protocol: 'Lido',
    chain: 'Ethereum',
    chainId: 1,
    asset: 'ETH',
    strategy: 'Liquid Staking',
    strategyType: 'liquid_staking',
    status: 'AVAILABLE',
    yieldDNA: makeYieldDNA('Lido', 'ETH', 'Ethereum', 'liquid_staking', 3.9, 3.6, 3.9, 0, 14_200_000_000),
    risk: makeRisk(20, 8, 38, 14_200_000_000),
    exitAnalysis: {
      steps: ['Unstake stETH via Lido queue (~1-3 days)', 'Or swap stETH on Curve'],
      estimatedGasUsd: 6.40, estimatedSlippage: 0.08,
      lockupRemainingHours: 72, liquidityAdequate: true,
      exitComplexity: 'moderate', dependencies: ['Curve'], clearExitPath: true,
    },
    meta: demoMeta('DEMO'),
  },
  {
    id: 'opp-morpho-usdc-base',
    protocol: 'Morpho Blue',
    chain: 'Base',
    chainId: 8453,
    asset: 'USDC',
    strategy: 'Optimised Lending',
    strategyType: 'lending',
    status: 'AVAILABLE',
    yieldDNA: makeYieldDNA('Morpho Blue', 'USDC', 'Base', 'optimised_lending', 6.8, 6.1, 6.4, 0.4, 340_000_000),
    risk: makeRisk(28, 22, 26, 340_000_000, true),
    exitAnalysis: {
      steps: ['Withdraw from Morpho market', 'Receive USDC'],
      estimatedGasUsd: 2.90, estimatedSlippage: 0,
      lockupRemainingHours: 0, liquidityAdequate: true,
      exitComplexity: 'simple', dependencies: [], clearExitPath: true,
    },
    meta: demoMeta('DEMO'),
  },
  {
    id: 'opp-pendle-usdc-arb',
    protocol: 'Pendle',
    chain: 'Arbitrum',
    chainId: 42161,
    asset: 'USDC',
    strategy: 'Fixed Rate',
    strategyType: 'fixed_rate',
    status: 'AVAILABLE',
    yieldDNA: makeYieldDNA('Pendle', 'USDC', 'Arbitrum', 'fixed_rate', 8.2, 7.4, 7.8, 0.4, 180_000_000, 720),
    risk: makeRisk(38, 32, 28, 180_000_000, true, true),
    exitAnalysis: {
      steps: ['Sell PT tokens on Pendle AMM', 'Bridge back if needed'],
      estimatedGasUsd: 1.80, estimatedSlippage: 0.22,
      lockupRemainingHours: 720, liquidityAdequate: true,
      exitComplexity: 'moderate', dependencies: ['Arbitrum Bridge'], clearExitPath: true,
    },
    meta: demoMeta('DEMO'),
  },
  {
    id: 'opp-highyield-incentive',
    protocol: 'NewProtocol XYZ',
    chain: 'Base',
    chainId: 8453,
    asset: 'USDC',
    strategy: 'Incentive Vault',
    strategyType: 'vault',
    status: 'MONITORED',
    yieldDNA: makeYieldDNA('NewProtocol XYZ', 'USDC', 'Base', 'vault', 42.0, 31.0, 4.2, 37.8, 28_000_000),
    risk: makeRisk(72, 58, 44, 28_000_000, true, true),
    exitAnalysis: {
      steps: ['Withdraw from vault', 'Claim rewards', 'Sell reward tokens'],
      estimatedGasUsd: 5.20, estimatedSlippage: 1.8,
      lockupRemainingHours: 0, liquidityAdequate: false,
      exitComplexity: 'complex', dependencies: ['Reward token liquidity'], clearExitPath: false,
    },
    meta: demoMeta('DEMO'),
  },
]

// ── Demo Portfolio ────────────────────────────────────────────────────────────

const makePosition = (
  id: string, type: PortfolioPosition['positionType'],
  protocol: string, chain: string, asset: string,
  usdValue: number, yieldDNA: YieldDNA, risk: RiskProfile,
): PortfolioPosition => ({
  id, positionType: type, protocol, chain, asset,
  rawBalance: String(Math.round(usdValue * 1e6)),
  usdValue, yieldDNA, risk,
  meta: demoMeta('DEMO'),
})

export const DEMO_PORTFOLIO: Portfolio = {
  walletAddress: '0x0000...0000',
  totalUsd: 12_482.36,
  workingCapitalUsd: 9_842.20,
  availableLiquidityUsd: 2_640.16,
  estimatedCurrentYield: 5.84,
  realized30dYield: 184.62,
  fees30d: 21.37,
  riskLevel: 'moderate',
  riskBudgetUsed: 63,
  positions: [
    makePosition(
      'pos-1', 'lending', 'Aave v3', 'Ethereum', 'USDC', 5_200,
      makeYieldDNA('Aave v3', 'USDC', 'Ethereum', 'lending', 4.8, 4.2, 4.8, 0, 1_800_000_000),
      makeRisk(18, 12, 22, 1_800_000_000),
    ),
    makePosition(
      'pos-2', 'liquid_staking', 'Lido', 'Ethereum', 'stETH', 2_850,
      makeYieldDNA('Lido', 'ETH', 'Ethereum', 'liquid_staking', 3.9, 3.6, 3.9, 0, 14_200_000_000),
      makeRisk(20, 8, 38, 14_200_000_000),
    ),
    makePosition(
      'pos-3', 'lp', 'Aerodrome', 'Base', 'USDC/ETH', 1_792.20,
      makeYieldDNA('Aerodrome', 'USDC/ETH', 'Base', 'lp', 18.4, 11.2, 6.8, 11.6, 380_000_000),
      makeRisk(35, 28, 52, 380_000_000, true),
    ),
    makePosition(
      'pos-4', 'token', 'Wallet', 'Ethereum', 'USDC', 2_640.16,
      makeYieldDNA('Wallet', 'USDC', 'Ethereum', 'idle', 0, 0, 0, 0, 0),
      makeRisk(0, 5, 5, 0),
    ),
  ],
  concentrationMap: {
    byProtocol: { 'Aave v3': 41.7, 'Lido': 22.8, 'Aerodrome': 14.4, 'Wallet': 21.1 },
    byChain: { 'Ethereum': 85.3, 'Base': 14.4 },
    byAsset: { 'USDC': 62.9, 'ETH/stETH': 22.8, 'USDC/ETH LP': 14.4 },
    byStablecoin: { 'USDC': 62.9 },
    byBridge: {},
    byOracle: { 'Chainlink': 77.2 },
    hiddenConcentrations: [
      {
        type: 'oracle',
        name: 'Chainlink',
        affectedProtocols: ['Aave v3', 'Compound v3', 'Morpho Blue'],
        totalExposureUsd: 9_630,
        totalExposurePct: 77.2,
        severity: 'moderate',
      },
    ],
  },
  lastUpdated: NOW,
  isDemo: true,
}

// ── Demo Yield Passport ───────────────────────────────────────────────────────

export const DEMO_PASSPORT: YieldPassport = {
  walletAddress: '0x0000...0000',
  capitalUsd: 12_482.36,
  activeStrategies: 3,
  chains: 2,
  protocols: 3,
  avgNetYield: 6.24,
  realizedYield: 4_821,
  highestProtocolConcentration: 41.7,
  liquidityPct: 91,
  riskBudgetUsed: 63,
  sustainableYieldRatio: 78,
  generatedAt: NOW,
  isDemo: true,
}

// ── Demo Guard Alerts ─────────────────────────────────────────────────────────

export const DEMO_ALERTS: GuardAlert[] = [
  {
    id: 'alert-1',
    severity: 'moderate',
    type: 'tvl_collapse',
    protocol: 'Aerodrome',
    chain: 'Base',
    title: 'TVL declined 18% in 48h',
    body: 'Aerodrome TVL has declined from $462M to $380M over the last 48 hours. Liquidity in your USDC/ETH pool has also decreased. Monitor closely.',
    affectedAssets: ['USDC/ETH LP'],
    exposureUsd: 1_792.20,
    estimatedExitUsd: 1_758.40,
    exitCostUsd: 33.80,
    incidentStatus: 'INVESTIGATING',
    detectedAt: NOW - 3600000 * 6,
    updatedAt: NOW - 3600000 * 2,
    actions: [
      { label: 'Simulate Exit', type: 'simulate_exit' },
      { label: 'View Research', type: 'research' },
      { label: 'Dismiss', type: 'dismiss' },
    ],
    isDemo: true,
  },
]

// ── Demo Scenario Presets ─────────────────────────────────────────────────────

export const SCENARIO_PRESETS: ScenarioConfig[] = [
  { id: 'eth-30', name: 'ETH falls 30%', type: 'price_drop', params: { asset: 'ETH', dropPct: 30 }, isPreset: true },
  { id: 'usdc-depeg', name: 'USDC depegs 5%', type: 'depeg', params: { asset: 'USDC', depegPct: 5 }, isPreset: true },
  { id: 'tvl-50', name: 'Protocol TVL falls 50%', type: 'tvl_collapse', params: { dropPct: 50 }, isPreset: true },
  { id: 'gas-10x', name: 'Gas spikes 10×', type: 'gas_spike', params: { multiplier: 10 }, isPreset: true },
  { id: 'liq-70', name: 'Liquidity falls 70%', type: 'liquidity_drop', params: { dropPct: 70 }, isPreset: true },
  { id: 'yield-50', name: 'Yield drops 50%', type: 'yield_drop', params: { dropPct: 50 }, isPreset: true },
  { id: 'bridge-fail', name: 'Bridge unavailable', type: 'bridge_failure', params: {}, isPreset: true },
  { id: 'oracle-fail', name: 'Oracle failure', type: 'oracle_failure', params: {}, isPreset: true },
]
