import { useState } from 'react'
import { useT } from '../../lib/i18n'
import { useApp } from '../../lib/app-context'
import { DEMO_PORTFOLIO, DEMO_OPPORTUNITIES } from '../../lib/demo-data'
import { fmtUsd, fmtPct, cn } from '../../lib/utils'
import { RiskBadge } from '../ui/RiskBadge'
import { DemoBadge } from '../ui/DemoBadge'
import { Zap, ArrowRight, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import type { Opportunity, RouterDecision } from '../../types/yieldos'

type OptStep = 'list' | 'detail' | 'simulate' | 'review'

interface RouterResult {
  decision: RouterDecision
  currentYield: number
  proposedYield: number
  estimatedAnnualDiff: number
  switchingCost: number
  breakEvenDays: number
  proposedAllocation: number
  explanation: string
  yieldSource: string
  risks: string
  worstCase: string
  exitPlan: string
}

function computeRouter(currentYield: number, capital: number, opp: Opportunity): RouterResult {
  const net = opp.yieldDNA.estimatedNetYield
  const switchCost = opp.yieldDNA.gasCost + opp.yieldDNA.exitCost
  const annualDiff = capital * ((net - currentYield) / 100)
  const breakEvenDays = annualDiff > 0 ? Math.ceil((switchCost / annualDiff) * 365) : 9999
  const decision: RouterDecision =
    annualDiff <= 0 ? 'HOLD' :
    breakEvenDays > 365 ? 'WAIT' :
    opp.risk.overall > 70 ? 'HOLD' :
    'MOVE'

  return {
    decision,
    currentYield,
    proposedYield: net,
    estimatedAnnualDiff: annualDiff,
    switchingCost: switchCost,
    breakEvenDays,
    proposedAllocation: Math.min(capital, opp.yieldDNA.capacity),
    explanation: `Estimated net yield improves from ${currentYield.toFixed(2)}% to ${net.toFixed(2)}%, adding approximately ${fmtUsd(annualDiff)} per year on the proposed allocation.`,
    yieldSource: opp.yieldDNA.breakdown.tokenIncentives > 0 ? `Mixed: organic ${opp.yieldDNA.sustainableYield.toFixed(1)}% + incentives ${opp.yieldDNA.incentiveYield.toFixed(1)}%.` : `Organic protocol revenue and fees.`,
    risks: `Smart contract risk: ${opp.risk.smartContract.score}/100. Liquidity risk: ${opp.risk.liquidity.score}/100. ${opp.risk.bridge.usesBridge ? 'Bridge exposure present.' : ''}`,
    worstCase: `If protocol TVL declines significantly, yield could fall toward the sustainable yield floor of ${opp.yieldDNA.sustainableYield.toFixed(2)}%. Token incentives are not guaranteed.`,
    exitPlan: opp.exitAnalysis.steps.join(' → '),
  }
}

const DECISION_STYLE: Record<RouterDecision, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  MOVE:         { bg: 'bg-mint-500/10',   border: 'border-mint-500/30',  text: 'text-mint-400',   icon: <Zap size={14} /> },
  HOLD:         { bg: 'bg-amber-500/10',  border: 'border-amber-500/20', text: 'text-amber-400',  icon: <Info size={14} /> },
  WAIT:         { bg: 'bg-ink-muted/10',  border: 'border-surface-border',text: 'text-ink-secondary', icon: <Info size={14} /> },
  PARTIAL_MOVE: { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',  text: 'text-cyan-400',   icon: <ArrowRight size={14} /> },
  EXIT:         { bg: 'bg-red-500/10',    border: 'border-red-500/20',   text: 'text-red-400',    icon: <AlertTriangle size={14} /> },
}

export function OptimiseScreen() {
  const { mode: _mode } = useApp()
  const { t } = useT()
  const [step, setStep] = useState<OptStep>('list')
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [result, setResult] = useState<RouterResult | null>(null)

  const p = DEMO_PORTFOLIO
  const currentYield = p.estimatedCurrentYield
  const topOpps = DEMO_OPPORTUNITIES.filter(o =>
    o.status === 'AVAILABLE' && o.yieldDNA.estimatedNetYield > currentYield,
  ).slice(0, 5)

  function analyse(opp: Opportunity) {
    setSelected(opp)
    setResult(computeRouter(currentYield, p.workingCapitalUsd, opp))
    setStep('detail')
  }

  function simulate() { setStep('simulate') }
  function review() { setStep('review') }
  function reset() { setStep('list'); setSelected(null); setResult(null) }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 lg:pb-8 space-y-5">
      <DemoBadge />

      <div>
        <h1 className="font-display text-xl font-bold text-ink-primary tracking-tight">{t.optimise.title}</h1>
        <p className="text-xs text-ink-secondary mt-0.5">Analyse opportunities. VitalOS never moves funds — you sign every transaction.</p>
      </div>

      {/* Current state strip */}
      <div className="bg-surface-raised rounded-xl p-4 border border-surface-border">
        <p className="text-xs text-ink-muted uppercase tracking-widest font-semibold mb-2">Current Position</p>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-[10px] text-ink-muted">Working Capital</p>
            <p className="font-display text-lg font-bold text-ink-primary tabular">{fmtUsd(p.workingCapitalUsd)}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted">Est. Yield</p>
            <p className="font-display text-lg font-bold text-mint-400 tabular">{fmtPct(currentYield)}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted">30d Realized</p>
            <p className="font-display text-lg font-bold text-ink-primary tabular">{fmtUsd(p.realized30dYield)}</p>
          </div>
          <RiskBadge level={p.riskLevel} />
        </div>
      </div>

      {/* Step: list */}
      {step === 'list' && (
        <>
          <p className="text-sm text-ink-secondary">
            VitalOS found <strong className="text-mint-300">{topOpps.length} opportunities</strong> that may improve your estimated net yield above your current {fmtPct(currentYield)}.
          </p>
          <div className="space-y-3">
            {topOpps.map(opp => (
              <div key={opp.id} className="bg-surface-raised rounded-xl p-4 border border-surface-border">
                {/* Current vs Proposed */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-1">Current</p>
                    <p className="text-[10px] text-ink-muted">Asset: Mixed</p>
                    <p className="text-[10px] text-ink-muted">Yield: {fmtPct(currentYield)} est.</p>
                    <p className="text-[10px] text-ink-muted">Liquidity: {fmtUsd(p.availableLiquidityUsd)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-mint-400 uppercase tracking-widest mb-1">Proposed</p>
                    <p className="text-xs font-semibold text-ink-primary">{opp.protocol} · {opp.asset}</p>
                    <p className="text-xs text-mint-400 font-bold tabular">
                      {fmtPct(opp.yieldDNA.estimatedNetYield)} net est.
                    </p>
                    <p className="text-[10px] text-ink-muted">+{fmtPct(opp.yieldDNA.estimatedNetYield - currentYield)} improvement</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    <span>Switch cost: ~{fmtUsd(opp.yieldDNA.gasCost + opp.yieldDNA.exitCost)}</span>
                    <RiskBadge level={opp.risk.level} size="sm" />
                  </div>
                  <button
                    onClick={() => analyse(opp)}
                    className="px-3 py-1.5 bg-mint-500/10 border border-mint-500/20 text-mint-400 text-xs font-bold rounded-lg hover:bg-mint-500/20 transition-colors"
                  >
                    Analyse
                  </button>
                </div>
              </div>
            ))}
          </div>
          {topOpps.length === 0 && (
            <div className="text-center py-12 text-ink-muted">
              <CheckCircle size={24} className="mx-auto mb-2 text-mint-400 opacity-60" />
              <p className="text-sm font-medium">Your capital appears optimised for your current mandate.</p>
              <p className="text-xs mt-1">No improvement above {fmtPct(currentYield)} found within risk limits.</p>
            </div>
          )}
        </>
      )}

      {/* Step: detail */}
      {step === 'detail' && selected && result && (
        <div className="space-y-4">
          <RouterDecisionBanner result={result} />

          {/* Comparison table */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-raised rounded-xl p-4 border border-surface-border">
              <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-2">Current</p>
              <p className="font-display text-xl font-bold text-ink-primary tabular">{fmtPct(result.currentYield)}</p>
              <p className="text-[10px] text-ink-muted mt-1">Est. yield · Mixed portfolio</p>
            </div>
            <div className="bg-surface-raised rounded-xl p-4 border border-mint-500/20">
              <p className="text-[10px] text-mint-400 uppercase tracking-widest mb-2">Proposed</p>
              <p className="font-display text-xl font-bold text-mint-400 tabular">{fmtPct(result.proposedYield)}</p>
              <p className="text-[10px] text-ink-muted mt-1">{selected.protocol} · {selected.asset}</p>
            </div>
          </div>

          <div className="bg-surface-raised rounded-xl p-4 border border-surface-border space-y-2">
            {[
              { label: 'Est. Annual Difference', value: result.estimatedAnnualDiff >= 0 ? `+${fmtUsd(result.estimatedAnnualDiff)}` : fmtUsd(result.estimatedAnnualDiff), col: result.estimatedAnnualDiff >= 0 ? 'text-mint-400' : 'text-red-400' },
              { label: 'Switching Cost',          value: fmtUsd(result.switchingCost),  col: 'text-ink-primary' },
              { label: 'Break-even Period',        value: result.breakEvenDays < 9999 ? `${result.breakEvenDays} days` : 'N/A', col: 'text-ink-primary' },
              { label: 'Proposed Allocation',      value: fmtUsd(result.proposedAllocation), col: 'text-ink-primary' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-xs text-ink-secondary">{r.label}</span>
                <span className={cn('text-sm font-bold tabular', r.col)}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Q&A explanations */}
          <ExplainerBlock title="Why?" body={result.explanation} />
          <ExplainerBlock title="Where does the yield come from?" body={result.yieldSource} />
          <ExplainerBlock title="What risks change?" body={result.risks} />
          <ExplainerBlock title="What could go wrong?" body={result.worstCase} warn />
          <ExplainerBlock title="How do I exit?" body={result.exitPlan} />

          <div className="flex items-center gap-3">
            <button onClick={reset} className="flex-1 py-3 rounded-xl border border-surface-border text-ink-secondary text-sm font-medium hover:text-ink-primary transition-colors">
              Back
            </button>
            {result.decision === 'MOVE' || result.decision === 'PARTIAL_MOVE' ? (
              <button onClick={simulate} className="flex-1 py-3 rounded-xl bg-mint-500 text-surface-base text-sm font-bold hover:bg-mint-400 transition-colors flex items-center justify-center gap-2">
                <Zap size={14} /> Simulate
              </button>
            ) : (
              <button onClick={reset} className="flex-1 py-3 rounded-xl bg-surface-muted text-ink-secondary text-sm font-medium cursor-not-allowed">
                {result.decision}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step: simulate */}
      {step === 'simulate' && selected && result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-400 glow-pulse" />
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">SIMULATION — Not a real transaction</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Before — Est. Yield', value: fmtPct(result.currentYield), sub: fmtUsd(p.workingCapitalUsd) },
              { label: 'After — Est. Yield',  value: fmtPct(result.proposedYield), sub: fmtUsd(result.proposedAllocation), mint: true },
            ].map(s => (
              <div key={s.label} className={cn('rounded-xl p-4 border', s.mint ? 'bg-mint-500/8 border-mint-500/20' : 'bg-surface-raised border-surface-border')}>
                <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-2">{s.label}</p>
                <p className={cn('font-display text-xl font-bold tabular', s.mint ? 'text-mint-400' : 'text-ink-primary')}>{s.value}</p>
                <p className="text-[10px] text-ink-muted mt-0.5">Capital: {s.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface-raised rounded-xl p-4 border border-surface-border space-y-2">
            <p className="text-xs font-semibold text-ink-primary mb-2">Transaction Details</p>
            {[
              { label: 'Gas cost', value: fmtUsd(selected.yieldDNA.gasCost) },
              { label: 'Slippage', value: `~${selected.yieldDNA.slippage.toFixed(3)}%` },
              { label: 'Token approvals', value: '1 required' },
              { label: 'Contracts', value: selected.protocol },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">{r.label}</span>
                <span className="text-ink-primary font-medium">{r.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep('detail')} className="flex-1 py-3 rounded-xl border border-surface-border text-ink-secondary text-sm font-medium">Back</button>
            <button onClick={review} className="flex-1 py-3 rounded-xl bg-mint-500 text-surface-base text-sm font-bold hover:bg-mint-400 transition-colors">Review Transaction</button>
          </div>
        </div>
      )}

      {/* Step: review */}
      {step === 'review' && selected && (
        <div className="space-y-4">
          <div className="bg-surface-raised rounded-xl p-5 border border-surface-border space-y-3">
            <p className="text-sm font-semibold text-ink-primary">Transaction Review</p>
            <p className="text-xs text-ink-muted">Review this carefully. You will sign with your wallet. VitalOS never moves funds without your signature.</p>
            <div className="space-y-2">
              {[
                { label: 'Action', value: `Deposit into ${selected.protocol}` },
                { label: 'Asset', value: selected.asset },
                { label: 'Chain', value: selected.chain },
                { label: 'Amount', value: fmtUsd(result!.proposedAllocation) },
                { label: 'Est. gas', value: fmtUsd(selected.yieldDNA.gasCost) },
                { label: 'Protocol', value: selected.protocol },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between text-sm">
                  <span className="text-ink-secondary">{r.label}</span>
                  <span className="text-ink-primary font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/8 rounded-xl p-4 border border-amber-500/20 flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-300">This is a demo. In production, clicking "Sign" would send this transaction to your wallet for cryptographic signature. VitalOS never transmits your private keys.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep('simulate')} className="flex-1 py-3 rounded-xl border border-surface-border text-ink-secondary text-sm font-medium">Back</button>
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-xl bg-surface-muted text-ink-secondary text-sm font-bold cursor-not-allowed"
              disabled
            >
              Sign (Demo — disabled)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function RouterDecisionBanner({ result }: { result: RouterResult }) {
  const style = DECISION_STYLE[result.decision]
  return (
    <div className={cn('rounded-xl p-4 border flex items-center gap-3', style.bg, style.border)}>
      <span className={style.text}>{style.icon}</span>
      <div>
        <p className={cn('text-sm font-bold', style.text)}>{result.decision}</p>
        <p className="text-xs text-ink-secondary">
          {result.decision === 'HOLD' && 'Expected benefit does not justify switching cost at this time.'}
          {result.decision === 'MOVE' && 'Improvement exceeds switching cost within mandate.'}
          {result.decision === 'WAIT' && 'Break-even period is too long. Revisit when yields or gas change.'}
          {result.decision === 'PARTIAL_MOVE' && 'Partial allocation recommended due to capacity or risk limits.'}
          {result.decision === 'EXIT' && 'Risk conditions have deteriorated. Exit recommended.'}
        </p>
      </div>
    </div>
  )
}

function ExplainerBlock({ title, body, warn }: { title: string; body: string; warn?: boolean }) {
  return (
    <div className="bg-surface-raised rounded-xl p-4 border border-surface-border">
      <p className={cn('text-xs font-bold uppercase tracking-widest mb-1.5', warn ? 'text-amber-400' : 'text-mint-400')}>{title}</p>
      <p className="text-sm text-ink-secondary leading-relaxed">{body}</p>
    </div>
  )
}
