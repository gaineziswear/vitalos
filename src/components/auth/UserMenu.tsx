import React, { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, ChevronDown, Zap, Shield, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { TIERS, isTrialing, trialDaysRemaining } from '../../lib/tiers'
import { AuthModal } from './AuthModal'
import { UpgradeModal } from './UpgradeModal'
import { cn } from '../../lib/utils'

export function UserMenu() {
  const { user, profile, effectiveTier, signOut } = useAuth()
  const [open,        setOpen]        = useState(false)
  const [authOpen,    setAuthOpen]    = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const tierDef = TIERS[effectiveTier]
  const trialing = profile ? isTrialing(profile) : false
  const daysLeft = profile ? trialDaysRemaining(profile) : 0

  // Not logged in
  if (!user) {
    return (
      <>
        <button
          onClick={() => setAuthOpen(true)}
          className="btn-primary text-xs py-2 px-3.5"
        >
          <Zap size={12} />
          Sign in
        </button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    )
  }

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User'
  const initials    = displayName.slice(0, 2).toUpperCase()

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-surface-muted transition-colors"
          aria-expanded={open}
          aria-haspopup="true"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-lg bg-mint-500/15 border border-mint-500/25 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-mint-400 font-mono">{initials}</span>
          </div>
          {/* Name + tier (hidden on mobile) */}
          <div className="hidden sm:block text-left min-w-0">
            <p className="text-xs font-semibold text-ink-primary truncate max-w-[100px]">{displayName}</p>
            <p className={cn('text-[10px] font-medium truncate', tierDef.color)}>
              {trialing ? `Trial · ${daysLeft}d left` : tierDef.name}
            </p>
          </div>
          <ChevronDown size={12} className="text-ink-muted hidden sm:block shrink-0" />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-56 bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden z-50"
            role="menu"
          >
            {/* Identity */}
            <div className="px-4 py-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-mint-500/15 border border-mint-500/25 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-mint-400">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-primary truncate">{displayName}</p>
                  <p className="text-[10px] text-ink-muted truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Tier badge */}
            <div className="px-4 py-2.5 border-b border-surface-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Shield size={11} className={tierDef.color} />
                  <span className={cn('text-[11px] font-bold', tierDef.color)}>{tierDef.name}</span>
                </div>
                {trialing && (
                  <span className="text-[10px] text-amber-400 font-medium">
                    {daysLeft} days left
                  </span>
                )}
              </div>
              {trialing && (
                <button
                  onClick={() => { setOpen(false); setUpgradeOpen(true) }}
                  className="mt-1.5 text-[10px] text-mint-400 font-semibold hover:text-mint-300 flex items-center gap-1"
                >
                  <Zap size={9} /> Upgrade now
                </button>
              )}
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors text-left"
                onClick={() => setOpen(false)}
              >
                <User size={13} />
                Profile & settings
              </button>
              <button
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-muted transition-colors text-left"
                onClick={() => { setOpen(false); setUpgradeOpen(true) }}
              >
                <Settings size={13} />
                Manage subscription
              </button>
            </div>

            {/* Sign out */}
            <div className="py-1 border-t border-surface-border">
              <button
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left"
                onClick={() => { setOpen(false); void signOut() }}
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  )
}
