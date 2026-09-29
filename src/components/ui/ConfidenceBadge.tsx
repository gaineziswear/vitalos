import { cn, confClass } from '../../lib/utils'
import { useT } from '../../lib/i18n'
import type { DataConfidence } from '../../types/yieldos'

interface Props {
  confidence: DataConfidence
  provider?: string
  updatedAgo?: string
}

export function ConfidenceBadge({ confidence, provider, updatedAgo }: Props) {
  const { t } = useT()
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-semibold', confClass(confidence))}>
      <span>{t.common.confidence}: {t.common[confidence]}</span>
      {provider && <span className="opacity-60">· {provider}</span>}
      {updatedAgo && <span className="opacity-60">· {t.common.updated} {updatedAgo} {t.common.ago}</span>}
    </span>
  )
}
