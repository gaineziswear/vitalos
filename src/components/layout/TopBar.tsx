import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/utils'
import { Activity } from 'lucide-react'
import { UserMenu } from '../auth/UserMenu'

// ── VitalOS logo mark (mobile) ──────────────────────────────────────────────
function VitalMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#0dbf86" />
      <path d="M7 8.5L11.5 19.5L14 13.5L16.5 19.5L21 8.5" stroke="#080b0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function TopBar() {
  const { lang, setLang, walletConnected, walletAddress, connectWallet } = useApp()

  return (
    <header className="lg:hidden sticky top-0 z-40 border-b border-surface-border" style={{ background: 'rgba(8,11,11,0.92)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)' }}>
      <div className="flex items-center justify-between px-4 h-14 gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <VitalMark size={26} />
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-ink-primary tracking-tight text-sm leading-none">VitalOS</span>
            <span className="text-[8px] text-ink-muted uppercase tracking-widest font-semibold">Capital OS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Lang */}
          <div className="flex items-center gap-0.5 bg-surface-muted rounded-lg p-0.5" role="group" aria-label="Language">
            {(['en', 'fr'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={cn(
                  'px-2.5 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-widest transition-all',
                  lang === l ? 'bg-surface-overlay text-ink-primary shadow-card-xs' : 'text-ink-muted',
                )}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Wallet */}
          {walletConnected ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-mint-500/8 border border-mint-500/15">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-500 glow-pulse" aria-hidden="true" />
              <span className="text-[10px] text-ink-secondary font-mono">{walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}</span>
            </div>
          ) : (
            <button onClick={connectWallet} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint-500 text-surface-base text-xs font-bold hover:bg-mint-400 transition-colors">
              <Activity size={11} />
              Connect
            </button>
          )}

          {/* Auth */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
