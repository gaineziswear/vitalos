// ── VitalOS subscription tiers ───────────────────────────────────────────────

import type { Tier } from './database.types'

export const TIER_ORDER: Tier[] = ['node', 'validator', 'staker', 'architect', 'protocol']

export interface TierDefinition {
  id: Tier
  name: string
  tagline: string
  price: string
  priceMonthly: number   // USD cents; 0 = free
  color: string          // Tailwind text class
  badge: string          // Tailwind bg class
  trial: boolean
  features: string[]
  limits: {
    wallets: number | 'unlimited'
    chains: number | 'unlimited'
    mandates: number | 'unlimited'
    scenarios: number | 'unlimited'
    apiAccess: boolean
    realTimeAlerts: boolean
    transactionSim: boolean
    router: boolean
    passportExport: boolean
    professionalMode: boolean
    treasuryModule: boolean
    orgRoles: boolean
    prioritySupport: boolean
  }
}

export const TIERS: Record<Tier, TierDefinition> = {
  node: {
    id: 'node',
    name: 'Node',
    tagline: 'Read-only capital visibility',
    price: 'Free',
    priceMonthly: 0,
    color: 'text-ink-secondary',
    badge: 'bg-surface-overlay',
    trial: false,
    features: [
      'Portfolio read-only view',
      '1 wallet · 1 chain',
      'Basic opportunity list',
      'Market overview',
      'EN / FR interface',
    ],
    limits: {
      wallets: 1,
      chains: 1,
      mandates: 0,
      scenarios: 0,
      apiAccess: false,
      realTimeAlerts: false,
      transactionSim: false,
      router: false,
      passportExport: false,
      professionalMode: false,
      treasuryModule: false,
      orgRoles: false,
      prioritySupport: false,
    },
  },

  validator: {
    id: 'validator',
    name: 'Validator',
    tagline: 'Active capital management',
    price: '$9 / mo',
    priceMonthly: 900,
    color: 'text-electric-400',
    badge: 'bg-electric-400/10',
    trial: true,
    features: [
      '2 wallets · 3 chains',
      'Capital Mandate creation',
      'Daily Yield Guard digest',
      'Scenario Lab (3 presets)',
      'Yield Passport view',
      '7-day free trial',
    ],
    limits: {
      wallets: 2,
      chains: 3,
      mandates: 1,
      scenarios: 3,
      apiAccess: false,
      realTimeAlerts: false,
      transactionSim: false,
      router: false,
      passportExport: false,
      professionalMode: false,
      treasuryModule: false,
      orgRoles: false,
      prioritySupport: false,
    },
  },

  staker: {
    id: 'staker',
    name: 'Staker',
    tagline: 'Intelligent capital routing',
    price: '$29 / mo',
    priceMonthly: 2900,
    color: 'text-mint-400',
    badge: 'bg-mint-500/10',
    trial: true,
    features: [
      '5 wallets · all chains',
      'Full Capital Mandate + Risk Budget',
      'Real-time Yield Guard alerts',
      'Full Scenario Lab (custom scenarios)',
      'Transaction simulation + router',
      'Passport export',
      'Professional mode',
      '7-day free trial',
    ],
    limits: {
      wallets: 5,
      chains: 'unlimited',
      mandates: 'unlimited',
      scenarios: 'unlimited',
      apiAccess: false,
      realTimeAlerts: true,
      transactionSim: true,
      router: true,
      passportExport: true,
      professionalMode: true,
      treasuryModule: false,
      orgRoles: false,
      prioritySupport: false,
    },
  },

  architect: {
    id: 'architect',
    name: 'Architect',
    tagline: 'Infrastructure-grade intelligence',
    price: '$99 / mo',
    priceMonthly: 9900,
    color: 'text-amber-400',
    badge: 'bg-amber-400/10',
    trial: true,
    features: [
      'Unlimited wallets + chains',
      'API access (rate-limited)',
      'Multi-property / family office',
      'Priority data refresh',
      'Early protocol integrations',
      'Dedicated support channel',
      '7-day free trial',
    ],
    limits: {
      wallets: 'unlimited',
      chains: 'unlimited',
      mandates: 'unlimited',
      scenarios: 'unlimited',
      apiAccess: true,
      realTimeAlerts: true,
      transactionSim: true,
      router: true,
      passportExport: true,
      professionalMode: true,
      treasuryModule: false,
      orgRoles: false,
      prioritySupport: true,
    },
  },

  protocol: {
    id: 'protocol',
    name: 'Protocol',
    tagline: 'Enterprise · DAO · Treasury',
    price: 'Custom',
    priceMonthly: 0,
    color: 'text-violet-400',
    badge: 'bg-violet-400/10',
    trial: false,
    features: [
      'Everything in Architect',
      'Treasury module',
      'Two-person approval workflows',
      'Org roles + audit logs',
      'White-label options',
      'Custom data integrations',
      'SLA + onboarding call',
    ],
    limits: {
      wallets: 'unlimited',
      chains: 'unlimited',
      mandates: 'unlimited',
      scenarios: 'unlimited',
      apiAccess: true,
      realTimeAlerts: true,
      transactionSim: true,
      router: true,
      passportExport: true,
      professionalMode: true,
      treasuryModule: true,
      orgRoles: true,
      prioritySupport: true,
    },
  },
}

export const TRIAL_DAYS = 7

/** Returns true if the current user's tier satisfies the minimum required tier */
export function tierAtLeast(userTier: Tier, required: Tier): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(required)
}

/** Is the user currently on an active trial? */
export function isTrialing(profile: { tier_status: string; trial_ends_at: string | null }): boolean {
  if (profile.tier_status !== 'trialing') return false
  if (!profile.trial_ends_at) return false
  return new Date(profile.trial_ends_at) > new Date()
}

/** Days remaining in trial (0 if not trialing) */
export function trialDaysRemaining(profile: { tier_status: string; trial_ends_at: string | null }): number {
  if (!isTrialing(profile)) return 0
  const ms = new Date(profile.trial_ends_at!).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}
