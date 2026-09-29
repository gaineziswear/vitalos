// ─────────────────────────────────────────────────────────────────────────────
// VitalOS — Core type system
// All financial types flow through here. Never fabricate data — label as DEMO.
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'
export type DataConfidence = 'high' | 'medium' | 'low'
export type Lang = 'en' | 'fr'
export type AppMode = 'beginner' | 'professional'
export type RouterDecision = 'HOLD' | 'MOVE' | 'PARTIAL_MOVE' | 'WAIT' | 'EXIT'

// Yield sustainability classification
export type YieldClass =
  | 'A' // protocol / business revenue
  | 'B' // trading / borrowing fees
  | 'C' // staking rewards
  | 'D' // token emissions
  | 'E' // temporary incentives
  | 'F' // uncertain / subsidized

export type OpportunityStatus =
  | 'DISCOVERED' | 'VALIDATED' | 'MONITORED'
  | 'ELIGIBLE' | 'AVAILABLE' | 'DETERIORATING' | 'WITHDRAWN'

export type ProtocolStatus =
  | 'DISCOVERED' | 'UNDER_REVIEW' | 'MONITORED'
  | 'ELIGIBLE' | 'RESTRICTED' | 'SUSPENDED'

export type IncidentStatus =
  | 'DETECTED' | 'INVESTIGATING' | 'CONFIRMED' | 'MITIGATION' | 'RESOLVED'

export type BookingStatus =
  | 'REQUESTED' | 'MATCHING' | 'OFFERED' | 'ACCEPTED' | 'CONFIRMED'
  | 'IN_PROGRESS' | 'COMPLETED' | 'CUSTOMER_CONFIRMED'
  | 'CANCELLED' | 'DISPUTED' | 'REFUNDED'

// ── Data freshness ────────────────────────────────────────────────────────────

export interface DataMeta {
  timestamp: number          // unix ms
  provider: string
  confidence: DataConfidence
  isDemo: boolean
}

// ── Yield DNA ─────────────────────────────────────────────────────────────────

export interface YieldBreakdown {
  organic: number        // %
  tradingFees: number    // %
  stakingRewards: number // %
  tokenIncentives: number // %
  other: number          // %
  // derived
  advertised: number     // %
  sustainable: number    // % (organic + fees + staking)
  incentiveDependency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  classes: YieldClass[]
}

export interface YieldDNA {
  asset: string
  chain: string
  protocol: string
  strategy: string
  grossYield: number          // %
  estimatedNetYield: number   // %
  sustainableYield: number    // %
  incentiveYield: number      // %
  protocolFees: number        // % annualized
  gasCost: number             // USD
  exitCost: number            // USD
  slippage: number            // %
  borrowingCosts: number      // % annualized
  estimatedIL: number         // % (impermanent loss)
  otherCosts: number          // USD
  liquidity: number           // USD
  lockupHours: number         // 0 = none
  exitComplexity: 'simple' | 'moderate' | 'complex'
  capacity: number            // USD estimated available
  breakdown: YieldBreakdown
  meta: DataMeta
}

// ── Risk dimensions ───────────────────────────────────────────────────────────

export interface SmartContractRisk {
  score: number           // 0-100
  sourceVerified: boolean
  auditCount: number
  lastAuditDate: string | null
  upgradeable: boolean
  adminPrivileges: boolean
  timelockDays: number
  multisig: boolean
  bugBounty: boolean
  formalVerification: boolean
  incidentCount: number
  contractAgeDays: number
}

export interface LiquidityRisk {
  score: number
  tvlUsd: number
  poolDepthUsd: number
  withdrawalLiquidityUsd: number
  utilization: number     // %
  tvl7dChange: number     // %
}

export interface MarketRisk {
  score: number
  volatility30d: number   // %
  correlationBtc: number  // -1 to 1
  liquidationRisk: boolean
  ilRisk: 'none' | 'low' | 'moderate' | 'high'
}

export interface StablecoinRisk {
  score: number
  isStablecoin: boolean
  issuer: string
  collateralType: 'fiat' | 'crypto' | 'algorithmic' | 'rwa' | 'none'
  historicalDepeg: boolean
  maxHistoricalDepeg: number // %
}

export interface OracleRisk {
  score: number
  provider: string
  manipulationResistant: boolean
  hasFallback: boolean
}

export interface GovernanceRisk {
  score: number
  votingConcentration: number  // % held by top 10
  adminUpgradeControl: boolean
  timelockDays: number
}

export interface BridgeRisk {
  score: number
  usesBridge: boolean
  bridgeName: string | null
  validatorCount: number | null
  bridgeIncidents: number
  withdrawalDelayHours: number
}

