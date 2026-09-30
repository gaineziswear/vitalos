import { useState } from 'react'
import { Globe2, LogOut, ShieldCheck, Wallet, RotateCcw, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../lib/app-context'
import { useAuth } from '../../contexts/AuthContext'

export function SettingsScreen() {
  const { lang, setLang, mode, setMode, walletConnected, walletAddress, connectWallet, disconnectWallet } = useApp()
  const { user, profile, signOut } = useAuth()
  const [resetNotice, setResetNotice] = useState(false)

  function resetOnboarding() {
    localStorage.removeItem('vitalos.onboardingComplete')
    localStorage.removeItem('vitalos.screen')
    window.location.reload()
  }

  const name = profile?.display_name || user?.email?.split('@')[0] || 'Guest'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-mint-400 font-bold">Control centre</p>
        <h1 className="font-display text-2xl font-black text-ink-primary mt-2">Settings</h1>
        <p className="text-sm text-ink-muted mt-1">Manage your VitalOS preferences, identity and wallet connection.</p>
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border">
            <h2 className="text-sm font-bold text-ink-primary">Account</h2>
            <p className="text-xs text-ink-muted mt-1">Your authenticated VitalOS identity.</p>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-primary truncate">{name}</p>
              <p className="text-xs text-ink-muted truncate">{user?.email ?? 'Not signed in'}</p>
            </div>
            {user ? (
              <button onClick={() => void signOut()} className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-border text-xs font-semibold text-ink-secondary hover:text-ink-primary hover:bg-surface-muted">
                <LogOut size={13} /> Sign out
              </button>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Guest</span>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border flex items-center gap-3">
            <Globe2 size={16} className="text-mint-400" />
            <div>
              <h2 className="text-sm font-bold text-ink-primary">Experience</h2>
              <p className="text-xs text-ink-muted mt-1">Language and interface complexity.</p>
            </div>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-ink-muted">Language</label>
              <div className="mt-2 flex gap-2">
                {(['en', 'fr'] as const).map(value => (
                  <button key={value} onClick={() => setLang(value)} aria-pressed={lang === value}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${lang === value ? 'bg-mint-500/10 border-mint-500/40 text-mint-400' : 'border-surface-border text-ink-muted'}`}>
                    {value === 'en' ? 'English' : 'Français'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-ink-muted">Mode</label>
              <div className="mt-2 flex gap-2">
                {(['beginner', 'professional'] as const).map(value => (
                  <button key={value} onClick={() => setMode(value)} aria-pressed={mode === value}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border ${mode === value ? 'bg-mint-500/10 border-mint-500/40 text-mint-400' : 'border-surface-border text-ink-muted'}`}>
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border flex items-center gap-3">
            <Wallet size={16} className="text-mint-400" />
            <div>
              <h2 className="text-sm font-bold text-ink-primary">Wallet</h2>
              <p className="text-xs text-ink-muted mt-1">Non-custodial connection. VitalOS never receives your private key.</p>
            </div>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              {walletConnected ? (
                <>
                  <p className="text-xs font-bold text-mint-400 flex items-center gap-1.5"><CheckCircle2 size={13} /> Connected</p>
                  <p className="font-mono text-xs text-ink-muted mt-1 truncate">{walletAddress}</p>
                </>
              ) : (
                <p className="text-xs text-ink-muted">No wallet connected.</p>
              )}
            </div>
            <button onClick={walletConnected ? disconnectWallet : connectWallet}
              className="shrink-0 px-4 py-2 rounded-xl bg-mint-500 text-surface-base text-xs font-bold hover:bg-mint-400">
              {walletConnected ? 'Disconnect' : 'Connect wallet'}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border">
            <h2 className="text-sm font-bold text-ink-primary">Onboarding</h2>
            <p className="text-xs text-ink-muted mt-1">Restart the initial capital-profile setup on this device.</p>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <p className="text-xs text-ink-secondary">Your saved interface preferences remain intact.</p>
            <button onClick={() => { resetOnboarding(); setResetNotice(true) }}
              className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-border text-xs font-semibold text-ink-secondary hover:text-ink-primary hover:bg-surface-muted">
              <RotateCcw size={13} /> Restart
            </button>
          </div>
          {resetNotice && <p className="px-5 pb-4 text-[11px] text-mint-400">Reloading onboarding…</p>}
        </section>

        <div className="flex items-start gap-2 px-1 pt-2 text-[10px] leading-relaxed text-ink-muted">
          <ShieldCheck size={13} className="shrink-0 mt-0.5 text-mint-400" />
          <p>VitalOS is a non-custodial intelligence interface. Investment outcomes are not guaranteed. Live opportunities and simulated examples must remain clearly distinguished.</p>
        </div>
      </div>
    </div>
  )
}
