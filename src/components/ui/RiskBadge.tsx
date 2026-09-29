import { cn, riskClass } from '../../lib/utils'
import { useT } from '../../lib/i18n'
import type { RiskLevel } from '../../types/yieldos'

interface Props {
  level: RiskLevel
  score?: number
  size?: 'sm' | 'md'
  showScore?: boolean
}

const SHAPES: Record<string, string> = {
  low:      '▲',
  moderate: '◆',
  high:     '■',
  critical: '●',
}

export function RiskBadge({ level, score, size = 'md', showScore = false }: Props) {
  const { t } = useT()
  const base = size === 'sm' ? 'text-[10px] px-1.5 py-0.5 gap-1' : 'text-xs px-2 py-1 gap-1.5'
  return (
    <span className={cn('inline-flex items-center rounded font-semibold', riskClass(level), base)}>
      <span aria-hidden="true">{SHAPES[level]}</span>
      <span>{t.common.riskLevels[level]}</span>
      {showScore && score !== undefined && (
        <span className="tabular opacity-70">({score})</span>
      )}
    </span>
  )
}
