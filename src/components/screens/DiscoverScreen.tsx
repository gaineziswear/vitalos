import { useState, useMemo } from 'react'
import { useT } from '../../lib/i18n'
import { useApp } from '../../lib/app-context'
import { fmtUsd, fmtCompact, lockupLabel, cn } from '../../lib/utils'
import { RiskBadge } from '../ui/RiskBadge'
import { YieldPill } from '../ui/YieldPill'
import { DataFreshness } from '../ui/DataFreshness'
import { DemoBadge } from '../ui/DemoBadge'
import { RiskMeter } from '../ui/RiskMeter'
import { useOpportunities } from '../../hooks/useOpportunities'
import { Filter, AlertCircle, ChevronRight, BarChart2, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import type { Opportunity } from '../../types/yieldos'

type FilterKey = 'all' | 'lending' | 'lp' | 'staking' | 'liquid_staking' | 'vault' | 'fixed_rate'

export function DiscoverScreen() {
  const { mode } = useApp()
  const { t } = useT()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [maxRisk, setMaxRisk] = useState(80)
  const [minNet] = useState(0)
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  const {
    opportunities, dataMode, freshnessLabel: freshLabel,
    count, error, refetch,
  } = useOpportunities({ minTvl: 1_000_000, limit: 200 })

  const filters: { id: FilterKey; label: string }[] = [
    { id: 'all',            label: 'All' },
    { id: 'lending',        label: 'Lending' },
    { id: 'lp',             label: 'LP' },
    { id: 'liquid_staking', label: 'Staking' },
    { id: 'vault',          label: 'Vault' },
    { id: 'fixed_rate',     label: 'Fixed Rate' },
  ]

  const filtered = useMemo(() =>
    opportunities.filter(o =>
      (filter === 'all' || o.strategyType === filter) &&
      o.risk.overall <= maxRisk &&
      o.yieldDNA.estimatedNetYield >= minNet,
    ).sort((a, b) => b.yieldDNA.estimatedNetYield - a.yieldDNA.estimatedNetYield),
    [opportunities, filter, maxRisk, minNet],
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 lg:pb-8">
      {/* ── Data source status bar ── */}
      {dataMode === 'demo' && <DemoBadge />}
      {dataMode === 'live' && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-mint-500/6 border border-mint-500/15">
          <Wifi size={12} className="text-mint-400 shrink-0" />
          <span className="text-[11px] text-ink-secondary">
            Live data · DeFiLlama · {count.toLocaleString()} pools · {freshLabel}
          </span>
          <button onClick={refetch} className="ml-auto text-ink-muted hover:text-ink-primary transition-colors" aria-label="Refresh">
            <RefreshCw size={11} />
          </button>
        </div>
      )}
      {dataMode === 'loading' && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-surface-raised border border-surface-border">
          <RefreshCw size={12} className="text-ink-muted shrink-0 animate-spin" />
          <span className="text-[11px] text-ink-muted">Fetching live opportunities from DeFiLlama…</span>
        </div>
      )}
      {dataMode === 'error' && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-amber-500/6 border border-amber-500/20">
          <WifiOff size={12} className="text-amber-400 shrink-0" />
          <span className="text-[11px] text-amber-300">Live data unavailable — showing demo data. {error ?? ''}</span>
          <button onClick={refetch} className="ml-auto text-amber-400 hover:text-amber-300 transition-colors text-[11px] font-semibold">
            Retry
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-5 mt-2">
        <div>
          <h1 className="font-display text-xl font-bold text-ink-primary tracking-tight">{t.discover.title}</h1>
          <p className="text-xs text-ink-secondary mt-0.5">{t.discover.sub}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(v => v === 'list' ? 'map' : 'list')}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
              viewMode === 'map'
                ? 'bg-mint-500/10 border-mint-500/30 text-mint-400'
                : 'bg-surface-raised border-surface-border text-ink-secondary hover:text-ink-primary',
            )}
          >
            <BarChart2 size={13} />
            {viewMode === 'map' ? 'List' : 'Map'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              filter === f.id
                ? 'bg-mint-500 text-surface-base'
                : 'bg-surface-raised border border-surface-border text-ink-secondary hover:text-ink-primary',
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised border border-surface-border">
          <Filter size={11} className="text-ink-muted" />
          <input
            type="range"
            min={0}
            max={100}
            value={maxRisk}
            onChange={e => setMaxRisk(Number(e.target.value))}
            className="w-16 accent-mint-500"
            aria-label="Maximum risk score"
          />
          <span className="text-[10px] text-ink-muted tabular">Risk ≤{maxRisk}</span>
        </div>
      </div>

      {viewMode === 'map' ? (
        <OpportunityMap opportunities={filtered} onSelect={setSelected} />
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-ink-muted">
              <AlertCircle size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">{t.common.noData}</p>
            </div>
          )}
          {filtered.map(opp => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              mode={mode}
              selected={selected?.id === opp.id}
              onSelect={() => setSelected(selected?.id === opp.id ? null : opp)}
            />
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <OpportunityDetail opp={selected} mode={mode} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

// ── Opportunity card ──────────────────────────────────────────────────────────

function OpportunityCard({
  opp, mode, selected, onSelect,
}: { opp: Opportunity; mode: string; selected: boolean; onSelect: () => void }) {
  const isMonitored = opp.status !== 'AVAILABLE' && opp.status !== 'ELIGIBLE'

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full bg-surface-raised rounded-xl border p-4 text-left transition-all',
        selected ? 'border-mint-500/50 shadow-glowSm' : 'border-surface-border hover:border-surface-muted',
        isMonitored ? 'opacity-70' : '',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-semibold text-sm text-ink-primary">{opp.protocol}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-overlay border border-surface-border text-ink-muted font-mono uppercase">
              {opp.chain}
            </span>
            {isMonitored && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">{opp.status}</span>
            )}
          </div>
          <p className="text-xs text-ink-muted">{opp.asset} · {opp.strategy}</p>
        </div>

        <div className="text-right shrink-0">
          <YieldPill dna={opp.yieldDNA} size="sm" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <RiskBadge level={opp.risk.level} size="sm" />
        <span className="text-[11px] text-ink-muted">TVL: {fmtCompact(opp.risk.liquidity.tvlUsd)}</span>
        <span className="text-[11px] text-ink-muted">Lockup: {lockupLabel(opp.yieldDNA.lockupHours)}</span>
        {mode === 'professional' && (
          <>
            <span className="text-[11px] text-ink-muted font-mono">Exit: {fmtUsd(opp.yieldDNA.exitCost)}</span>
            <span className="text-[11px] text-ink-muted">Cap: {fmtCompact(opp.yieldDNA.capacity)}</span>
          </>
        )}
        <ChevronRight size={12} className="text-ink-muted ml-auto" />
      </div>
    </button>
  )
}

// ── Opportunity detail panel ─────────────────────────────────────────────────

function OpportunityDetail({ opp, mode, onClose }: { opp: Opportunity; mode: string; onClose: () => void }) {
  const [tab, setTab] = useState<'why' | 'source' | 'risks' | 'exit'>('why')
  const bd = opp.yieldDNA.breakdown

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg bg-surface-overlay rounded-t-2xl sm:rounded-2xl border border-surface-border overflow-y-auto max-h-[85dvh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-surface-border" />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-ink-primary">{opp.protocol}</h2>
              <p className="text-xs text-ink-muted">{opp.asset} · {opp.chain} · {opp.strategy}</p>
            </div>
            <button onClick={onClose} className="text-ink-muted hover:text-ink-primary text-sm px-2 py-1 rounded">✕</button>
          </div>

          {/* Yield summary */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Advertised', value: `${bd.advertised.toFixed(2)}%`, col: 'text-ink-secondary' },
              { label: 'Est. Net',   value: `${opp.yieldDNA.estimatedNetYield.toFixed(2)}%`, col: 'text-mint-400' },
              { label: 'Sustainable',value: `${opp.yieldDNA.sustainableYield.toFixed(2)}%`,  col: 'text-cyan-400' },
            ].map(s => (
              <div key={s.label} className="bg-surface-raised rounded-lg p-3 text-center border border-surface-border">
                <p className={cn('font-display text-base font-bold tabular', s.col)}>{s.value}</p>
                <p className="text-[10px] text-ink-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Yield breakdown bar */}
          <div className="mb-4">
            <p className="text-xs text-ink-secondary font-semibold mb-2">Yield Composition</p>
            <div className="space-y-1.5">
              {[
                { label: 'Organic',       value: bd.organic,        color: 'bg-mint-500' },
                { label: 'Trading Fees',  value: bd.tradingFees,    color: 'bg-cyan-500' },
                { label: 'Staking Rwds',  value: bd.stakingRewards, color: 'bg-mint-300' },
                { label: 'Token Incent.', value: bd.tokenIncentives,color: 'bg-amber-500' },
              ].filter(r => r.value > 0).map(row => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-ink-muted w-24 shrink-0">{row.label}</span>
                  <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', row.color)} style={{ width: `${Math.min((row.value / bd.advertised) * 100, 100)}%` }} />
                  </div>
                  <span className="text-[10px] text-ink-muted tabular w-10 text-right">{row.value.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-surface-muted rounded-lg p-1">
            {([['why', 'Why?'], ['source', 'Yield Source'], ['risks', 'Risks'], ['exit', 'Exit']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-colors',
                  tab === id ? 'bg-surface-overlay text-ink-primary' : 'text-ink-muted hover:text-ink-secondary',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'why' && (
            <div className="text-sm text-ink-secondary leading-relaxed space-y-2">
              <p>This opportunity offers an estimated net yield of <strong className="text-mint-400">{opp.yieldDNA.estimatedNetYield.toFixed(2)}%</strong> after protocol fees, estimated gas, and slippage costs.</p>
              <p>The sustainable yield component — derived from organic protocol revenue and fees — is <strong className="text-cyan-400">{opp.yieldDNA.sustainableYield.toFixed(2)}%</strong>.</p>
              {bd.tokenIncentives > 0 && (
                <p className="text-amber-300">
                  <strong>{bd.tokenIncentives.toFixed(2)}%</strong> of the advertised yield comes from token incentives. Incentive dependency is rated <strong>{bd.incentiveDependency}</strong>. Token incentives can be reduced or removed at any time.
                </p>
              )}
            </div>
          )}

          {tab === 'source' && (
            <div className="text-sm text-ink-secondary leading-relaxed space-y-2">
              <p>Yield classes active on this strategy: <strong className="text-ink-primary">{opp.yieldDNA.breakdown.classes.join(', ')}</strong></p>
              <p>Protocol fees charged: {opp.yieldDNA.protocolFees.toFixed(2)}% annualised.</p>
              <p>Estimated gas cost per transaction: {fmtUsd(opp.yieldDNA.gasCost)}. Exit cost: {fmtUsd(opp.yieldDNA.exitCost)}.</p>
              {mode === 'professional' && (
                <p className="text-xs text-ink-muted font-mono">Slippage est: {opp.yieldDNA.slippage.toFixed(3)}% · Capacity: {fmtCompact(opp.yieldDNA.capacity)}</p>
              )}
              <p className="text-xs text-ink-muted">Data source: {opp.meta.provider} · Confidence: {opp.meta.confidence}</p>
            </div>
          )}

          {tab === 'risks' && (
            <div className="space-y-2">
              <RiskMeter score={opp.risk.smartContract.score} label="Smart Contract" size="sm" />
              <RiskMeter score={opp.risk.liquidity.score} label="Liquidity" size="sm" />
              <RiskMeter score={opp.risk.market.score} label="Market" size="sm" />
              <RiskMeter score={opp.risk.oracle.score} label="Oracle" size="sm" />
              <RiskMeter score={opp.risk.governance.score} label="Governance" size="sm" />
              <RiskMeter score={opp.risk.bridge.score} label="Bridge" size="sm" />
              {mode === 'professional' && (
                <div className="mt-3 text-xs text-ink-muted space-y-1 font-mono">
                  <p>Audits: {opp.risk.smartContract.auditCount} · Upgradeable: {opp.risk.smartContract.upgradeable ? 'Yes' : 'No'}</p>
                  <p>Oracle: {opp.risk.oracle.provider} · Fallback: {opp.risk.oracle.hasFallback ? 'Yes' : 'No'}</p>
                  <p>TVL 7d change: {opp.risk.liquidity.tvl7dChange > 0 ? '+' : ''}{opp.risk.liquidity.tvl7dChange.toFixed(1)}%</p>
                </div>
              )}
            </div>
          )}

          {tab === 'exit' && (
            <div className="space-y-2 text-sm text-ink-secondary">
              <p>Exit complexity: <strong className="text-ink-primary capitalize">{opp.exitAnalysis.exitComplexity}</strong></p>
              <p>Est. exit cost: <strong className="text-ink-primary">{fmtUsd(opp.exitAnalysis.estimatedGasUsd)}</strong></p>
              <p>Slippage: ~{opp.exitAnalysis.estimatedSlippage.toFixed(2)}%</p>
              {opp.exitAnalysis.lockupRemainingHours > 0 && (
                <p className="text-amber-300">Lockup remaining: {lockupLabel(opp.exitAnalysis.lockupRemainingHours)}</p>
              )}
              {!opp.exitAnalysis.clearExitPath && (
                <p className="text-orange-400 font-semibold flex items-center gap-1.5">
                  <AlertCircle size={13} /> No clear exit path — elevated risk
                </p>
              )}
              <div className="mt-2">
                <p className="text-xs font-semibold text-ink-primary mb-1">Exit steps:</p>
                <ol className="space-y-1 text-xs text-ink-muted list-decimal list-inside">
                  {opp.exitAnalysis.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            </div>
          )}

          <DataFreshness meta={opp.meta} className="mt-4" />
        </div>
      </div>
    </div>
  )
}

// ── Opportunity Map (scatter: risk vs yield) ──────────────────────────────────

function OpportunityMap({ opportunities, onSelect }: { opportunities: Opportunity[]; onSelect: (o: Opportunity) => void }) {
  const W = 100, H = 100

  return (
    <div className="bg-surface-raised rounded-2xl border border-surface-border p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">Opportunity Map</p>
        <p className="text-[10px] text-ink-muted">X = Risk · Y = Net Yield · Size = Liquidity</p>
      </div>
      <div className="relative w-full" style={{ paddingBottom: '56%' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label="Opportunity scatter map"
        >
          {/* Grid */}
          {[25, 50, 75].map(v => (
            <g key={v}>
              <line x1={v} y1={0} x2={v} y2={H} stroke="#262c2c" strokeWidth="0.3" />
              <line x1={0} y1={H - v} x2={W} y2={H - v} stroke="#262c2c" strokeWidth="0.3" />
            </g>
          ))}
          {/* Axis labels */}
          <text x={50} y={H - 1} textAnchor="middle" fill="#4d5c5c" fontSize="3.5">Risk →</text>
          <text x={2} y={50} textAnchor="middle" fill="#4d5c5c" fontSize="3.5" transform="rotate(-90 2 50)">Yield →</text>

          {opportunities.map(opp => {
            const cx = (opp.risk.overall / 100) * 88 + 6
            const cy = H - ((Math.min(opp.yieldDNA.estimatedNetYield, 40) / 40) * 80 + 5)
            const r = Math.max(2, Math.min(6, Math.log10(opp.risk.liquidity.tvlUsd + 1)))
            const fill = opp.risk.overall < 30 ? '#10bf84' : opp.risk.overall < 55 ? '#f59e0b' : opp.risk.overall < 75 ? '#f97316' : '#ef4444'
            return (
              <g key={opp.id} onClick={() => onSelect(opp)} className="cursor-pointer" role="button" aria-label={opp.protocol}>
                <circle cx={cx} cy={cy} r={r + 2} fill={fill} fillOpacity={0.12} />
                <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.8} />
                <text x={cx} y={cy - r - 1} textAnchor="middle" fill="#8a9696" fontSize="2.8">{opp.protocol.split(' ')[0]}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <p className="text-[10px] text-ink-muted mt-2">Click a bubble to view details. {opportunities.length} opportunities shown.</p>
    </div>
  )
}
