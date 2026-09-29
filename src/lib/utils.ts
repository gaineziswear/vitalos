import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RiskLevel, DataConfidence } from '../types/yieldos'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtUsd(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function fmtPct(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function fmtCompact(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
  return `$${value.toFixed(2)}`
}

export function riskClass(level: RiskLevel): string {
  return {
    low:      'risk-low',
    moderate: 'risk-moderate',
    high:     'risk-high',
    critical: 'risk-critical',
  }[level]
}

export function confClass(conf: DataConfidence): string {
  return {
    high:   'conf-high',
    medium: 'conf-medium',
    low:    'conf-low',
  }[conf]
}

export function riskColor(score: number): string {
  if (score < 30) return '#10bf84'
  if (score < 55) return '#f59e0b'
  if (score < 75) return '#f97316'
  return '#ef4444'
}

export function riskLabel(level: RiskLevel, t: { riskLevels: Record<RiskLevel, string> }): string {
  return t.riskLevels[level]
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export function lockupLabel(hours: number): string {
  if (hours === 0) return 'None'
  if (hours < 24) return `${hours}h`
  if (hours < 168) return `${Math.floor(hours / 24)}d`
  return `${Math.floor(hours / 168)}w`
}

export function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}
