import { useApp } from '../../lib/app-context'
import { useT } from '../../lib/i18n'
import { fmtUsd, fmtPct, cn } from '../../lib/utils'
import { DEMO_PORTFOLIO, DEMO_ALERTS, DEMO_OPPORTUNITIES } from '../../lib/demo-data'
import { RiskBadge } from '../ui/RiskBadge'
import { DemoBadge } from '../ui/DemoBadge'
import {
  TrendingUp, Droplets, Zap, AlertTriangle, ChevronRight,
  ArrowUpRight, Activity, Shield, ArrowRight,
} from 'lucide-react'
import type { Screen } from '../../lib/app-context'

export function OverviewScreen() {
  const { setScreen } = useApp()
  const { t } = useT()
  const p = DEMO_PORTFOLIO
  const alerts = DEMO_ALERTS.filter(a => a.incidentStatus !== 'RESOLVED')
  const topOpps = DEMO_OPPORTUNITIES.filter(o => o.status === 'AVAILABLE').slice(0, 3)

  function nav(s: Screen) { setScreen(s) }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 lg:pb-10 space-y-5">

      {/* ── Top bar: DEMO badge + greeting ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-muted uppercase tracking-widest font-semibold">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h1 className="font-display text-xl font-bold text-ink-primary tracking-tight mt-0.5">
            Capital Overview
          </h1>
        </div>
        <DemoBadge inline />
      </div>

      {/* ── Hero capital card ── */}
      <section aria-label="Capital summary">
        <div className="card-accent p-6 relative overflow-hidden">
          {/* Ambient glow */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(13,191,134,.08) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* Capital label row */}
            <div className="flex items-start justify-between mb-1">
              <p className="metric-label text-mint-400/70">{t.dashboard.yourCapital}</p>
              <span className="chip-mint text-[10px]">DEMO DATA</span>
            </div>

            {/* Hero number */}
            <p className="font-display text-5xl font-black text-ink-primary tabular tracking-tightest leading-none mb-1">
              {fmtUsd(p.totalUsd)}
            </p>
            <div className="flex items-center gap-2 mb-6">
              <span className="delta-pos text-sm">+{fmtUsd(p.realized30dYield)}</span>
              <span className="text-xs text-ink-muted">30d yield</span>
              <span className="w-px h-3 bg-surface-border mx-1" />
              <span className="text-xs text-ink-muted">{fmtUsd(p.fees30d)} fees</span>
            </div>

            {/* Metric grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                {
                  label: t.dashboard.workingCapital,
                  value: fmtUsd(p.workingCapitalUsd),
                  icon: <TrendingUp size={12} className="text-mint-400" />,
                  sub: `${fmtPct((p.workingCapitalUsd / p.totalUsd) * 100, 0)} deployed`,
                },
                {
                  label: t.dashboard.availableLiquidity,
                  value: fmtUsd(p.availableLiquidityUsd),
                  icon: <Droplets size={12} className="text-electric-400" />,
                  sub: 'immediately available',
                },
                {
                  label: t.dashboard.estimatedYield,
                  value: fmtPct(p.estimatedCurrentYield),
                  icon: <Activity size={12} className="text-mint-400" />,
                  sub: 'estimated net p.a.',
                  accent: true,
                },
                {
                  label: t.dashboard.realized30d,
                  value: fmtUsd(p.realized30dYield),
                  icon: <ArrowUpRight size={12} className="text-mint-400" />,
                  sub: '30-day realized',
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className={cn(
                    'metric-cell',
                    stat.accent && 'border-mint-500/25 bg-mint-500/5',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {stat.icon}
                    <span className="metric-label">{stat.label}</span>
                  </div>
                  <span className={cn('metric-value', stat.accent && 'text-mint-400')}>{stat.value}</span>
                  <span className="metric-sub">{stat.sub}</span>
                </div>
              ))}
            </div>

            {/* Risk + budget footer */}
            <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <RiskBadge level={p.riskLevel} />
                <div className="flex items-center gap-2">
                  <div className="progress-bar w-24">
                    <div
                      className="progress-fill bg-mint-500"
                      style={{ width: `${p.riskBudgetUsed}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-muted tabular">{p.riskBudgetUsed}% risk budget used</span>
                </div>
              </div>
              <button
                onClick={() => nav('portfolio')}
                className="btn-ghost text-xs py-1.5"
              >
                {p.positions.length} positions across {Object.keys(p.concentrationMap.byChain).length} chains
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capital Flow Visual ── */}
      <section aria-label="Capital flow">
        <CapitalFlowDiagram portfolio={p} onNav={nav} />
      </section>

      {/* ── Capital Efficiency CTA ── */}
      <section aria-label="Capital efficiency">
        <div className="card p-5 flex items-center gap-4 justify-between flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={13} className="text-mint-400" />
              <p className="text-xs text-mint-400 font-semibold uppercase tracking-widest">{t.dashboard.capitalEfficiency}</p>
            </div>
            <p className="text-sm text-ink-secondary">
              Generating ~{fmtUsd(p.realized30dYield)}/mo at {fmtPct(p.estimatedCurrentYield)}.
            </p>
            <p className="text-sm font-semibold text-ink-primary mt-0.5">
              {topOpps.length} compatible opportunities detected.
            </p>
          </div>
          <button
            onClick={() => nav('optimise')}
            className="btn-primary shrink-0"
          >
            <Zap size={14} />
            {t.dashboard.optimiseCapital}
          </button>
        </div>
      </section>

      {/* ── Active alerts ── */}
      {alerts.length > 0 && (
        <section aria-label="Active alerts">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="section-heading flex items-center gap-2">
              <AlertTriangle size={13} className="text-amber-400" />
              {t.yieldGuard.alert}
              <span className="chip-amber ml-1">{alerts.length}</span>
            </h2>
            <button onClick={() => nav('guard')} className="btn-ghost text-xs py-1">
              {t.common.seeAll} <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {alerts.map(alert => (
              <button
                key={alert.id}
                onClick={() => nav('guard')}
                className="w-full card-warn p-4 flex items-center justify-between gap-3 text-left hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={cn('w-2 h-2 rounded-full shrink-0', {
                    critical: 'bg-red-400',
                    high:     'bg-orange-400',
                    moderate: 'bg-amber-400',
                    low:      'bg-mint-400',
                  }[alert.severity])} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-ink-primary">{alert.title}</p>
                    <p className="text-xs text-ink-secondary">{alert.protocol} · {fmtUsd(alert.exposureUsd)} exposure</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-ink-muted shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Top opportunities ── */}
      <section aria-label="Top opportunities">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="section-heading">Top Opportunities</h2>
          <button onClick={() => nav('discover')} className="btn-ghost text-xs py-1">
            {t.common.seeAll} <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {topOpps.map(opp => (
            <button
              key={opp.id}
              onClick={() => nav('discover')}
              className="w-full card p-4 hover:border-mint-500/25 transition-colors text-left flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-semibold text-ink-primary">{opp.protocol}</span>
                  <span className="chip text-[10px] font-mono">{opp.chain}</span>
                </div>
                <p className="text-xs text-ink-muted">{opp.asset} · {opp.strategy}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-lg font-bold text-mint-400 tabular leading-none">
                  {opp.yieldDNA.estimatedNetYield.toFixed(2)}%
                </p>
                <p className="text-[10px] text-ink-muted mt-0.5">net est.</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Positions snapshot ── */}
      <section aria-label="Portfolio positions">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="section-heading">{t.portfolio.title}</h2>
          <button onClick={() => nav('portfolio')} className="btn-ghost text-xs py-1">
            {t.common.seeAll} <ArrowRight size={12} />
          </button>
        </div>
        <div className="card divide-y divide-surface-border overflow-hidden">
          {p.positions.map((pos, i) => (
            <div key={pos.id} className={cn('flex items-center justify-between gap-3 px-4 py-3.5', i === 0 && 'pt-4', i === p.positions.length - 1 && 'pb-4')}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-overlay border border-surface-border flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-ink-secondary font-mono">{pos.asset.slice(0, 2)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-primary">{pos.asset}</p>
                  <p className="text-xs text-ink-muted capitalize truncate">{pos.protocol} · {pos.positionType.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-sm font-bold text-ink-primary tabular">{fmtUsd(pos.usdValue)}</p>
                {pos.yieldDNA && pos.yieldDNA.estimatedNetYield > 0 && (
                  <p className="text-xs text-mint-400 tabular">{fmtPct(pos.yieldDNA.estimatedNetYield)} net</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Yield Guard status ── */}
      <section aria-label="Yield guard status">
        <button
          onClick={() => nav('guard')}
          className="w-full card p-4 flex items-center gap-4 hover:border-mint-500/20 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-mint-500/10 border border-mint-500/20 flex items-center justify-center shrink-0">
            <Shield size={16} className="text-mint-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink-primary">Yield Guard</p>
            <p className="text-xs text-ink-secondary">
              {alerts.length === 0
                ? 'All positions nominal. No active alerts.'
                : `${alerts.length} active alert${alerts.length > 1 ? 's' : ''} require attention.`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn('w-2 h-2 rounded-full', alerts.length > 0 ? 'bg-amber-400 glow-pulse' : 'bg-mint-500 glow-pulse')} aria-hidden="true" />
            <ChevronRight size={15} className="text-ink-muted" />
          </div>
        </button>
      </section>

    </div>
  )
}

// ── Capital Flow Diagram ─────────────────────────────────────────────────────

function CapitalFlowDiagram({
  portfolio,
  onNav,
}: {
  portfolio: typeof DEMO_PORTFOLIO
  onNav: (s: Screen) => void
}) {
  const chains = Object.entries(portfolio.concentrationMap.byChain).slice(0, 4)
  const protocols = Object.entries(portfolio.concentrationMap.byProtocol).slice(0, 4)

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-heading">Capital Flow</p>
          <p className="text-xs text-ink-muted mt-0.5">Your capital and where it flows</p>
        </div>
        <button onClick={() => onNav('portfolio')} className="btn-ghost text-xs py-1">
          Full view <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-0">
        {/* Root node */}
        <div className="flex justify-center">
          <div className="px-5 py-2.5 rounded-xl border border-mint-500/30 bg-mint-500/8 text-xs font-bold text-mint-300 tracking-wide">
            YOUR CAPITAL · {fmtUsd(portfolio.totalUsd)}
          </div>
        </div>

        {/* Connector */}
        <div className="w-px h-5 bg-gradient-to-b from-mint-500/40 to-surface-border" />

        {/* Chain row */}
        <div className="flex gap-2 flex-wrap justify-center">
          {chains.map(([chain, pct], i) => (
            <div key={chain} className="flex flex-col items-center gap-0">
              {i > 0 && <div className="w-px h-0 hidden" />}
              <div className="metric-cell px-3 py-2 min-w-[90px] items-center text-center">
                <span className="text-[10px] text-ink-muted font-mono uppercase">{chain}</span>
                <span className="font-display text-sm font-bold text-ink-secondary tabular">{fmtPct(pct, 1)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Connector */}
        <div className="w-px h-5 bg-gradient-to-b from-surface-border to-transparent" />

        {/* Protocol row */}
        <div className="flex gap-2 flex-wrap justify-center">
          {protocols.map(([protocol, pct]) => (
            <div
              key={protocol}
              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-medium text-center"
              style={{
                borderColor: `rgba(13,191,134,${Math.min(pct / 40, 0.5)})`,
                background:  `rgba(13,191,134,${Math.min(pct / 120, 0.07)})`,
                color: pct > 25 ? '#0dbf86' : '#7a9494',
              }}
            >
              {protocol}
              <span className="block text-[10px] opacity-70 tabular">{fmtPct(pct, 1)}</span>
            </div>
          ))}
        </div>

        {/* Bottom labels */}
        <div className="w-px h-5 bg-gradient-to-b from-surface-border to-transparent" />
        <div className="flex gap-3 items-center flex-wrap justify-center">
          {[
            { label: 'YIELD INTELLIGENCE', col: 'text-mint-400' },
            { label: 'RISK ENGINE',        col: 'text-electric-400' },
            { label: 'CAPITAL ROUTER',     col: 'text-ink-secondary' },
          ].map(n => (
            <span key={n.label} className={cn('text-[10px] font-bold tracking-widest uppercase', n.col)} style={{ letterSpacing: '0.1em' }}>
              {n.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}


