// ── VitalOS — Lemon Squeezy integration ──────────────────────────────────────
// Fiat subscription checkout via Lemon Squeezy (works from Mauritius).
// No backend required — users are redirected to a hosted checkout page.
// Set up products at app.lemonsqueezy.com and paste variant IDs below.

import type { Tier } from '@/lib/database.types'

// ── Variant IDs — SET THESE after creating products in Lemon Squeezy ─────────
// Go to app.lemonsqueezy.com → Products → Create product for each tier.
// Copy the Variant ID from each product's URL or settings panel.
const e = (k: string): string => (import.meta.env[k] as string | undefined) ?? ''

const LEMON_VARIANT_IDS: Partial<Record<Tier, string>> = {
  validator: e('VITE_LEMON_VARIANT_VALIDATOR'),
  staker:    e('VITE_LEMON_VARIANT_STAKER'),
  architect: e('VITE_LEMON_VARIANT_ARCHITECT'),
  protocol:  e('VITE_LEMON_VARIANT_PROTOCOL'),
}

// ── Store slug — your Lemon Squeezy store handle ──────────────────────────────
const LEMON_STORE: string = e('VITE_LEMON_STORE_SLUG') || 'vitalos'

// ── Typed accessor ────────────────────────────────────────────────────────────
function getVariantId(tier: Tier): string | undefined {
  const ids: Partial<Record<Tier, string>> = LEMON_VARIANT_IDS
  return Object.prototype.hasOwnProperty.call(ids, tier)
    ? ids[tier]
    : undefined
}

// ── Build a hosted checkout URL for a given tier ─────────────────────────────
export function getLemonCheckoutUrl(
  tier: Tier,
  options?: {
    email?:    string
    userId?:   string
    redirect?: string
  }
): string | null {
  const variantId = getVariantId(tier)
  if (!variantId) return null

  const params = new URLSearchParams()

  // Pre-fill checkout with user email if available
  if (options?.email)  params.set('checkout[email]', options.email)

  // Pass user ID as custom data so webhook can link payment to account
  if (options?.userId) params.set('checkout[custom][user_id]', options.userId)

  // Success redirect
  if (options?.redirect) params.set('checkout[redirect_url]', options.redirect)

  // Disable free trials on Lemon side (trial is managed by VitalOS)
  params.set('checkout[disable_discount]', 'false')

  const query = params.toString()
  return `https://${LEMON_STORE}.lemonsqueezy.com/buy/${variantId}${query ? `?${query}` : ''}`
}

// ── Redirect user to Lemon Squeezy checkout ───────────────────────────────────
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
    console.warn(`[VitalOS] No Lemon Squeezy variant configured for tier: ${tier}`)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

// ── Tier pricing display ──────────────────────────────────────────────────────
export const LEMON_TIER_PRICES: Record<Tier, string> = {
  node:      'Free',
  validator: '$9 / month',
  staker:    '$29 / month',
  architect: '$99 / month',
  protocol:  'Contact us',
}

// ── Check if Lemon Squeezy is configured for a tier ──────────────────────────
export function isLemonConfigured(tier: Tier): boolean {
  return !!getVariantId(tier)
}

// ── Management portal link ────────────────────────────────────────────────────
// After subscribing, users can manage their subscription here.
// Replace with your store's customer portal URL from Lemon Squeezy dashboard.
export const LEMON_PORTAL_URL =
  `https://${LEMON_STORE}.lemonsqueezy.com/billing`
