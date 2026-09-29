import { useState } from 'react'
import { useT } from '../../lib/i18n'
import { DEMO_MANDATE, DEMO_RISK_BUDGET } from '../../lib/demo-data'
import { cn } from '../../lib/utils'
import { DemoBadge } from '../ui/DemoBadge'
import { RiskMeter } from '../ui/RiskMeter'
import { Settings, Shield, CheckCircle } from 'lucide-react'
import type { CapitalMandate } from '../../types/yieldos'

type Tab = 'mandate' | 'risk'

export function MandateScreen() {
  const { t } = useT()
  const [tab, setTab] = useState<Tab>('mandate')
  const [mandate, setMandate] = useState<CapitalMandate>(DEMO_MANDATE)
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const objectives = [
    { id: 'preserve', label: t.onboarding.preserve },
    { id: 'income',   label: t.onboarding.income },
    { id: 'growth',   label: t.onboarding.growth },
    { id: 'explore',  label: t.onboarding.explore },
  ] as const

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 lg:pb-8 space-y-5">
      <DemoBadge />

      <div className="flex items-center gap-3">
        <Settings size={20} className="text-mint-400" />
        <div>
          <h1 className="font-display text-xl font-bold text-ink-primary tracking-tight">Capital Mandate</h1>
          <p className="text-xs text-ink-secondary mt-0.5">Define what VitalOS is allowed to consider on your behalf.</p>
        </div>
      </div>

      <div className="flex gap-1 bg-surface-muted rounded-xl p-1">
        {(['mandate', 'risk'] as Tab[]).map(t_ => (
          <button
            key={t_}
            onClick={() => setTab(t_)}
            className={cn(
              'flex-1 py-2 text-xs font-semibold rounded-lg transition-colors capitalize',
              tab === t_ ? 'bg-surface-overlay text-ink-primary' : 'text-ink-muted hover:text-ink-secondary',
            )}
          >
            {t_ === 'mandate' ? 'Capital Mandate' : 'Risk Budget'}
          </button>
        ))}
      </div>

      {tab === 'mandate' && (
        <div className="space-y-4">
          {/* Objective */}
          <div className="bg-surface-raised rounded-xl p-4 border border-surface-border">
            <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest mb-3">Objective</p>
            <div className="grid grid-cols-2 gap-2">
              {objectives.map(o => (
                <button
                  key={o.id}
                  onClick={() => setMandate(m => ({ ...m, objective: o.id }))}
                  className={cn(
                    'px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left',
                    mandate.objective === o.id
                      ? 'bg-mint-500/10 border-mint-500/30 text-mint-300'
                      : 'bg-surface-overlay border-surface-border text-ink-secondary hover:text-ink-primary',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-surface-raised rounded-xl p-4 border border-surface-border space-y-4">
            <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">Constraints</p>
            {[
              { key: 'maxProtocolExposure',  label: 'Max Protocol Exposure',    unit: '%' },
              { key: 'maxChainExposure',     label: 'Max Chain Exposure',       unit: '%' },
              { key: 'maxIlliquidCapital',   label: 'Max Illiquid Capital',     unit: '%' },
              { key: 'maxLeverage',          label: 'Max Leverage',             unit: '%' },
              { key: 'experimentalProtocols',label: 'Experimental Protocols',   unit: '%' },
              { key: 'minLiquidity',         label: 'Min Liquidity',            unit: '%' },
              { key: 'minNetYieldImprovement',label: 'Min Yield Improvement',   unit: '%' },
            ].map(s => (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-ink-secondary" htmlFor={s.key}>{s.label}</label>
                  <span className="text-xs font-bold tabular text-mint-400">
                    {mandate[s.key as keyof CapitalMandate] as number}{s.unit}
                  </span>
                </div>
                <input
                  id={s.key}
                  type="range"
                  min={0}
                  max={s.key === 'minNetYieldImprovement' ? 5 : 100}
                  step={s.key === 'minNetYieldImprovement' ? 0.1 : 1}
                  value={mandate[s.key as keyof CapitalMandate] as number}
                  onChange={e => setMandate(m => ({ ...m, [s.key]: Number(e.target.value) }))}
                  className="w-full accent-mint-500"
                />
              </div>
            ))}
          </div>

          <button
            onClick={save}
            className="w-full py-3 rounded-xl bg-mint-500 text-surface-base text-sm font-bold hover:bg-mint-400 transition-colors flex items-center justify-center gap-2"
          >
            {saved ? <CheckCircle size={14} /> : <Settings size={14} />}
            {saved ? 'Saved' : 'Save Mandate'}
          </button>
        </div>
      )}

      {tab === 'risk' && (
        <div className="space-y-4">
          <div className="bg-surface-raised rounded-xl p-4 border border-surface-border">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-amber-400" />
              <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">Risk Budget Usage</p>
            </div>
            <RiskMeter score={DEMO_RISK_BUDGET.currentUsage.overall} label="Overall budget used" size="md" />
            <p className="text-xs text-ink-muted mt-2">{DEMO_RISK_BUDGET.currentUsage.overall}% of total risk budget allocated.</p>
          </div>

          <div className="bg-surface-raised rounded-xl p-4 border border-surface-border space-y-3">
            <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">Risk Dimensions</p>
            {[
              { key: 'smartContract', label: 'Smart Contract',  max: DEMO_RISK_BUDGET.maxSmartContractRisk, used: DEMO_RISK_BUDGET.currentUsage.smartContract },
              { key: 'market',       label: 'Market',           max: DEMO_RISK_BUDGET.maxMarketRisk,        used: DEMO_RISK_BUDGET.currentUsage.market },
              { key: 'liquidity',    label: 'Liquidity',        max: DEMO_RISK_BUDGET.maxLiquidityRisk,     used: DEMO_RISK_BUDGET.currentUsage.liquidity },
              { key: 'stablecoin',   label: 'Stablecoin',       max: DEMO_RISK_BUDGET.maxStablecoinRisk,    used: DEMO_RISK_BUDGET.currentUsage.stablecoin },
              { key: 'oracle',       label: 'Oracle',           max: DEMO_RISK_BUDGET.maxOracleRisk,        used: DEMO_RISK_BUDGET.currentUsage.oracle },
              { key: 'governance',   label: 'Governance',       max: DEMO_RISK_BUDGET.maxGovernanceRisk,    used: DEMO_RISK_BUDGET.currentUsage.governance },
              { key: 'bridge',       label: 'Bridge',           max: DEMO_RISK_BUDGET.maxBridgeRisk,        used: DEMO_RISK_BUDGET.currentUsage.bridge },
            ].map(dim => (
              <div key={dim.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-ink-secondary">{dim.label}</span>
                  <span className="text-[11px] text-ink-muted tabular">{dim.used} / {dim.max}</span>
                </div>
                <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(dim.used / dim.max) * 100}%`,
                      backgroundColor: (dim.used / dim.max) > 0.8 ? '#f97316' : (dim.used / dim.max) > 0.6 ? '#f59e0b' : '#10bf84',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
