import type { YieldDNA } from '../../types/yieldos'

export const YIELD_METHODOLOGY_VERSION = 'v1.0.0'

/** Estimated net yield before user-specific gas/slippage. Never a guaranteed return. */
export function estimateNetYield(input: {
  grossYield: number
  protocolFees?: number
  borrowingCosts?: number
  incentiveYield?: number
}): number {
  const fees = input.protocolFees ?? 0
  const borrowing = input.borrowingCosts ?? 0
  const gross = Math.max(0, input.grossYield)
  return Math.max(0, gross - fees - borrowing)
}

export function incentiveDependency(y: YieldDNA): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const ratio = y.grossYield > 0 ? Math.max(0, y.incentiveYield) / y.grossYield : 0
  return ratio > 0.7 ? 'CRITICAL' : ratio > 0.4 ? 'HIGH' : ratio > 0.2 ? 'MEDIUM' : 'LOW'
}
