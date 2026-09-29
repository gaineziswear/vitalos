import { useApp } from '../../lib/app-context'
import { useT } from '../../lib/i18n'
import { DEMO_PASSPORT, DEMO_PORTFOLIO } from '../../lib/demo-data'
import { fmtUsd, fmtPct, cn } from '../../lib/utils'
import { RiskMeter } from '../ui/RiskMeter'
import { DemoBadge } from '../ui/DemoBadge'
import { Fingerprint, Globe, Layers, TrendingUp, Droplets, Shield } from 'lucide-react'

export function PassportScreen() {
  const { walletConnected, walletAddress } = useApp()
  const { t } = useT()
  const p = DEMO_PASSPORT
  const portfolio = DEMO_PORTFOLIO

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 lg:pb-8 space-y-5">
      <DemoBadge />

      {/* Header */}
      <div className="flex items-center gap-3">
        <Fingerprint size={20} className="text-mint-400" />
        <div>
          <h1 className="font-display text-xl font-bold text-ink-primary tracking-tight">{t.passport.title}</h1>
          <p className="text-xs text-ink-secondary mt-0.5">{t.passport.sub}</p>
        </div>
      </div>

      {/* Passport card */}
      <div className="relative bg-surface-raised rounded-2xl p-6 border border-surface-border overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full border-4 border-mint-500 translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full border-2 border-mint-500 -translate-x-8 translate-y-8" />
        </div>

        <div className="relative">
          {/* Passport header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] text-ink-muted uppercase tracking-widest font-semibold">VitalOS PASSPORT</p>
              <p className="font-display text-lg font-bold text-ink-primary mt-0.5 tracking-tight">{t.passport.title}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-mint-500/10 border border-mint-500/20 flex items-center justify-center">
              <Fingerprint size={18} className="text-mint-400" />
            </div>
          </div>

          {/* Wallet address */}
          <div className="mb-5">
            <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-1">Wallet</p>
            <p className="text-sm font-mono text-ink-secondary">
              {walletConnected ? walletAddress : '0x0000…0000'}
            </p>
          </div>

          {/* Primary stat — capital */}
          <div className="mb-5">
            <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-1">{t.passport.capital}</p>
            <p className="font-display text-3xl font-bold text-ink-primary tabular tracking-tight">{fmtUsd(p.capitalUsd)}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Layers size={13} />,    label: t.passport.strategies, value: String(p.activeStrategies) },
              { icon: <Globe size={13} />,     label: t.passport.chains,     value: String(p.chains) },
              { icon: <Shield size={13} />,    label: 'Protocols',           value: String(p.protocols) },
              { icon: <TrendingUp size={13} />,label: t.passport.avgYield,   value: `${fmtPct(p.avgNetYield)} net` },
              { icon: <TrendingUp size={13} />,label: t.passport.realized,   value: fmtUsd(p.realizedYield) },
              { icon: <Droplets size={13} />,  label: t.passport.liquidity,  value: `${fmtPct(p.liquidityPct, 0)}` },
            ].map(stat => (
              <div key={stat.label} className="bg-surface-overlay rounded-xl p-3 border border-surface-border">
                <div className="flex items-center gap-1 mb-1 text-ink-muted">{stat.icon}</div>
                <p className="text-[10px] text-ink-muted uppercase tracking-widest">{stat.label}</p>
                <p className="font-display text-sm font-bold text-ink-primary tabular mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk and concentration */}
      <div className="bg-surface-raised rounded-2xl p-5 border border-surface-border space-y-3">
        <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">Risk Profile</p>
        <RiskMeter score={p.riskBudgetUsed} label={t.passport.riskUsed} />
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <p className="text-[10px] text-ink-muted">{t.passport.concentration}</p>
            <p className={cn(
              'text-sm font-bold tabular mt-0.5',
              p.highestProtocolConcentration > 40 ? 'text-amber-400' : 'text-mint-400',
            )}>
              {fmtPct(p.highestProtocolConcentration, 1)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted">{t.passport.sustainable}</p>
            <p className="text-sm font-bold tabular mt-0.5 text-mint-400">{fmtPct(p.sustainableYieldRatio, 0)}</p>
          </div>
        </div>
      </div>

      {/* Concentration highlights */}
      <div className="bg-surface-raised rounded-2xl p-5 border border-surface-border">
        <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest mb-3">Chain Exposure</p>
        {Object.entries(portfolio.concentrationMap.byChain).map(([chain, pct]) => (
          <div key={chain} className="flex items-center gap-3 mb-2">
            <span className="text-xs text-ink-secondary w-20 shrink-0">{chain}</span>
            <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-mint-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-ink-muted tabular w-10 text-right">{fmtPct(pct, 1)}</span>
          </div>
        ))}
      </div>

      {/* Generated timestamp */}
      <p className="text-[10px] text-ink-muted text-center">
        Passport generated · {new Date(p.generatedAt).toLocaleDateString()} · DEMO DATA
      </p>
    </div>
  )
}
