import { useState } from 'react'
import { useBalance } from 'wagmi'
import { useApp } from '../../lib/app-context'
import { useT } from '../../lib/i18n'
import { DEMO_PORTFOLIO } from '../../lib/demo-data'
import { fmtUsd, fmtPct, cn } from '../../lib/utils'
import { RiskBadge } from '../ui/RiskBadge'
import { DemoBadge } from '../ui/DemoBadge'
import { AlertCircle, BarChart2 } from 'lucide-react'

type Tab = 'positions' | 'exposure' | 'attribution' | 'concentration'

export function PortfolioScreen() {
  const { mode, walletConnected, walletAddress } = useApp()
  const { data: walletBalance, isLoading: walletBalanceLoading } = useBalance({
    address: walletAddress as `0x${string}` | undefined,
    query: { enabled: walletConnected && !!walletAddress },
  })
  const { t } = useT()
  const [tab, setTab] = useState<Tab>('positions')
  const p = DEMO_PORTFOLIO

  const tabs: { id: Tab; label: string }[] = [
    { id: 'positions',    label: 'Positions' },
    { id: 'exposure',     label: t.portfolio.exposureGraph },
    { id: 'concentration',label: t.portfolio.byProtocol.replace('By ', '') + ' / ' + t.portfolio.byChain.replace('By ', '') },
    { id: 'attribution',  label: t.portfolio.attribution },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 lg:pb-8 space-y-5">
      {walletConnected ? (
        <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-mint-500/6 border border-mint-500/15">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold text-mint-400">Live wallet</p>
            <p className="text-[11px] text-ink-secondary font-mono truncate">{walletAddress}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-bold text-ink-primary">{walletBalanceLoading ? 'Loading…' : walletBalance ? `${Number(walletBalance.formatted).toFixed(5)} ${walletBalance.symbol}` : 'Unavailable'}</p>
            <p className="text-[10px] text-ink-muted">Native balance on connected chain</p>
          </div>
        </div>
      ) : <DemoBadge />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-ink-primary tracking-tight">{t.portfolio.title}</h1>
          <p className="text-xs text-ink-secondary mt-0.5">{p.positions.length} positions · {p.concentrationMap.byChain && Object.keys(p.concentrationMap.byChain).length} chains</p>
        </div>
        <span className="text-[10px] text-ink-muted">DEMO</span>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total Capital',   value: fmtUsd(p.totalUsd) },
          { label: 'Working Capital', value: fmtUsd(p.workingCapitalUsd) },
          { label: 'Est. Yield',      value: fmtPct(p.estimatedCurrentYield) },
          { label: 'Risk Budget',     value: `${p.riskBudgetUsed}%` },
        ].map(s => (
          <div key={s.label} className="bg-surface-raised rounded-xl p-3 border border-surface-border">
            <p className="text-[10px] text-ink-muted uppercase tracking-widest font-semibold">{s.label}</p>
            <p className="font-display text-base font-bold text-ink-primary tabular mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-muted rounded-xl p-1">
        {tabs.map(tab_ => (
          <button
            key={tab_.id}
            onClick={() => setTab(tab_.id)}
            className={cn(
              'flex-1 py-2 text-xs font-semibold rounded-lg transition-colors',
              tab === tab_.id ? 'bg-surface-overlay text-ink-primary' : 'text-ink-muted hover:text-ink-secondary',
            )}
          >
            {tab_.label}
          </button>
        ))}
      </div>

      {/* Positions */}
      {tab === 'positions' && (
        <div className="space-y-3">
          {p.positions.map(pos => (
            <div key={pos.id} className="bg-surface-raised rounded-xl p-4 border border-surface-border">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink-primary">{pos.asset}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-overlay border border-surface-border text-ink-muted uppercase font-mono">{pos.chain}</span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">{pos.protocol} · <span className="capitalize">{pos.positionType.replace('_', ' ')}</span></p>
                </div>
                <div className="text-right">
                  <p className="font-display text-base font-bold text-ink-primary tabular">{fmtUsd(pos.usdValue)}</p>
                  {pos.yieldDNA && pos.yieldDNA.estimatedNetYield > 0 && (
                    <p className="text-xs text-mint-400 tabular">{fmtPct(pos.yieldDNA.estimatedNetYield)} net</p>
                  )}
                </div>
              </div>
              {pos.risk && <RiskBadge level={pos.risk.level} size="sm" />}
              {mode === 'professional' && pos.yieldDNA && (
                <div className="mt-2 pt-2 border-t border-surface-border grid grid-cols-3 gap-2 text-[10px] text-ink-muted font-mono">
                  <span>Gas: {fmtUsd(pos.yieldDNA.gasCost)}</span>
                  <span>Exit: {fmtUsd(pos.yieldDNA.exitCost)}</span>
                  <span>Sust: {fmtPct(pos.yieldDNA.sustainableYield)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Exposure graph */}
      {tab === 'exposure' && (
        <div className="space-y-4">
          <ExposureGraph portfolio={p} />
          {/* Hidden concentrations */}
          {p.concentrationMap.hiddenConcentrations.length > 0 && (
            <div className="bg-amber-500/8 rounded-xl p-4 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-amber-400" />
                <p className="text-sm font-semibold text-amber-300">{t.portfolio.hiddenConc}</p>
              </div>
              {p.concentrationMap.hiddenConcentrations.map((hc, i) => (
                <div key={i} className="text-xs text-ink-secondary space-y-0.5">
                  <p><strong className="text-amber-300">{hc.name}</strong> ({hc.type}) affects {hc.affectedProtocols.join(', ')}</p>
                  <p>Combined exposure: {fmtUsd(hc.totalExposureUsd)} ({fmtPct(hc.totalExposurePct)} of portfolio)</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Concentration */}
      {tab === 'concentration' && (
        <div className="space-y-4">
          <ConcentrationBars label="By Protocol" data={p.concentrationMap.byProtocol} />
          <ConcentrationBars label="By Chain" data={p.concentrationMap.byChain} />
          <ConcentrationBars label="By Asset" data={p.concentrationMap.byAsset} />
          <ConcentrationBars label="By Stablecoin" data={p.concentrationMap.byStablecoin} />
          <ConcentrationBars label="By Oracle" data={p.concentrationMap.byOracle} />
        </div>
      )}

      {/* Attribution */}
      {tab === 'attribution' && (
        <div className="bg-surface-raised rounded-2xl p-5 border border-surface-border space-y-4">
          <p className="text-sm font-semibold text-ink-primary">Performance Attribution — 30 days</p>
          <p className="text-xs text-ink-muted">DEMO DATA — illustrative only. Real attribution requires live onchain indexing.</p>
          {[
            { label: 'Protocol Yield',    value: +182.40,  color: 'bg-mint-500' },
            { label: 'Trading Fees',      value: +44.22,   color: 'bg-cyan-500' },
            { label: 'Incentives',        value: +28.60,   color: 'bg-amber-500' },
            { label: 'Asset Appreciation',value: +0,       color: 'bg-ink-muted' },
            { label: 'Gas',               value: -21.37,   color: 'bg-red-500' },
            { label: 'Bridge Costs',      value: -11.00,   color: 'bg-orange-500' },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-xs text-ink-secondary w-36 shrink-0">{row.label}</span>
              <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full', row.color)}
                  style={{ width: `${Math.abs(row.value) / 200 * 100}%`, marginLeft: row.value < 0 ? `${(200 - Math.abs(row.value)) / 200 * 100}%` : undefined }}
                />
              </div>
              <span className={cn('text-xs font-bold tabular w-16 text-right', row.value >= 0 ? 'text-mint-400' : 'text-red-400')}>
                {row.value >= 0 ? '+' : ''}{fmtUsd(row.value)}
              </span>
            </div>
          ))}
          <div className="border-t border-surface-border pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-primary">Total (est.)</span>
            <span className="font-display text-base font-bold text-mint-400 tabular">+{fmtUsd(184.62)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Exposure Graph ─────────────────────────────────────────────────────────

function ExposureGraph({ portfolio }: { portfolio: typeof DEMO_PORTFOLIO }) {
  const p = portfolio
  const totalUsd = p.totalUsd

  const chains = Object.entries(p.concentrationMap.byChain)
  const protocols = Object.entries(p.concentrationMap.byProtocol)

  return (
    <div className="bg-surface-raised rounded-xl p-5 border border-surface-border">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={14} className="text-mint-400" />
        <p className="text-sm font-semibold text-ink-primary">Capital Flow</p>
      </div>

      {/* Visual tree */}
      <div className="relative">
        {/* Root */}
        <div className="flex justify-center mb-4">
          <div className="bg-surface-overlay rounded-lg px-4 py-2 border border-mint-500/30 text-xs font-bold text-mint-300">
            YOUR CAPITAL · {fmtUsd(totalUsd)}
          </div>
        </div>

        {/* Chains */}
        <div className="flex justify-center gap-3 mb-4 flex-wrap">
          {chains.map(([chain, pct]) => (
            <div key={chain} className="flex flex-col items-center gap-1">
              <div className="w-px h-4 bg-surface-border mx-auto" />
              <div className="bg-surface-overlay rounded-lg px-3 py-1.5 border border-surface-border text-xs font-semibold text-ink-secondary">
                {chain} <span className="text-ink-muted">{fmtPct(pct, 1)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Protocols */}
        <div className="flex justify-center gap-2 flex-wrap">
          {protocols.map(([protocol, pct]) => (
            <div key={protocol} className="flex flex-col items-center gap-1">
              <div className="w-px h-4 bg-surface-border mx-auto" />
              <div
                className="rounded-lg px-2.5 py-1 border text-[11px] font-medium"
                style={{
                  borderColor: `rgba(16,191,132,${Math.min(pct / 50, 0.6)})`,
                  backgroundColor: `rgba(16,191,132,${Math.min(pct / 100, 0.08)})`,
                  color: pct > 30 ? '#10bf84' : '#8a9696',
                }}
              >
                {protocol} · {fmtPct(pct, 1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Concentration Bars ─────────────────────────────────────────────────────

function ConcentrationBars({ label, data }: { label: string; data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  if (entries.length === 0) return null

  return (
    <div className="bg-surface-raised rounded-xl p-4 border border-surface-border">
      <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest mb-3">{label}</p>
      <div className="space-y-2">
        {entries.map(([name, pct]) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-xs text-ink-secondary w-28 shrink-0 truncate">{name}</span>
            <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  backgroundColor: pct > 40 ? '#f59e0b' : pct > 25 ? '#10bf84' : '#8a9696',
                }}
              />
            </div>
            <span className="text-xs text-ink-muted tabular w-10 text-right">{fmtPct(pct, 1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
