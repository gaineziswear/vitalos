import { useApp, type Screen } from '../../lib/app-context'
import { useT } from '../../lib/i18n'
import { cn } from '../../lib/utils'
import { LayoutDashboard, Search, Briefcase, Shield, Fingerprint, Radio } from 'lucide-react'
import type { GuardAlert } from '../../types/yieldos'

interface Props {
  alerts: GuardAlert[]
}

export function MobileNav({ alerts }: Props) {
  const { screen, setScreen } = useApp()
  const { t } = useT()
  const activeAlerts = alerts.filter(a => a.incidentStatus !== 'RESOLVED').length

  const tabs: { id: Screen; icon: React.ReactNode; label: string; badge?: number }[] = [
    { id: 'broadcast', icon: <Radio size={20} />,          label: 'Live' },
    { id: 'overview',  icon: <LayoutDashboard size={20} />, label: t.nav.overview },
    { id: 'discover',  icon: <Search size={20} />,          label: t.nav.discover },
    { id: 'portfolio', icon: <Briefcase size={20} />,       label: t.nav.portfolio },
    { id: 'guard',     icon: <Shield size={20} />,          label: t.nav.yieldGuard, badge: activeAlerts || undefined },
    { id: 'passport',  icon: <Fingerprint size={20} />,     label: t.nav.passport },
  ]

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-raised/90 backdrop-blur border-t border-surface-border"
    >
      <ul className="flex items-stretch" role="list">
        {tabs.map(tab => (
          <li key={tab.id} className="flex-1">
            <button
              onClick={() => setScreen(tab.id)}
              aria-current={screen === tab.id ? 'page' : undefined}
              className={cn(
                'relative w-full flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold tracking-wide transition-colors min-h-[56px]',
                screen === tab.id ? 'text-mint-400' : 'text-ink-muted',
              )}
            >
              {tab.badge ? (
                <span className="absolute top-1.5 right-1/4 w-4 h-4 rounded-full bg-amber-500 text-surface-base text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
              {tab.icon}
              <span className="uppercase tracking-widest">{tab.label}</span>
              {screen === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-mint-500" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
