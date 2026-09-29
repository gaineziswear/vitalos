// ── VitalOS — Lemon Squeezy integration ──────────────────────────────────────
// Fiat subscription checkout via Lemon Squeezy (works from Mauritius).
// Uses direct hosted checkout URLs — no store slug or variant ID needed.
// Set checkout URLs from app.lemonsqueezy.com → Products → Share → Checkout link.

import type { Tier } from '@/lib/database.types'

const e = (k: string): string => (import.meta.env[k] as string | undefined) ?? ''

// ── Direct checkout URLs per tier ────────────────────────────────────────────
const LEMON_CHECKOUT_URLS: Partial<Record<Tier, string>> = {
  validator: e('VITE_LEMON_URL_VALIDATOR'),
  staker:    e('VITE_LEMON_URL_STAKER'),
  architect: e('VITE_LEMON_URL_ARCHITECT'),
}

// ── Typed accessor ────────────────────────────────────────────────────────────
function getCheckoutUrl(tier: Tier): string | undefined {
  const urls: Partial<Record<Tier, string>> = LEMON_CHECKOUT_URLS
  const url = Object.prototype.hasOwnProperty.call(urls, tier)
    ? urls[tier]
    : undefined
  return url || undefined
}

// ── Build checkout URL with optional prefill params ───────────────────────────
export function getLemonCheckoutUrl(
  tier: Tier,
  options?: {
    email?:    string
    userId?:   string
    redirect?: string
  }
): string | null {
  const base = getCheckoutUrl(tier)
  if (!base) return null

  const params = new URLSearchParams()
  if (options?.email)    params.set('checkout[email]', options.email)
  if (options?.userId)   params.set('checkout[custom][user_id]', options.userId)
  if (options?.redirect) params.set('checkout[redirect_url]', options.redirect)

  const query = params.toString()
  return query ? `${base}?${query}` : base
}

// ── Open checkout in a new tab ────────────────────────────────────────────────
export function openLemonCheckout(
  tier: Tier,
  options?: {
    email?:    string
    userId?:   string
    redirect?: string
  }
): void {
  const url = getLemonCheckoutUrl(tier, options)
  if (!url) {
    console.warn(`[VitalOS] No Lemon Squeezy checkout URL configured for tier: ${tier}`)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

// ── Pricing display labels ────────────────────────────────────────────────────
export const LEMON_TIER_PRICES: Record<Tier, string> = {
  node:      'Free',
  validator: '$9 / month',
  staker:    '$29 / month',
  architect: '$99 / month',
  protocol:  'Contact us',
}

// ── Is checkout configured for a tier? ───────────────────────────────────────
export function isLemonConfigured(tier: Tier): boolean {
  return !!getCheckoutUrl(tier)
}

// ── Customer billing portal ───────────────────────────────────────────────────
export const LEMON_PORTAL_URL = 'https://vitalos.lemonsqueezy.com/billing'
