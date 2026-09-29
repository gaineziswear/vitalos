import { timeAgo } from '../../lib/utils'
import type { DataMeta } from '../../types/yieldos'
import { cn } from '../../lib/utils'

interface Props {
  meta: DataMeta
  className?: string
  /** Pass Date.now() from the parent — avoids calling impure functions inside render */
  now?: number
}

export function DataFreshness({ meta, className, now = 0 }: Props) {
  const age = now > 0 ? now - meta.timestamp : 0
  const stale = age > 300_000 // > 5 min = stale
  const confColor = meta.confidence === 'high' ? 'text-mint-400' : meta.confidence === 'medium' ? 'text-amber-400' : 'text-ink-muted'

  return (
    <div className={cn('flex items-center gap-1.5 text-[10px] text-ink-muted', className)}>
      {meta.isDemo && (
        <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold tracking-wider uppercase">
          DEMO
        </span>
      )}
      {now > 0 && (
        <span className={cn(stale ? 'text-orange-400' : '')}>
          {stale ? 'Data delayed' : `Updated ${timeAgo(meta.timestamp)} ago`}
        </span>
      )}
      <span className={cn('uppercase tracking-widest font-semibold', confColor)}>
        {meta.confidence}
      </span>
    </div>
  )
}
