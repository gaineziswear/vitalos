import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

interface Props {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: boolean
  className?: string
  icon?: ReactNode
}

export function StatCard({ label, value, sub, accent, className, icon }: Props) {
  return (
    <div className={cn(
      'rounded-xl border border-surface-border bg-surface-raised p-4 flex flex-col gap-1',
      accent && 'border-mint-500/30 bg-mint-500/5',
      className,
    )}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-ink-secondary tracking-wide uppercase" style={{ letterSpacing: '0.06em' }}>
          {label}
        </span>
        {icon && <span className="text-ink-muted">{icon}</span>}
      </div>
      <div className={cn(
        'tabular text-2xl font-bold font-display tracking-tight',
        accent ? 'text-mint-400' : 'text-ink-primary',
      )}>
        {value}
      </div>
      {sub && <div className="text-xs text-ink-secondary">{sub}</div>}
    </div>
  )
}
