import { useState } from 'react'
import { useT } from '../../lib/i18n'
import { DEMO_ALERTS } from '../../lib/demo-data'
import { fmtUsd, cn, timeAgo } from '../../lib/utils'
import { DemoBadge } from '../ui/DemoBadge'
import { Shield, AlertTriangle, TrendingDown, CheckCircle, X } from 'lucide-react'
import type { GuardAlert } from '../../types/yieldos'

const SEVERITY_ICON: Record<string, React.ReactNode> = {
  critical: <AlertTriangle size={14} className="text-red-400" />,
  high:     <AlertTriangle size={14} className="text-orange-400" />,
  moderate: <TrendingDown size={14} className="text-amber-400" />,
  low:      <Shield size={14} className="text-mint-400" />,
}

const STATUS_COLOR: Record<string, string> = {
  DETECTED:     'bg-red-500/10 text-red-400 border-red-500/20',
  INVESTIGATING:'bg-amber-500/10 text-amber-400 border-amber-500/20',
  CONFIRMED:    'bg-orange-500/10 text-orange-400 border-orange-500/20',
  MITIGATION:   'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  RESOLVED:     'bg-mint-500/10 text-mint-400 border-mint-500/20',
}

export function GuardScreen() {
  const { t } = useT()
  const [alerts, setAlerts] = useState<GuardAlert[]>(DEMO_ALERTS)
  const [selected, setSelected] = useState<GuardAlert | null>(null)

  const active   = alerts.filter(a => a.incidentStatus !== 'RESOLVED')
  const resolved = alerts.filter(a => a.incidentStatus === 'RESOLVED')

  function dismiss(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, incidentStatus: 'RESOLVED' as const } : a))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 lg:pb-8 space-y-5">
      <DemoBadge />

      <div className="flex items-center gap-3">
        <Shield size={20} className="text-mint-400" />
        <div>
          <h1 className="font-display text-xl font-bold text-ink-primary tracking-tight">{t.yieldGuard.title}</h1>
          <p className="text-xs text-ink-secondary mt-0.5">{t.yieldGuard.sub}</p>
        </div>
      </div>

      {/* System status */}
      <div className="bg-surface-raised rounded-xl p-4 border border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-mint-500 glow-pulse" />
          <p className="text-sm font-semibold text-ink-primary">Yield Guard Active</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-ink-muted">
          <span>{active.length} active alert{active.length !== 1 ? 's' : ''}</span>
          <span>Monitoring {DEMO_ALERTS.length > 0 ? '4' : '0'} positions</span>
        </div>
      </div>

      {/* Active alerts */}
      {active.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle size={28} className="mx-auto mb-2 text-mint-400 opacity-60" />
          <p className="text-sm font-medium text-ink-primary">No active alerts</p>
          <p className="text-xs text-ink-muted mt-1">Yield Guard is monitoring your positions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-ink-secondary font-semibold uppercase tracking-widest">{t.yieldGuard.alert}s</p>
          {active.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSelect={() => setSelected(alert)}
              onDismiss={() => dismiss(alert.id)}
              selected={selected?.id === alert.id}
            />
          ))}
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-ink-muted font-semibold uppercase tracking-widest">Resolved</p>
          {resolved.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSelect={() => {}}
              onDismiss={() => {}}
              selected={false}
              muted
            />
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full sm:max-w-lg bg-surface-overlay rounded-t-2xl sm:rounded-2xl border border-surface-border overflow-y-auto max-h-[80dvh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-8 h-1 rounded-full bg-surface-border" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    {SEVERITY_ICON[selected.severity]}
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-semibold uppercase tracking-widest', STATUS_COLOR[selected.incidentStatus])}>
                      {selected.incidentStatus}
                    </span>
                  </div>
                  <h2 className="font-display text-base font-bold text-ink-primary mt-1">{selected.title}</h2>
                  <p className="text-xs text-ink-muted">{selected.protocol} · {selected.chain}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-ink-muted p-1">
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-ink-secondary mb-4 leading-relaxed">{selected.body}</p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Exposure',    value: fmtUsd(selected.exposureUsd) },
                  { label: 'Est. Exit',   value: fmtUsd(selected.estimatedExitUsd) },
                  { label: 'Exit Cost',   value: fmtUsd(selected.exitCostUsd) },
                ].map(s => (
                  <div key={s.label} className="bg-surface-raised rounded-lg p-2 border border-surface-border text-center">
                    <p className="text-[10px] text-ink-muted">{s.label}</p>
                    <p className="text-sm font-bold text-ink-primary tabular mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-ink-muted mb-3">
                Detected {timeAgo(selected.detectedAt)} ago · Updated {timeAgo(selected.updatedAt)} ago
              </p>

              <div className="flex flex-wrap gap-2">
                {selected.actions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => { if (action.type === 'dismiss') dismiss(selected.id) }}
                    className={cn(
                      'px-3 py-2 rounded-lg text-xs font-semibold border transition-colors',
                      action.type === 'dismiss'
                        ? 'border-surface-border text-ink-muted hover:text-ink-primary'
                        : action.type === 'simulate_exit'
                          ? 'bg-mint-500/10 border-mint-500/20 text-mint-400 hover:bg-mint-500/20'
                          : 'bg-surface-raised border-surface-border text-ink-secondary hover:text-ink-primary',
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-amber-400 mt-3 flex items-center gap-1">
                <AlertTriangle size={10} />
                VitalOS will never automatically exit positions. All actions require your explicit confirmation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AlertCard({
  alert, onSelect, onDismiss, selected, muted,
}: {
  alert: GuardAlert
  onSelect: () => void
  onDismiss: () => void
  selected: boolean
  muted?: boolean
}) {
  return (
    <div className={cn(
      'bg-surface-raised rounded-xl p-4 border transition-all',
      selected ? 'border-mint-500/40' : 'border-surface-border',
      muted ? 'opacity-50' : '',
    )}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{SEVERITY_ICON[alert.severity]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="text-sm font-semibold text-ink-primary">{alert.title}</p>
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-semibold uppercase tracking-widest', STATUS_COLOR[alert.incidentStatus])}>
              {alert.incidentStatus}
            </span>
          </div>
          <p className="text-xs text-ink-muted">{alert.protocol} · {fmtUsd(alert.exposureUsd)} exposure</p>
          <p className="text-[10px] text-ink-muted mt-1">{timeAgo(alert.detectedAt)} ago</p>
        </div>
        {!muted && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onSelect} className="text-xs text-mint-400 px-2 py-1 rounded hover:bg-mint-500/10">View</button>
            <button onClick={onDismiss} className="text-ink-muted hover:text-ink-primary p-1">
              <X size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
