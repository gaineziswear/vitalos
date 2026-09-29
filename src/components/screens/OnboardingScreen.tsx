import { useState } from 'react'
import { useApp } from '../../lib/app-context'
import { useT } from '../../lib/i18n'
import { cn } from '../../lib/utils'
import { ChevronRight, ChevronLeft, Shield } from 'lucide-react'
import type { OnboardingObjective, LiquidityNeed } from '../../types/yieldos'

type Step = 'objective' | 'liquidity' | 'risk' | 'disclosure' | 'wallet'

export function OnboardingScreen() {
  const { completeOnboarding, connectWallet, lang, setLang } = useApp()
  const { t } = useT()
  const [step, setStep] = useState<Step>('objective')
  const [objective, setObjective] = useState<OnboardingObjective | null>(null)
  const [liquidity, setLiquidity] = useState<LiquidityNeed | null>(null)
  const [risk, setRisk] = useState<'conservative' | 'moderate' | 'aggressive' | null>(null)
  const [disclosureAccepted, setDisclosureAccepted] = useState(false)

  const steps: Step[] = ['objective', 'liquidity', 'risk', 'disclosure', 'wallet']
  const stepIdx = steps.indexOf(step)

  function next() {
    const idx = steps.indexOf(step)
    if (idx < steps.length - 1) setStep(steps[idx + 1])
    else completeOnboarding()
  }
  function back() {
    const idx = steps.indexOf(step)
    if (idx > 0) setStep(steps[idx - 1])
  }

  const canContinue =
    (step === 'objective' && objective !== null) ||
    (step === 'liquidity' && liquidity !== null) ||
    (step === 'risk' && risk !== null) ||
    (step === 'disclosure' && disclosureAccepted) ||
    step === 'wallet'

  const objectives: { id: OnboardingObjective; label: string; desc: string }[] = [
    { id: 'preserve', label: t.onboarding.preserve, desc: 'Prioritise safety over returns' },
    { id: 'income',   label: t.onboarding.income,   desc: 'Generate regular yield' },
    { id: 'growth',   label: t.onboarding.growth,   desc: 'Grow capital over time' },
    { id: 'explore',  label: t.onboarding.explore,  desc: 'Discover new opportunities' },
    { id: 'unknown',  label: t.onboarding.unknown,  desc: 'Help me decide' },
  ]

  const liquidities: { id: LiquidityNeed; label: string }[] = [
    { id: 'immediate', label: t.onboarding.liquidityImmediate },
    { id: '1h',        label: t.onboarding.liquidity1h },
    { id: '24h',       label: t.onboarding.liquidity24h },
    { id: 'days',      label: t.onboarding.liquidityDays },
    { id: 'flexible',  label: t.onboarding.liquidityFlexible },
  ]

  const risks: { id: 'conservative' | 'moderate' | 'aggressive'; label: string }[] = [
    { id: 'conservative', label: t.onboarding.conservative },
    { id: 'moderate',     label: t.onboarding.moderate },
    { id: 'aggressive',   label: t.onboarding.aggressive },
  ]

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col items-center justify-center px-4 py-12">
      {/* Lang picker */}
      <div className="absolute top-5 right-5 flex gap-1 bg-surface-raised rounded-lg p-1">
        {(['en', 'fr'] as const).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={cn(
              'px-2.5 py-1 text-xs font-bold uppercase tracking-widest rounded-md transition-colors',
              lang === l ? 'bg-surface-overlay text-ink-primary' : 'text-ink-muted hover:text-ink-secondary',
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="40" height="40" rx="10" fill="#0dbf86"/>
            <path d="M10 12L16 28L20 19L24 28L30 12" stroke="#080b0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="20" r="2.5" fill="#080b0b" fillOpacity="0.35"/>
          </svg>
          <div>
            <p className="font-display font-extrabold text-ink-primary text-xl tracking-tight leading-none">VitalOS</p>
            <p className="text-[10px] text-ink-muted tracking-widest uppercase mt-0.5">Capital Operating System</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((s, i) => (
            <div
              key={s}
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                i <= stepIdx ? 'bg-mint-500' : 'bg-surface-border',
              )}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="bg-surface-raised rounded-2xl p-6 border border-surface-border shadow-card">
          {step === 'objective' && (
            <>
              <p className="text-xs text-mint-400 font-semibold uppercase tracking-widest mb-2">Step 1 of 5</p>
              <h1 className="font-display text-xl font-bold text-ink-primary mb-1 tracking-tight">{t.onboarding.welcome}</h1>
              <p className="text-sm text-ink-secondary mb-6">{t.onboarding.welcomeSub}</p>
              <div className="space-y-2">
                {objectives.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setObjective(o.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all',
                      objective === o.id
                        ? 'border-mint-500 bg-mint-500/8 text-ink-primary'
                        : 'border-surface-border bg-surface-overlay text-ink-secondary hover:border-surface-muted hover:text-ink-primary',
                    )}
                  >
                    <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                      objective === o.id ? 'border-mint-500' : 'border-ink-muted')}
                    >
                      {objective === o.id && <div className="w-2 h-2 rounded-full bg-mint-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{o.label}</p>
                      <p className="text-xs text-ink-muted">{o.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'liquidity' && (
            <>
              <p className="text-xs text-mint-400 font-semibold uppercase tracking-widest mb-2">Step 2 of 5</p>
              <h1 className="font-display text-xl font-bold text-ink-primary mb-6 tracking-tight">{t.onboarding.liquidity}</h1>
              <div className="space-y-2">
                {liquidities.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLiquidity(l.id)}
                    className={cn(
                      'w-full px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-all',
                      liquidity === l.id
                        ? 'border-mint-500 bg-mint-500/8 text-ink-primary'
                        : 'border-surface-border bg-surface-overlay text-ink-secondary hover:border-surface-muted hover:text-ink-primary',
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'risk' && (
            <>
              <p className="text-xs text-mint-400 font-semibold uppercase tracking-widest mb-2">Step 3 of 5</p>
              <h1 className="font-display text-xl font-bold text-ink-primary mb-6 tracking-tight">{t.onboarding.risk}</h1>
              <div className="space-y-2">
                {risks.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRisk(r.id)}
                    className={cn(
                      'w-full px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-all',
                      risk === r.id
                        ? 'border-mint-500 bg-mint-500/8 text-ink-primary'
                        : 'border-surface-border bg-surface-overlay text-ink-secondary hover:border-surface-muted hover:text-ink-primary',
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'disclosure' && (
            <>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2">Step 4 of 5</p>
              <h1 className="font-display text-lg font-bold text-ink-primary mb-4 tracking-tight">{t.onboarding.disclaimerTitle}</h1>
              <div className="bg-surface-overlay rounded-xl p-4 border border-surface-border mb-5">
                <p className="text-xs text-ink-secondary leading-relaxed">{t.onboarding.disclaimer}</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                  disclosureAccepted ? 'border-mint-500 bg-mint-500' : 'border-ink-muted',
                )}>
                  {disclosureAccepted && (
                    <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                      <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-base" />
                    </svg>
                  )}
                  <input
                    type="checkbox"
                    checked={disclosureAccepted}
                    onChange={e => setDisclosureAccepted(e.target.checked)}
                    className="sr-only"
                  />
                </div>
                <span className="text-xs text-ink-secondary">{t.onboarding.accept}</span>
              </label>
            </>
          )}

          {step === 'wallet' && (
            <>
              <p className="text-xs text-mint-400 font-semibold uppercase tracking-widest mb-2">Step 5 of 5</p>
              <h1 className="font-display text-xl font-bold text-ink-primary mb-2 tracking-tight">{t.onboarding.wallet}</h1>
              <p className="text-sm text-ink-secondary mb-6 flex items-center gap-2">
                <Shield size={14} className="text-mint-400 shrink-0" />
                {t.onboarding.walletSub}
              </p>
              <button
                onClick={() => { connectWallet(); completeOnboarding() }}
                className="w-full py-3.5 rounded-xl bg-mint-500 text-surface-base font-bold text-sm hover:bg-mint-400 transition-colors mb-3"
              >
                {t.nav.connectWallet}
              </button>
              <button
                onClick={completeOnboarding}
                className="w-full py-3 rounded-xl border border-surface-border text-ink-secondary text-sm font-medium hover:text-ink-primary hover:border-ink-muted transition-colors"
              >
                {t.onboarding.skip}
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={back}
            disabled={stepIdx === 0}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors',
              stepIdx === 0 ? 'text-ink-disabled pointer-events-none' : 'text-ink-secondary hover:text-ink-primary',
            )}
          >
            <ChevronLeft size={16} />
            {t.onboarding.back}
          </button>

          {step !== 'wallet' && (
            <button
              onClick={next}
              disabled={!canContinue}
              className={cn(
                'flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors',
                canContinue
                  ? 'bg-mint-500 text-surface-base hover:bg-mint-400'
                  : 'bg-surface-muted text-ink-disabled pointer-events-none',
              )}
            >
              {t.onboarding.continue}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