export interface RiskProfile {
  overall: number          // 0-100
  level: RiskLevel
  smartContract: SmartContractRisk
  liquidity: LiquidityRisk
  market: MarketRisk
  stablecoin: StablecoinRisk
  oracle: OracleRisk
  governance: GovernanceRisk
  bridge: BridgeRisk
  concentrationRisk: number // %
  meta: DataMeta
}

// ── Opportunity ───────────────────────────────────────────────────────────────

export interface Opportunity {
  id: string
  protocol: string
  protocolLogoUrl?: string
  chain: string
  chainId: number
  asset: string
  strategy: string
  strategyType: 'lending' | 'lp' | 'staking' | 'liquid_staking' | 'restaking' | 'vault' | 'rwa' | 'fixed_rate' | 'other'
  status: OpportunityStatus
  yieldDNA: YieldDNA
  risk: RiskProfile
  ineligibleReason?: string    // set when mandate/risk breached
  exitAnalysis: ExitAnalysis
  meta: DataMeta
}

export interface ExitAnalysis {
  steps: string[]
  estimatedGasUsd: number
  estimatedSlippage: number   // %
  lockupRemainingHours: number
  liquidityAdequate: boolean
  exitComplexity: 'simple' | 'moderate' | 'complex'
  dependencies: string[]      // other protocols/bridges required
  clearExitPath: boolean
}

// ── Capital Mandate ───────────────────────────────────────────────────────────

export interface CapitalMandate {
  id: string
  name: string
  objective: 'preserve' | 'income' | 'growth' | 'explore'
  liquidityHorizon: 'immediate' | '1h' | '24h' | 'days' | 'flexible'
  maxProtocolExposure: number    // % 0-100
  maxChainExposure: number       // % 0-100
  maxIlliquidCapital: number     // % 0-100
  maxLeverage: number            // % 0-100
  experimentalProtocols: number  // % 0-100 allowed in experimental
  minLiquidity: number           // % 0-100
  minNetYieldImprovement: number // % absolute, min improvement to route
  allowedAssets: string[]        // empty = all
  allowedChains: string[]        // empty = all
  createdAt: number
  updatedAt: number
}

// ── Risk Budget ───────────────────────────────────────────────────────────────

export interface RiskBudget {
  id: string
  mandateId: string
  maxSmartContractRisk: number   // 0-100
  maxMarketRisk: number
  maxLiquidityRisk: number
  maxStablecoinRisk: number
  maxOracleRisk: number
  maxGovernanceRisk: number
  maxBridgeRisk: number
  maxConcentrationRisk: number   // % of portfolio in single protocol
  maxLeverageRisk: number
  currentUsage: RiskBudgetUsage
  updatedAt: number
}

