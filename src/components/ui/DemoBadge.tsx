import { AlertTriangle } from 'lucide-react'
import { useT } from '../../lib/i18n'

export function DemoBadge({ inline = false }: { inline?: boolean }) {
  const { t } = useT()
  if (inline) {
    return <span className="demo-badge"><AlertTriangle size={10} />{t.common.demo}</span>
  }
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/8 px-4 py-2.5 text-xs text-amber-400">
      <AlertTriangle size={14} className="shrink-0" />
      <span>{t.disclosures.demoData}</span>
    </div>
  )
}
