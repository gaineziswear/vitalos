import React, { useState } from 'react'
import { Lock, Zap, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { TIERS } from '../../lib/tiers'
import type { Tier } from '../../lib/database.types'
import { AuthModal } from './AuthModal'
import { UpgradeModal } from './UpgradeModal'
import { cn } from '../../lib/utils'

interface PaywallGateProps {
  requiredTier: Tier
  featureName:  string
  children:     React.ReactNode
  /** Render a locked placeholder instead of null when not authorized */
  placeholder?: boolean
}

export function PaywallGate({
  requiredTier,
  featureName,
  children,
  placeholder = true,
}: PaywallGateProps) {
  const { user, can, effectiveTier } = useAuth()
  const [authOpen,    setAuthOpen]    = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  if (can(requiredTier)) return <>{children}</>

  if (!placeholder) return null

  const tierDef = TIERS[requiredTier]

  return (
    <>
      <div
        className={cn(
          'card p-6 flex flex-col items-center justify-center text-center gap-4',
          'min-h-[180px] border-dashed',
        )}
        role="region"
        aria-label={`${featureName} — upgrade required`}
      >
        <div className="w-10 h-10 rounded-xl bg-surface-overlay border border-surface-border flex items-center justify-center">
          <Lock size={16} className="text-ink-muted" />
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-primary mb-1">{featureName}</p>
          <p className="text-xs text-ink-muted">
            Available from{' '}
            <span className={cn('font-bold', tierDef.color)}>{tierDef.name}</span>
            {' '}tier{requiredTier !== 'node' ? ' · 7-day free trial included' : ''}.
          </p>
        </div>

        {!user ? (
          <button
            onClick={() => setAuthOpen(true)}
            className="btn-primary text-xs py-2 px-4"
          >
            <Zap size={12} />
            Start free trial
          </button>
        ) : (
          <button
            onClick={() => setUpgradeOpen(true)}
            className="btn-secondary text-xs py-2 px-4"
          >
            Upgrade to {tierDef.name}
            <ArrowRight size={12} />
          </button>
        )}

        <p className="text-[10px] text-ink-muted">
          Current tier: <strong className="text-ink-secondary capitalize">{effectiveTier}</strong>
        </p>
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultView="sign_up"
      />
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        targetTier={requiredTier}
      />
    </>
  )
}
