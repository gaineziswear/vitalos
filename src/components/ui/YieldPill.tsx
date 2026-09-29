import { cn } from '../../lib/utils'
import type { YieldDNA } from '../../types/yieldos'

interface Props {
  dna: YieldDNA
  size?: 'sm' | 'md'
}

const DEP_COLOR: Record<string, string> = {
  LOW:      'text-mint-400 bg-mint-500/10',
  MEDIUM:   'text-amber-400 bg-amber-500/10',
  HIGH:     'text-orange-400 bg-orange-500/10',
  CRITICAL: 'text-red-400 bg-red-500/10',
}

export function YieldPill({ dna, size = 'md' }: Props) {
  const net = dna.estimatedNetYield
  const gross = dna.grossYield
  const dep = dna.breakdown.incentiveDependency

  const textSize = size === 'sm' ? 'text-[11px]' : 'text-sm'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-1.5">
        <span className={cn('font-display font-bold text-ink-primary tabular', size === 'sm' ? 'text-base' : 'text-xl')}>
          {net.toFixed(2)}%
        </span>
        <span className={cn('text-ink-muted', textSize)}>net</span>
        {gross !== net && (
          <span className={cn('text-ink-muted line-through', textSize)}>{gross.toFixed(1)}%</span>
        )}
      </div>
      {dna.breakdown.tokenIncentives > 0 && (
        <span className={cn('inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold', textSize === 'text-sm' ? 'text-[11px]' : 'text-[10px]', DEP_COLOR[dep])}>
          <span>Incentive dep: {dep}</span>
        </span>
      )}
    </div>
  )
}
