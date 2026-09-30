export type BroadcastScene = 'market' | 'stewardship' | 'opportunity' | 'community'

export interface BroadcastConfig {
  enabled: boolean
  mode: 'live' | 'away'
  scene: BroadcastScene
  aiProducer: boolean
  chatIntelligence: boolean
}

const STORAGE_KEY = 'vitalos.broadcast.config'

export const DEFAULT_BROADCAST_CONFIG: BroadcastConfig = {
  enabled: false,
  mode: 'away',
  scene: 'market',
  aiProducer: true,
  chatIntelligence: true,
}

export function readBroadcastConfig(): BroadcastConfig {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_BROADCAST_CONFIG
    return { ...DEFAULT_BROADCAST_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_BROADCAST_CONFIG
  }
}

export function writeBroadcastConfig(config: BroadcastConfig) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function broadcastApiBase(): string {
  return import.meta.env.VITE_BROADCAST_API_URL ?? '/api/broadcast'
}
