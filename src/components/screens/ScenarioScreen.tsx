import { useState } from 'react'
import { useT } from '../../lib/i18n'
import { DEMO_PORTFOLIO, SCENARIO_PRESETS } from '../../lib/demo-data'
import { fmtUsd, fmtPct, cn } from '../../lib/utils'
import { DemoBadge } from '../ui/DemoBadge'
import { FlaskConical, Play, AlertTriangle, Info } from 'lucide-react'
import type { ScenarioConfig, ScenarioResult } from '../../types/yieldos'

function runScenario(config: ScenarioConfig): ScenarioResult {
  const p = DEMO_PORTFOLIO
  let impactPct = 0

  switch (config.type) {
    case 'price_drop':
      impactPct = -((config.params.dropPct as number) / 100) * 0.35
      break
    case 'depeg':
      impactPct = -((config.params.depegPct as number) / 100) * 0.6
      break
    case 'tvl_collapse':
      impactPct = -((config.params.dropPct as number) / 100) * 0.15
      break
    case 'gas_spike':
      impactPct = -0.002
      break
    case 'liquidity_drop':
      impactPct = -((config.params.dropPct as number) / 100) * 0.04
      break
    case 'yield_drop':
      impactPct = 0
      break
    case 'bridge_failure':
      impactPct = -0.144
      break
    case 'oracle_failure':
      impactPct = -0.05
      break
    default:
      impactPct = -0.1
  }

  const impactUsd = p.totalUsd * impactPct

  return {
    scenarioId: config.id,
    portfolioImpactUsd: impactUsd,
    portfolioImpactPct: impactPct * 100,
    affectedPositions: p.positions.slice(0, 2).map(pos => ({
      positionId: pos.id,
      protocol: pos.protocol,
      asset: pos.asset,
      impactUsd: pos.usdValue * impactPct,
      impactPct: impactPct * 100,
      canExit: pos.positionType !== 'lp',
      exitCostUsd: pos.yieldDNA?.gasCost ?? 4,
    })),
    liquidityImpact: config.type === 'liquidity_drop' ? -(config.params.dropPct as number) : 0,
    riskBudgetImpact: 8,
    estimatedExitCostUsd: 28,
    isSimulation: true,
    simulatedAt: Date.now(),
  }
}

export function ScenarioScreen() {
  const { t } = useT()
  const [selected, setSelected] = useState<ScenarioConfig | null>(null)
  const [result, setResult] = useState<ScenarioResult | null>(null)

  function run(config: ScenarioConfig) {
    setSelected(config)
    setResult(runScenario(config))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 lg:pb-8 space-y-5">
      <DemoBadge />

      <div className="flex items-center gap-3">
        <FlaskConical size={20} className="text-mint-400" />
        <div>
          <h1 className="font-display text-xl font-bold text-ink-primary tracking-tight">{t.scenarioLab.title}</h1>
          <p className="text-xs text-ink-secondary mt-0.5">{t.scenarioLab.sub}</p>
        </div>
      </div>

      {/* Simulation disclaimer */}
      <div className="flex items-start gap-2 bg-amber-500/8 rounded-xl p-3 border border-amber-500/20">
        <AlertTriangle size={13} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-300">
          {t.scenarioLab.disclaimer}
        </p>
      </div>

      {/* Presets grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SCENARIO_PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => run(preset)}
            className={cn(
              'p-3 rounded-xl border text-left transition-all',
              selected?.id === preset.id
                ? 'bg-mint-500/10 border-mint-500/30 text-mint-300'
                : 'bg-surface-raised border-surface-border text-ink-secondary hover:border-ink-muted hover:text-ink-primary',
            )}
          >
            <Play size={12} className="mb-1.5 opacity-60" />
            <p className="text-xs font-semibold">{preset.name}</p>
          </button>
        ))}
      </div>

      {/* Result */}
      {result && selected && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-mint-500 glow-pulse" />
            <p className="text-xs text-mint-400 font-semibold uppercase tracking-wider">Scenario: {selected.name}</p>
          </div>

          {/* Impact summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Portfolio Impact', value: `${result.portfolioImpactUsd >= 0 ? '+' : ''}${fmtUsd(result.portfolioImpactUsd)}`, neg: result.portfolioImpactUsd < 0 },
              { label: 'Impact %',         value: `${result.portfolioImpactPct >= 0 ? '+' : ''}${fmtPct(result.portfolioImpactPct)}`, neg: result.portfolioImpactPct < 0 },
              { label: 'Exit Cost',        value: fmtUsd(result.estimatedExitCostUsd), neg: false },
              { label: 'Risk Budget +',    value: `+${result.riskBudgetImpact}%`, neg: true },
            ].map(s => (
              <div key={s.label} className="bg-surface-raised rounded-xl p-3 border border-surface-border">
                <p className="text-[10px] text-ink-muted uppercase tracking-widest font-semibold">{s.label}</p>
                <p className={cn('font-display text-base font-bold tabular mt-1', s.neg ? 'text-red-400' : 'text-mint-400')}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Affected positions */}
          <div className="bg-surface-raised rounded-xl p-4 border border-surface-border">
            <p className="text-xs font-semibold text-ink-primary mb-3">Affected Positions</p>
            <div className="space-y-2">
              {result.affectedPositions.map(pos => (
                <div key={pos.positionId} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-ink-secondary font-medium">{pos.asset} · {pos.protocol}</p>
                    <p className="text-[11px] text-ink-muted">
                      Exit: {pos.canExit ? 'Available' : 'Restricted'} · Est. cost: {fmtUsd(pos.exitCostUsd)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn('font-bold tabular', pos.impactUsd < 0 ? 'text-red-400' : 'text-mint-400')}>
                      {pos.impactUsd >= 0 ? '+' : ''}{fmtUsd(pos.impactUsd)}
                    </p>
                    <p className="text-[10px] text-ink-muted tabular">{fmtPct(pos.impactPct, 1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-surface-raised rounded-xl p-4 border border-surface-border">
            <Info size={13} className="text-ink-muted mt-0.5 shrink-0" />
            <p className="text-xs text-ink-muted">
              This simulation uses simplified models. Real outcomes depend on market conditions, execution timing, gas, slippage, protocol behaviour, and many other factors. Historical simulation does not predict future performance. All values are estimates.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
