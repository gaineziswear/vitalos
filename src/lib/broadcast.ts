export type BroadcastScene = 'market' | 'stewardship' | 'opportunity' | 'community'

export interface BroadcastConfig {
  enabled: boolean
  mode: 'live' | 'away'
  scene: BroadcastScene
  aiProducer: boolean
  chatIntelligence: boolean
}

export interface BroadcastStatus extends BroadcastConfig {
  service: 'unconfigured' | 'ready' | 'running' | 'stopped' | 'degraded'
  encoder: 'unknown' | 'online' | 'offline' | 'error'
  pid: number | null
  startedAt: string | null
  lastError: string | null
  restartCount: number
  updatedAt: string
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${broadcastApiBase()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.error ?? `Broadcast API request failed (${response.status})`)
  return payload as T
}

export function fetchBroadcastStatus(): Promise<BroadcastStatus> {
  return request<BroadcastStatus>('/status')
}

export function startBroadcast(config: BroadcastConfig): Promise<BroadcastStatus> {
  return request<BroadcastStatus>('/start', { method: 'POST', body: JSON.stringify(config) })
}

export function stopBroadcast(): Promise<BroadcastStatus> {
  return request<BroadcastStatus>('/stop', { method: 'POST', body: '{}' })
}

export function updateBroadcastConfig(config: BroadcastConfig): Promise<BroadcastStatus> {
  return request<BroadcastStatus>('/config', { method: 'POST', body: JSON.stringify(config) })
}
