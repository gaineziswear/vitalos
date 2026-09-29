import type { RiskLevel, RiskProfile } from '../../types/yieldos'

export const RISK_METHODOLOGY_VERSION = 'v1.0.0'

/**
 * Deterministic aggregation of dimension scores. Higher = more risk.
 * This is a screening model, not an audit or security guarantee.
 */
export function aggregateRisk(risk: Omit<RiskProfile, 'overall' | 'level'>): Pick<RiskProfile, 'overall' | 'level'> {
  const score = Math.round(
    risk.smartContract.score * 0.25 +
    risk.liquidity.score * 0.25 +
    risk.market.score * 0.20 +
    risk.stablecoin.score * 0.10 +
    risk.oracle.score * 0.10 +
    risk.governance.score * 0.05 +
    risk.bridge.score * 0.05,
  )
  const level: RiskLevel = score > 70 ? 'critical' : score > 50 ? 'high' : score > 30 ? 'moderate' : 'low'
  return { overall: score, level }
}

export function riskScreeningNote(risk: RiskProfile): string {
  if (risk.meta.isDemo) return 'DEMO risk profile — not suitable for capital decisions.'
  if (risk.meta.confidence === 'low') return 'Low-confidence screening: key protocol controls were not independently verified.'
  return 'Screening model only: protocol audits, admin controls, incidents and oracle details require independent verification.'
}
