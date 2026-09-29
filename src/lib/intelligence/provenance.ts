import type { DataConfidence, DataMeta } from '../../types/yieldos'

export const INTELLIGENCE_METHODOLOGY_VERSION = 'v1.0.0'

export function liveMeta(provider: string, source: string, fetchedAt = Date.now(), confidence: DataConfidence = 'medium'): DataMeta {
  return {
    timestamp: fetchedAt,
    provider,
    source,
    confidence,
    isDemo: false,
    methodology: INTELLIGENCE_METHODOLOGY_VERSION,
  }
}

export function demoMeta(provider = 'VitalOS demo'): DataMeta {
  return {
    timestamp: Date.now(),
    provider,
    source: 'demo-data',
    confidence: 'low',
    isDemo: true,
    methodology: INTELLIGENCE_METHODOLOGY_VERSION,
  }
}
