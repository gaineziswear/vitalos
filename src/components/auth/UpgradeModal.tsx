// ── VitalOS — Upgrade modal (Unlock Protocol + Lemon Squeezy) ────────────────

import React, { useState } from 'react'
import { X, Check, Zap, ArrowRight, Wallet, CreditCard, Loader2, AlertTriangle } from 'lucide-react'
import { TIERS, TIER_ORDER } from '../../lib/tiers'
import type { Tier } from '../../lib/database.types'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import { openLemonCheckout, isLemonConfigured, LEMON_TIER_PRICES } from '../../lib/billing/lemon'
import { getLockAddress } from '../../lib/billing/unlock'
import { useUnlockSubscription } from '../../hooks/useUnlockSubscription'
import { useAccount } from 'wagmi'

type PayMethod = 'web3' | 'fiat'

interface UpgradeModalProps {
  open:        boolean
  onClose:     () => void
  targetTier?: Tier
}

// ── Per-tier purchase card ────────────────────────────────────────────────────
function TierCard({
  tierId,
  isCurrent,
  isTarget,
  payMethod,
  userEmail,
  userId,
}: {
  tierId:     Tier
  isCurrent:  boolean
  isTarget:   boolean
  payMethod:  PayMethod
  userEmail?: string
  userId?:    string
}) {
  const tier         = TIERS[tierId]
  const isProtocol   = tierId === 'protocol'
  const isFree       = tierId === 'node'
  const { address }  = useAccount()
  const {
    purchaseState,
    errorMsg,
    purchase,
  } = useUnlockSubscription(tierId)


  const lockConfigured = !!getLockAddress(tierId)
  const lemonConfigured = isLemonConfigured(tierId)

  function handleFiatClick() {
    openLemonCheckout(tierId, {
      email:    userEmail,
      userId:   userId,
      redirect: window.location.href,
    })
  }

  const purchaseLabel: Record<typeof purchaseState, string> = {
    idle:       tier.trial ? 'Start free trial' : `Upgrade to ${tier.name}`,
    checking:   'Checking...',
    approving:  'Approving USDC...',
    purchasing: 'Confirm in wallet',
    confirming: 'Confirming...',
    done:       'Subscribed!',
    error:      'Retry',
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-5 flex flex-col gap-4 transition-colors',
        isTarget
          ? 'border-mint-500/40 bg-mint-500/5'
          : 'border-surface-border bg-surface-muted hover:border-surface-overlay',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-md', tier.badge, tier.color)}>
              {tier.name}
            </span>
            {isCurrent && (
              <span className="text-[10px] font-semibold text-ink-muted bg-surface-overlay px-1.5 py-0.5 rounded">
                Current
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted">{tier.tagline}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={cn('font-display font-bold text-lg leading-none', tier.color)}>
            {payMethod === 'fiat' ? LEMON_TIER_PRICES[tierId] : tier.price}
          </p>
          {tier.trial && (
            <p className="text-[10px] text-ink-muted mt-0.5">7-day trial</p>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-1.5 flex-1">
        {tier.features.map(f => (
          <li key={f} className="flex items-start gap-2">
            <Check size={11} className={cn('mt-0.5 shrink-0', tier.color)} />
            <span className="text-[11px] text-ink-secondary leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      {/* Error */}
      {errorMsg && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
          <AlertTriangle size={11} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-300 leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* CTA */}
      {isProtocol ? (
        <a
          href="mailto:hello@vitalos.space?subject=VitalOS Protocol Tier"
          className="btn-secondary text-xs py-2 justify-center w-full"
        >
          Contact us <ArrowRight size={11} />
        </a>
      ) : isFree || isCurrent ? (
        <button disabled className="btn-ghost text-xs py-2 w-full justify-center opacity-50 cursor-default">
          {isFree ? 'Current plan' : 'Active plan'}
        </button>
      ) : payMethod === 'web3' ? (
        lockConfigured ? (
          address ? (
            <button
              onClick={() => { void purchase() }}
              disabled={purchaseState !== 'idle' && purchaseState !== 'error'}
              className={cn(
                'text-xs py-2 w-full justify-center rounded-lg font-semibold transition-colors flex items-center gap-1.5',
                isTarget
                  ? 'bg-mint-500 hover:bg-mint-400 text-graphite-900 disabled:opacity-60'
                  : 'btn-secondary',
              )}
            >
              {(purchaseState === 'checking' || purchaseState === 'approving' ||
                purchaseState === 'purchasing' || purchaseState === 'confirming') && (
                <Loader2 size={11} className="animate-spin" />
              )}
              {purchaseState === 'done' ? (
                <><Check size={11} /> Subscribed!</>
              ) : tier.trial ? (
                <><Zap size={11} /> {purchaseLabel[purchaseState]}</>
              ) : (
                <>{purchaseLabel[purchaseState]}</>
              )}
            </button>
          ) : (
            <p className="text-[11px] text-ink-muted text-center py-2">
              Connect a wallet to subscribe onchain
            </p>
          )
        ) : (
          <div className="rounded-lg bg-surface-overlay border border-surface-border px-3 py-2">
            <p className="text-[11px] text-ink-muted text-center leading-relaxed">
              Web3 lock not yet deployed.{' '}
              <a
                href="https://app.unlock-protocol.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mint-400 underline"
              >
                Deploy at Unlock Protocol
              </a>{' '}
              and add the address to <code className="text-[10px]">VITE_LOCK_{tierId.toUpperCase()}</code>
            </p>
          </div>
        )
      ) : lemonConfigured ? (
        <button
          onClick={handleFiatClick}
          className={cn(
            'text-xs py-2 w-full justify-center rounded-lg font-semibold transition-colors flex items-center gap-1.5',
            isTarget
              ? 'bg-mint-500 hover:bg-mint-400 text-graphite-900'
              : 'btn-secondary',
          )}
        >
          <CreditCard size={11} />
          {tier.trial ? 'Start free trial' : `Upgrade to ${tier.name}`}
        </button>
      ) : (
        <div className="rounded-lg bg-surface-overlay border border-surface-border px-3 py-2">
          <p className="text-[11px] text-ink-muted text-center leading-relaxed">
            Fiat checkout not yet configured.{' '}
            <a
              href="https://app.lemonsqueezy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mint-400 underline"
            >
              Set up at Lemon Squeezy
            </a>{' '}
            and add <code className="text-[10px]">VITE_LEMON_VARIANT_{tierId.toUpperCase()}</code>
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function UpgradeModal({ open, onClose, targetTier }: UpgradeModalProps) {
  const { effectiveTier, profile } = useAuth()
  // Default to fiat — Lemon Squeezy is live. Web3/Unlock tab shown once locks are deployed.
  const anyLockDeployed = (['validator','staker','architect'] as Tier[]).some(t => !!getLockAddress(t))
  const [payMethod, setPayMethod]  = useState<PayMethod>(anyLockDeployed ? 'web3' : 'fiat')

  if (!open) return null

  const showTiers = TIER_ORDER.filter(t => t !== 'node').map(t => TIERS[t])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade VitalOS"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-surface-card border border-surface-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 px-6 pt-6 pb-4 border-b border-surface-border bg-surface-card z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-ink-primary">Upgrade VitalOS</h2>
              <p className="text-sm text-ink-muted mt-0.5">
                7-day free trial on all paid tiers. Cancel anytime.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink-primary hover:bg-surface-muted transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Payment method toggle — Web3 tab only shown once Unlock locks are deployed */}
          <div className="flex items-center gap-1 mt-4 bg-surface-muted rounded-lg p-1 w-fit">
            {anyLockDeployed && (
              <button
                onClick={() => setPayMethod('web3')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
                  payMethod === 'web3'
                    ? 'bg-surface-card text-mint-400 shadow-sm'
                    : 'text-ink-muted hover:text-ink-secondary',
                )}
              >
                <Wallet size={11} /> Web3 / USDC
              </button>
            )}
            <button
              onClick={() => setPayMethod('fiat')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
                payMethod === 'fiat'
                  ? 'bg-surface-card text-mint-400 shadow-sm'
                  : 'text-ink-muted hover:text-ink-secondary',
              )}
            >
              <CreditCard size={11} /> Card / Fiat
            </button>
          </div>

          {/* Payment method description */}
          <p className="text-[11px] text-ink-muted mt-2">
            {payMethod === 'web3'
              ? 'Pay with USDC onchain via Unlock Protocol. Funds go directly to the protocol lock — no intermediary. Requires a connected wallet on Base.'
              : 'Pay by card via Lemon Squeezy. Works globally including Mauritius. Subscription managed at lemonsqueezy.com.'}
          </p>
        </div>

        {/* Tiers grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showTiers.map(tier => (
            <TierCard
              key={tier.id}
              tierId={tier.id}
              isCurrent={tier.id === effectiveTier}
              isTarget={tier.id === targetTier}
              payMethod={payMethod}
              userEmail={profile?.email}
              userId={profile?.id}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 border-t border-surface-border">
          <p className="text-[11px] text-ink-muted text-center leading-relaxed">
            VitalOS is a non-custodial intelligence layer. We never hold your funds or private keys.
            Subscription fees cover the intelligence infrastructure, not financial advice.
            Digital assets involve risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  )
}
