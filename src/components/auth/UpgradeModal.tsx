import React from 'react'
import { X, Check, Zap, ArrowRight } from 'lucide-react'
import { TIERS, TIER_ORDER } from '../../lib/tiers'
import type { Tier } from '../../lib/database.types'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

interface UpgradeModalProps {
  open:       boolean
  onClose:    () => void
  targetTier?: Tier
}

export function UpgradeModal({ open, onClose, targetTier }: UpgradeModalProps) {
  const { effectiveTier } = useAuth()

  if (!open) return null

  // Show tiers above current (excluding node/protocol extremes for cleaner UX)
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
      <div className="relative w-full max-w-2xl bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 px-6 pt-6 pb-4 border-b border-surface-border bg-surface-card z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-ink-primary">Upgrade VitalOS</h2>
              <p className="text-sm text-ink-muted mt-0.5">
                All paid tiers start with a 7-day free trial. No card required to trial.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink-primary hover:bg-surface-muted transition-colors"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tiers grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showTiers.map(tier => {
            const isCurrent  = tier.id === effectiveTier
            const isTarget   = tier.id === targetTier
            const isProtocol = tier.id === 'protocol'

            return (
              <div
                key={tier.id}
                className={cn(
                  'rounded-xl border p-5 flex flex-col gap-4 transition-colors',
                  isTarget
                    ? 'border-mint-500/40 bg-mint-500/5'
                    : 'border-surface-border bg-surface-muted hover:border-surface-overlay',
                )}
              >
                {/* Tier header */}
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
                      {tier.price}
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

                {/* CTA */}
                {isProtocol ? (
                  <a
                    href="mailto:hello@vitalos.space?subject=VitalOS Protocol Tier"
                    className="btn-secondary text-xs py-2 justify-center w-full"
                  >
                    Contact us
                    <ArrowRight size={11} />
                  </a>
                ) : isCurrent ? (
                  <button disabled className="btn-ghost text-xs py-2 w-full justify-center opacity-50 cursor-default">
                    Active plan
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Stripe / payment integration goes here
                      // For now: display coming-soon note
                      alert(`Payments coming soon. Tier: ${tier.name} at ${tier.price}`)
                    }}
                    className={cn(
                      'text-xs py-2 w-full justify-center rounded-lg font-semibold transition-colors flex items-center gap-1.5',
                      isTarget
                        ? 'bg-mint-500 hover:bg-mint-400 text-graphite-900'
                        : 'btn-secondary',
                    )}
                  >
                    {tier.trial ? (
                      <><Zap size={11} /> Start free trial</>
                    ) : (
                      <>Upgrade to {tier.name}</>
                    )}
                  </button>
                )}
              </div>
            )
          })}
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
