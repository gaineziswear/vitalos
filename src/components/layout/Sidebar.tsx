import { useApp, type Screen } from '../../lib/app-context'
import { useT } from '../../lib/i18n'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, Search, Briefcase, Zap, FlaskConical,
  Shield, Fingerprint, Settings, AlertTriangle, Activity,
} from 'lucide-react'
import type { GuardAlert } from '../../types/yieldos'

interface Props { alerts: GuardAlert[] }

interface NavItem {
  id: Screen
  icon: React.ReactNode
  label: string
  badge?: number
  section?: string
}

// ── VitalOS logo mark ───────────────────────────────────────────────────────
function VitalMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#0dbf86" />
      <path d="M7 8.5L11.5 19.5L14 13.5L16.5 19.5L21 8.5" stroke="#080b0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="14" r="2" fill="#080b0b" fillOpacity="0.3"/>
    </svg>
  )
}

export function Sidebar({ alerts }: Props) {
  const { screen, setScreen, mode, setMode, lang, setLang, walletConnected, walletAddress, connectWallet } = useApp()
  const { t } = useT()

  const activeAlerts = alerts.filter(a => a.incidentStatus !== 'RESOLVED').length

  const navItems: NavItem[] = [
    { id: 'overview',  icon: <LayoutDashboard size={16} />, label: t.nav.overview,    section: 'CAPITAL' },
    { id: 'portfolio', icon: <Briefcase size={16} />,       label: t.nav.portfolio },
    { id: 'discover',  icon: <Search size={16} />,          label: t.nav.discover },
    { id: 'optimise',  icon: <Zap size={16} />,             label: t.nav.optimise },
    { id: 'scenario',  icon: <FlaskConical size={16} />,    label: t.nav.scenarioLab, section: 'INTELLIGENCE' },
    { id: 'guard',     icon: <Shield size={16} />,          label: t.nav.yieldGuard,  badge: activeAlerts || undefined },
    { id: 'passport',  icon: <Fingerprint size={16} />,     label: t.nav.passport },
    { id: 'mandate',   icon: <Settings size={16} />,        label: 'Capital Mandate', section: 'SETTINGS' },
  ]



  return (
    <aside
      className="hidden lg:flex flex-col w-60 shrink-0 border-r border-surface-border h-screen sticky top-0 z-30"
      style={{ background: 'linear-gradient(180deg, #0e1212 0%, #080b0b 100%)' }}
    >
      {/* ── Logo ── */}
      <div className="px-5 pt-6 pb-5 border-b border-surface-border">
        <div className="flex items-center gap-3 mb-1">
          <VitalMark size={30} />
          <div>
            <p className="font-display font-extrabold text-ink-primary tracking-tight text-[15px] leading-none">VitalOS</p>
            <p className="text-[9px] text-ink-muted uppercase tracking-widest font-semibold mt-0.5">Capital OS</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-none" aria-label="Main navigation">
        <div className="space-y-5">
          {navItems.reduce<{ section: string | undefined; items: NavItem[] }[]>((groups, item) => {
            if (item.section) {
              groups.push({ section: item.section, items: [item] })
            } else {
              const last = groups[groups.length - 1]
              if (last) last.items.push(item)
              else groups.push({ section: undefined, items: [item] })
            }
            return groups
          }, []).map((group, gi) => (
            <div key={gi}>
              {group.section && (
                <p className="section-label px-3 mb-2">{group.section}</p>
              )}
              <ul className="space-y-0.5" role="list">
                {group.items.map(item => {
                  const active = screen === item.id
                  return (
                    <li key={item.id} className="relative">
                      {active && <span className="nav-active-bar" aria-hidden="true" />}
                      <button
                        onClick={() => setScreen(item.id)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-100',
                          active
                            ? 'bg-mint-500/8 text-ink-primary'
                            : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-muted',
                        )}
                      >
                        <span className={cn('shrink-0 transition-colors', active ? 'text-mint-400' : 'text-ink-muted')}>
                          {item.icon}
                        </span>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge ? (
                          <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold flex items-center justify-center border border-amber-500/25">
                            {item.badge}
                          </span>
                        ) : active ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-mint-500 opacity-80" aria-hidden="true" />
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* ── Bottom panel ── */}
      <div className="px-3 pb-5 pt-4 space-y-2.5 border-t border-surface-border">
        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-surface-muted rounded-lg p-1" role="group" aria-label="Display mode">
          {(['beginner', 'professional'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                'flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all capitalize',
                mode === m
                  ? 'bg-surface-overlay text-ink-primary shadow-card-xs'
                  : 'text-ink-muted hover:text-ink-secondary',
              )}
            >
              {m === 'beginner' ? t.nav.beginner : t.nav.professional}
            </button>
          ))}
        </div>

        {/* Lang toggle */}
        <div className="flex items-center gap-1 bg-surface-muted rounded-lg p-1" role="group" aria-label="Language">
          {(['en', 'fr'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={cn(
                'flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all uppercase tracking-widest',
                lang === l
                  ? 'bg-surface-overlay text-ink-primary shadow-card-xs'
                  : 'text-ink-muted hover:text-ink-secondary',
              )}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Wallet state */}
        {walletConnected ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-mint-500/6 border border-mint-500/15">
            <span className="w-2 h-2 rounded-full bg-mint-500 glow-pulse shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[9px] text-ink-muted uppercase tracking-widest font-semibold mb-0.5">Connected</p>
              <p className="text-xs text-ink-secondary font-mono truncate">{walletAddress}</p>
            </div>
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-primary w-full text-xs py-2.5">
            {t.nav.connectWallet}
          </button>
        )}

        {/* Alert banner */}
        {activeAlerts > 0 && (
          <button
            onClick={() => setScreen('guard')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/18 text-amber-400 text-xs font-semibold hover:bg-amber-500/12 transition-colors"
          >
            <Activity size={12} className="shrink-0" />
            <span>{activeAlerts} active alert{activeAlerts > 1 ? 's' : ''}</span>
            <AlertTriangle size={11} className="ml-auto opacity-70" />
          </button>
        )}
      </div>
    </aside>
  )
}
