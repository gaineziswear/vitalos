import { cn, riskColor } from '../../lib/utils'

interface Props {
  score: number       // 0-100
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
  className?: string
}

export function RiskMeter({ score, label, size = 'md', showScore = true, className }: Props) {
  const color = riskColor(score)
  const h = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2.5' : 'h-1.5'
  const textSz = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {(label || showScore) && (
        <div className="flex items-center justify-between">
          {label && <span className={cn('text-ink-secondary font-medium', textSz)}>{label}</span>}
          {showScore && (
            <span className={cn('font-bold tabular', textSz)} style={{ color }}>{score}</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-surface-muted rounded-full overflow-hidden', h)}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
          role="meter"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ?? 'Risk score'}
        />
      </div>
    </div>
  )
}