export interface RiskBudgetUsage {
  smartContract: number
  market: number
  liquidity: number
  stablecoin: number
  oracle: number
  governance: number
  bridge: number
  concentration: number
  leverage: number
  overall: number              // % of total budget used
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export interface PortfolioPosition {
  id: string
  positionType: 'token' | 'lp' | 'lending' | 'borrowing' | 'staking' | 'liquid_staking' | 'restaking' | 'vault' | 'collateral' | 'debt'
  protocol: string
  chain: string
  asset: string
  rawBalance: string           // big number string
  usdValue: number
  yieldDNA?: YieldDNA
  risk?: RiskProfile
  underlyingAssets?: UnderlyingAsset[]
  meta: DataMeta
}

export interface UnderlyingAsset {
  asset: string
  share: number                // %
  usdValue: number
}

export interface Portfolio {
  walletAddress: string
  totalUsd: number
  workingCapitalUsd: number    // actively deployed
  availableLiquidityUsd: number
  estimatedCurrentYield: number // % annualized
  realized30dYield: number     // USD
  fees30d: number              // USD
  riskLevel: RiskLevel
  riskBudgetUsed: number       // %
  positions: PortfolioPosition[]
  concentrationMap: ConcentrationMap
  lastUpdated: number
  isDemo: boolean
}

export interface ConcentrationMap {
  byProtocol: Record<string, number>   // protocol -> % of portfolio
  byChain: Record<string, number>
  byAsset: Record<string, number>
  byStablecoin: Record<string, number>
  byBridge: Record<string, number>
  byOracle: Record<string, number>
  hiddenConcentrations: HiddenConcentration[]
}

export interface HiddenConcentration {
  type: 'stablecoin' | 'oracle' | 'bridge' | 'governance'
  name: string
  affectedProtocols: string[]
  totalExposureUsd: number
  totalExposurePct: number
  severity: RiskLevel
}

// ── Performance Attribution ───────────────────────────────────────────────────

export interface PerformanceAttribution {
  period: '7d' | '30d' | '90d' | '1y' | 'all'
  totalReturn: number
  assetAppreciation: number
  protocolYield: number
  tradingFees: number
  incentives: number
  gas: number
  bridgeCosts: number
  otherCosts: number
  realizedYield: number
  unrealizedPnl: number
}

// ── Router ────────────────────────────────────────────────────────────────────

export interface RouterResult {
  decision: RouterDecision
  currentOpportunity?: Partial<Opportunity>
  proposedOpportunity?: Opportunity
  currentYield: number
  proposedYield: number
  estimatedAnnualDiff: number   // USD
  switchingCost: number         // USD
  exitCost: number              // USD
  breakEvenDays: number
  proposedAllocation: number    // USD (may be partial)
  mandateViolations: string[]
  riskChanges: RiskChange[]
  explanation: string
  yieldSource: string
  risks: string[]
  worstCase: string
  exitPlan: string
}

export interface RiskChange {
  dimension: string
  from: number
  to: number
  direction: 'better' | 'worse' | 'unchanged'
}

// ── Scenario Lab ─────────────────────────────────────────────────────────────

export interface ScenarioConfig {
  id: string
  name: string
  type: 'price_drop' | 'depeg' | 'tvl_collapse' | 'gas_spike' | 'liquidity_drop' | 'yield_drop' | 'bridge_failure' | 'oracle_failure' | 'exploit'
  params: Record<string, number | string>
  isPreset: boolean
}

export interface ScenarioResult {
  scenarioId: string
  portfolioImpactUsd: number
  portfolioImpactPct: number
  affectedPositions: ScenarioPositionImpact[]
  liquidityImpact: number
  riskBudgetImpact: number
  estimatedExitCostUsd: number
  isSimulation: true           // always true — never real
  simulatedAt: number
}

export interface ScenarioPositionImpact {
  positionId: string
  protocol: string
  asset: string
  impactUsd: number
  impactPct: number
  canExit: boolean
  exitCostUsd: number
}

// ── Yield Guard ───────────────────────────────────────────────────────────────

export interface GuardAlert {
  id: string
  severity: RiskLevel
  type: 'yield_collapse' | 'tvl_collapse' | 'liquidity_drop' | 'exploit' | 'depeg' | 'oracle' | 'governance' | 'upgrade' | 'bridge' | 'abnormal_withdrawals' | 'mandate_breach'
  protocol: string
  chain: string
  title: string
  body: string
  affectedAssets: string[]
  exposureUsd: number
  estimatedExitUsd: number
  exitCostUsd: number
  incidentStatus: IncidentStatus
  detectedAt: number
  updatedAt: number
  actions: GuardAction[]
  isDemo: boolean
}

export interface GuardAction {
  label: string
  type: 'view' | 'simulate_exit' | 'prepare_exit' | 'dismiss' | 'research'
}

// ── Yield Passport ────────────────────────────────────────────────────────────

export interface YieldPassport {
  walletAddress: string
  capitalUsd: number
  activeStrategies: number
  chains: number
  protocols: number
  avgNetYield: number
  realizedYield: number
  highestProtocolConcentration: number   // %
  liquidityPct: number
  riskBudgetUsed: number                 // %
  sustainableYieldRatio: number          // %
  generatedAt: number
  isDemo: boolean
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export type OnboardingObjective = 'preserve' | 'income' | 'growth' | 'explore' | 'unknown'
export type LiquidityNeed = 'immediate' | '1h' | '24h' | 'days' | 'flexible'

export interface OnboardingState {
  step: 'objective' | 'liquidity' | 'risk' | 'wallet' | 'complete'
  objective?: OnboardingObjective
  liquidityNeed?: LiquidityNeed
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive'
  completed: boolean
}

// ── Transaction ───────────────────────────────────────────────────────────────

export interface TransactionPreview {
  id: string
  type: 'deposit' | 'withdraw' | 'swap' | 'approve' | 'stake' | 'unstake' | 'bridge'
  protocol: string
  chain: string
  assetIn: string
  amountIn: string              // raw
  amountInUsd: number
  assetOut: string
  expectedAmountOut: string
  expectedAmountOutUsd: number
  gasCostUsd: number
  slippagePct: number
  approvals: ApprovalRequired[]
  contractsInvolved: string[]
  mandateViolations: string[]
  riskChanges: RiskChange[]
  simulationPassed: boolean
  simulationError?: string
  beforeState: PortfolioSummary
  afterState: PortfolioSummary
  isSimulation: true
}

export interface ApprovalRequired {
  token: string
  spender: string
  amount: string
}

export interface PortfolioSummary {
  totalUsd: number
  workingCapitalUsd: number
  availableLiquidityUsd: number
  estimatedYield: number
}
