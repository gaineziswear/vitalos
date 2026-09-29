// ── VitalOS — Landing Page ────────────────────────────────────────────────────
// Arc Dark mode. Dominant surface: hero capital intelligence statement.
// Primary CTA: early-access signup. One CTA per viewport.

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Shield, Eye, GitBranch, Lock,
  ChevronDown, ChevronUp, TrendingUp, AlertTriangle,
  BarChart3, Globe, BookOpen, Newspaper, CheckCircle2,
  ExternalLink, Menu, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Fade-in on scroll ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Capital flow SVG visual ───────────────────────────────────────────────────
function CapitalFlowSVG() {
  return (
    <svg viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg mx-auto opacity-90">
      {/* YOUR CAPITAL */}
      <rect x="160" y="8" width="160" height="44" rx="10"
        fill="#1a2a1a" stroke="#4ade80" strokeWidth="1.5" />
      <text x="240" y="26" textAnchor="middle" fill="#4ade80"
        fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="1">YOUR CAPITAL</text>
      <text x="240" y="42" textAnchor="middle" fill="#e2e8e2"
        fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="700">$124,842</text>

      {/* Lines from capital to assets */}
      <line x1="240" y1="52" x2="100" y2="104" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1="240" y1="52" x2="240" y2="104" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1="240" y1="52" x2="380" y2="104" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      {/* Asset boxes */}
      {[
        { x: 50, label: 'USDC', val: '$52k', color: '#22d3ee' },
        { x: 190, label: 'ETH', val: '$41k', color: '#818cf8' },
        { x: 330, label: 'BTC', val: '$31k', color: '#fb923c' },
      ].map(({ x, label, val, color }) => (
        <g key={label}>
          <rect x={x} y="104" width="100" height="40" rx="8"
            fill="#111c11" stroke={color} strokeWidth="1" opacity="0.9" />
          <text x={x + 50} y="120" textAnchor="middle" fill={color}
            fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.5">{label}</text>
          <text x={x + 50} y="135" textAnchor="middle" fill="#e2e8e2"
            fontSize="10" fontFamily="JetBrains Mono, monospace">{val}</text>
        </g>
      ))}

      {/* Lines to strategies */}
      <line x1="100" y1="144" x2="100" y2="188" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />
      <line x1="100" y1="144" x2="240" y2="188" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
      <line x1="240" y1="144" x2="240" y2="188" stroke="#818cf8" strokeWidth="1" opacity="0.4" />
      <line x1="380" y1="144" x2="380" y2="188" stroke="#fb923c" strokeWidth="1" opacity="0.4" />

      {/* Strategy boxes */}
      {[
        { x: 50, label: 'LENDING', sub: '5.2% net', color: '#22d3ee' },
        { x: 190, label: 'LST', sub: '4.8% net', color: '#4ade80' },
        { x: 330, label: 'VAULT', sub: '7.1% net', color: '#818cf8' },
      ].map(({ x, label, sub, color }) => (
        <g key={label}>
          <rect x={x} y="188" width="100" height="40" rx="8"
            fill="#111c11" stroke={color} strokeWidth="1" opacity="0.8" />
          <text x={x + 50} y="204" textAnchor="middle" fill={color}
            fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="0.5">{label}</text>
          <text x={x + 50} y="219" textAnchor="middle" fill="#9ca89c"
            fontSize="9" fontFamily="JetBrains Mono, monospace">{sub}</text>
        </g>
      ))}

      {/* Converge lines to intelligence */}
      <line x1="100" y1="228" x2="200" y2="268" stroke="#4ade80" strokeWidth="1" opacity="0.4" />
      <line x1="240" y1="228" x2="240" y2="268" stroke="#4ade80" strokeWidth="1" opacity="0.4" />
      <line x1="380" y1="228" x2="280" y2="268" stroke="#4ade80" strokeWidth="1" opacity="0.4" />

      {/* Intelligence layer */}
      <rect x="110" y="268" width="260" height="44" rx="10"
        fill="#0d1a0d" stroke="#4ade80" strokeWidth="1.5" />
      <text x="240" y="286" textAnchor="middle" fill="#4ade80"
        fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">YIELD INTELLIGENCE ENGINE</text>
      <text x="240" y="302" textAnchor="middle" fill="#9ca89c"
        fontSize="8" fontFamily="JetBrains Mono, monospace">Risk · Liquidity · Opportunity</text>
    </svg>
  )
}

// ── Stat counter ──────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-black text-3xl md:text-4xl text-mint-400 tabular-nums tracking-tight">
        {value}
      </div>
      <div className="text-xs text-ink-muted mt-1 tracking-widest uppercase">{label}</div>
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, body, accent = false }: {
  icon: React.ElementType
  title: string
  body: string
  accent?: boolean
}) {
  return (
    <div className={cn(
      'rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1',
      accent
        ? 'bg-mint-500/5 border-mint-500/30 hover:border-mint-500/60'
        : 'bg-surface-card border-surface-border hover:border-surface-overlay',
    )}>
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center',
        accent ? 'bg-mint-500/15' : 'bg-surface-muted',
      )}>
        <Icon size={18} className={accent ? 'text-mint-400' : 'text-ink-secondary'} />
      </div>
      <div>
        <h3 className="font-display font-bold text-base text-ink-primary mb-1.5">{title}</h3>
        <p className="text-sm text-ink-muted leading-relaxed text-pretty">{body}</p>
      </div>
    </div>
  )
}

// ── How it works step ─────────────────────────────────────────────────────────
function Step({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 w-10 h-10 rounded-full border border-mint-500/40 flex items-center justify-center">
        <span className="font-display font-black text-sm text-mint-400">{num}</span>
      </div>
      <div className="pt-1">
        <h4 className="font-display font-bold text-base text-ink-primary mb-1">{title}</h4>
        <p className="text-sm text-ink-muted leading-relaxed text-pretty">{body}</p>
      </div>
    </div>
  )
}

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-surface-border last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-sm text-ink-primary leading-snug">{q}</span>
        {open
          ? <ChevronUp size={15} className="text-mint-400 shrink-0" />
          : <ChevronDown size={15} className="text-ink-muted shrink-0" />
        }
      </button>
      {open && (
        <p className="pb-5 text-sm text-ink-muted leading-relaxed text-pretty">{a}</p>
      )}
    </div>
  )
}

// ── Tokenomics pill ───────────────────────────────────────────────────────────
function TokenPill({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-ink-secondary">{label}</span>
          <span className="text-xs font-mono text-ink-muted tabular-nums">{pct}%</span>
        </div>
        <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}

// ── News placeholder ──────────────────────────────────────────────────────────
function NewsCard({ title, date, tag }: { title: string; date: string; tag: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-5 flex flex-col gap-3 hover:border-surface-overlay transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-mint-500/10 text-mint-400 tracking-wider uppercase">
          {tag}
        </span>
        <span className="text-[10px] text-ink-muted font-mono">{date}</span>
      </div>
      <p className="text-sm font-display font-semibold text-ink-primary leading-snug">{title}</p>
      <div className="flex items-center gap-1 text-[11px] text-mint-400">
        <span>Read more</span>
        <ExternalLink size={10} />
      </div>
    </div>
  )
}

// ── Early access form ─────────────────────────────────────────────────────────
function EarlyAccessForm() {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL as string
    const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/early_access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: 'landing_page',
        }),
      })
      // 201 = created, 409 = duplicate
      if (res.status === 409) {
        setStatus('done')
        setMessage("You're already on the list.")
      } else if (res.ok) {
        setStatus('done')
        setMessage("You're on the list. We'll be in touch.")
      } else {
        throw new Error(`HTTP ${res.status}`)
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-3 bg-mint-500/10 border border-mint-500/30 rounded-xl px-5 py-4">
        <CheckCircle2 size={18} className="text-mint-400 shrink-0" />
        <p className="text-sm text-mint-300 font-semibold">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={e => { void handleSubmit(e) }} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-mint-500/60 focus:ring-1 focus:ring-mint-500/30 transition-colors"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-mint-500 hover:bg-mint-400 disabled:opacity-60 text-graphite-900 font-bold text-sm px-6 py-3 rounded-xl transition-colors flex items-center gap-2 justify-center whitespace-nowrap"
      >
        {status === 'loading' ? 'Joining...' : 'Get Early Access'}
        {status !== 'loading' && <ArrowRight size={14} />}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 sm:col-span-2 mt-1">{message}</p>
      )}
    </form>
  )
}

// ── Navigation ────────────────────────────────────────────────────────────────
function LandingNav({ onLaunchApp }: { onLaunchApp: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border/60 backdrop-blur-xl bg-graphite-950/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#4ade80" fillOpacity="0.12" />
            <path d="M6 20 L10 12 L14 16 L18 8 L22 14" stroke="#4ade80" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="22" cy="14" r="2" fill="#4ade80" />
          </svg>
          <span className="font-display font-black text-lg text-ink-primary tracking-tight">VitalOS</span>
          <span className="hidden sm:block text-[10px] font-mono text-mint-400 bg-mint-500/10 px-1.5 py-0.5 rounded tracking-widest">BETA</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Tokenomics', 'FAQ'].map(item => (
            <a key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-ink-muted hover:text-ink-primary transition-colors">
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchApp}
            className="hidden sm:flex items-center gap-2 bg-mint-500 hover:bg-mint-400 text-graphite-900 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Launch App <ArrowRight size={13} />
          </button>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-ink-muted hover:text-ink-primary"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-border bg-graphite-950 px-4 py-4 flex flex-col gap-4">
          {['Features', 'How it Works', 'Tokenomics', 'FAQ'].map(item => (
            <a key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-ink-secondary py-1">
              {item}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onLaunchApp() }}
            className="bg-mint-500 text-graphite-900 font-bold text-sm px-4 py-3 rounded-lg mt-2"
          >
            Launch App
          </button>
        </div>
      )}
    </nav>
  )
}

// ── Main landing page ─────────────────────────────────────────────────────────
export function LandingPage({ onLaunchApp }: { onLaunchApp: () => void }) {
  return (
    <div className="min-h-dvh bg-graphite-950 text-ink-primary">
      <LandingNav onLaunchApp={onLaunchApp} />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-mint-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-electric-400/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 bg-mint-500/10 border border-mint-500/20 rounded-full px-3 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" />
                <span className="text-[11px] font-mono text-mint-400 tracking-wider uppercase">Onchain Capital Operating System</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-ink-primary leading-[1.05] tracking-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
                Make your capital
                <span className="block text-mint-400">measurable.</span>
                <span className="block text-ink-secondary">Comparable.</span>
                <span className="block" style={{ WebkitTextFillColor: 'transparent', WebkitTextStroke: '1px #4ade80' }}>Programmable.</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-muted leading-relaxed text-pretty mb-8 max-w-lg">
                VitalOS is the intelligence layer between you and the fragmented onchain financial ecosystem. Understand what your capital is actually doing, what it costs, and what better alternatives exist — before you sign anything.
              </p>

              <div className="flex flex-col gap-4">
                <EarlyAccessForm />
                <p className="text-xs text-ink-muted">
                  Non-custodial. Your keys, your capital. 7-day free trial on all paid tiers.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Capital flow visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl border border-surface-border bg-surface-card/50 backdrop-blur p-6">
              <div className="absolute top-3 left-3 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-mint-500/60" />
              </div>
              <div className="text-[10px] font-mono text-ink-muted text-center mb-4 tracking-widest uppercase">Capital Flow Intelligence</div>
              <CapitalFlowSVG />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-surface-border bg-surface-card/30 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <FadeIn><Stat value="20+" label="Protocols tracked" /></FadeIn>
          <FadeIn delay={0.1}><Stat value="7" label="Risk dimensions" /></FadeIn>
          <FadeIn delay={0.2}><Stat value="<200ms" label="Dashboard load" /></FadeIn>
          <FadeIn delay={0.3}><Stat value="0" label="Keys ever stored" /></FadeIn>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-xs font-mono text-mint-400 tracking-widest uppercase mb-3">Core Architecture</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-ink-primary tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
                Not another dashboard.
              </h2>
              <p className="text-base text-ink-muted max-w-xl mx-auto text-pretty">
                VitalOS is an intelligence and orchestration layer — built to answer the questions that matter, before capital moves.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: BarChart3, title: 'Yield DNA', body: 'Every opportunity decomposed into organic yield, trading fees, staking rewards, and token incentives. Incentive dependency flagged clearly.', accent: true },
              { icon: Shield, title: 'Risk Budget', body: 'Seven independent risk dimensions — smart contract, market, liquidity, oracle, governance, bridge, concentration. Never a single opaque score.', accent: false },
              { icon: GitBranch, title: 'Capital Mandate', body: 'Define exactly what your capital is allowed to do: chains, protocols, leverage, lockups, and minimum yield improvement. The router cannot exceed it.', accent: false },
              { icon: TrendingUp, title: 'Capital Router', body: 'HOLD, MOVE, PARTIAL MOVE, WAIT, or EXIT — with break-even analysis and switching cost calculation before any recommendation.', accent: false },
              { icon: Eye, title: 'Scenario Lab', body: 'Stress-test your portfolio. ETH -30%, stablecoin depeg, TVL collapse, oracle failure. Simulations with clear assumptions and limitations.', accent: false },
              { icon: AlertTriangle, title: 'Yield Guard', body: 'Continuous monitoring for yield collapse, TVL deterioration, governance changes, protocol exploits, and stablecoin depegs. Real-time alerts.', accent: true },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <FeatureCard {...f} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 bg-surface-card/20 border-y border-surface-border">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <p className="text-xs font-mono text-mint-400 tracking-widest uppercase mb-3">The VitalOS Flow</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-ink-primary tracking-tight mb-10" style={{ letterSpacing: '-0.02em' }}>
              Understand before you move.
            </h2>
            <div className="flex flex-col gap-8">
              {[
                { num: '01', title: 'Connect your wallet', body: 'Non-custodial. VitalOS reads your onchain positions. Seed phrases and private keys are never requested or stored.' },
                { num: '02', title: 'Set your Capital Mandate', body: 'Define your objective, liquidity needs, risk tolerance, and what protocols and chains you allow. The system works within these rules, always.' },
                { num: '03', title: 'Discover and compare', body: 'The Yield Intelligence Engine continuously evaluates the opportunity universe against your mandate. Gross yield, net yield, sustainable yield, and full risk decomposition.' },
                { num: '04', title: 'Simulate before signing', body: 'See before and after wallet state, switching costs, exit conditions, and risk changes. Prepare the transaction — but your wallet signs it, not VitalOS.' },
                { num: '05', title: 'Guard your capital', body: 'Yield Guard monitors your positions continuously. When conditions deteriorate, you are alerted with current exposure and exit options — before damage occurs.' },
              ].map((s, i) => (
                <FadeIn key={s.num} delay={i * 0.07}>
                  <Step {...s} />
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="sticky top-24 rounded-2xl border border-surface-border bg-surface-card p-6 space-y-4">
              <p className="text-xs font-mono text-ink-muted tracking-widest uppercase">Mandate Example</p>
              {[
                { label: 'Objective', value: 'Growth' },
                { label: 'Liquidity', value: 'Within 24h' },
                { label: 'Max protocol exposure', value: '10%' },
                { label: 'Max chain exposure', value: '40%' },
                { label: 'Max leverage', value: '0%' },
                { label: 'Experimental budget', value: '5%' },
                { label: 'Min yield improvement', value: '1.0%' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                  <span className="text-xs text-ink-muted">{label}</span>
                  <span className="text-xs font-mono text-mint-400 tabular-nums">{value}</span>
                </div>
              ))}
              <div className="pt-2">
                <div className="rounded-lg bg-mint-500/10 border border-mint-500/20 px-4 py-3 text-xs text-mint-300 font-semibold text-center">
                  YIELDOS ROUTER: 3 opportunities found within mandate
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TOKENOMICS / WHITEPAPER ── */}
      <section id="tokenomics" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-xs font-mono text-mint-400 tracking-widest uppercase mb-3">Protocol Economics</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-ink-primary tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
                Tokenomics & Whitepaper
              </h2>
              <p className="text-base text-ink-muted max-w-xl mx-auto text-pretty">
                VitalOS is designed around sustainable protocol economics. Intelligence infrastructure, not speculation.
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Revenue model */}
            <FadeIn>
              <div className="rounded-2xl border border-surface-border bg-surface-card p-6 h-full">
                <h3 className="font-display font-bold text-base text-ink-primary mb-5 flex items-center gap-2">
                  <TrendingUp size={16} className="text-mint-400" /> Revenue Model
                </h3>
                <div className="space-y-4">
                  {[
                    { tier: 'Node', desc: 'Free — read-only visibility', highlight: false },
                    { tier: 'Validator', desc: '$9/mo — mandates + daily alerts', highlight: false },
                    { tier: 'Staker', desc: '$29/mo — full router + simulation', highlight: true },
                    { tier: 'Architect', desc: '$99/mo — API + unlimited', highlight: false },
                    { tier: 'Protocol', desc: 'Custom — Treasury + org roles + SLA', highlight: false },
                  ].map(({ tier, desc, highlight }) => (
                    <div key={tier} className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 border',
                      highlight
                        ? 'bg-mint-500/5 border-mint-500/20'
                        : 'bg-surface-muted border-surface-border',
                    )}>
                      <span className={cn('font-display font-bold text-xs w-20 shrink-0',
                        highlight ? 'text-mint-400' : 'text-ink-secondary')}>{tier}</span>
                      <span className="text-xs text-ink-muted">{desc}</span>
                      {highlight && <span className="ml-auto text-[10px] text-mint-400 font-mono">Popular</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-surface-border space-y-2">
                  <p className="text-xs text-ink-muted font-semibold">Additional revenue streams:</p>
                  {[
                    'Routing fee: 5–15 bps on capital routed through VitalOS',
                    'Protocol partnerships: disclosed, never ranking-manipulating',
                    'Referral attribution from qualifying protocol programmes',
                    'VitalOS API: institutional data licensing',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-mint-400 mt-1.5 shrink-0" />
                      <p className="text-xs text-ink-muted leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Token allocation */}
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-surface-border bg-surface-card p-6 h-full">
                <h3 className="font-display font-bold text-base text-ink-primary mb-2 flex items-center gap-2">
                  <Globe size={16} className="text-mint-400" /> Future Token Allocation
                </h3>
                <p className="text-xs text-ink-muted mb-5">
                  VitalOS does not currently have a token. The allocation below represents the intended distribution for a future governance token. Subject to change.
                </p>
                <div className="space-y-4">
                  {[
                    { label: 'Community & Ecosystem', pct: 35, color: '#4ade80' },
                    { label: 'Protocol Development', pct: 20, color: '#22d3ee' },
                    { label: 'Team & Advisors (4yr vest)', pct: 18, color: '#818cf8' },
                    { label: 'Treasury', pct: 15, color: '#fb923c' },
                    { label: 'Early Access Rewards', pct: 7, color: '#f472b6' },
                    { label: 'Liquidity Bootstrap', pct: 5, color: '#fbbf24' },
                  ].map(t => (
                    <TokenPill key={t.label} {...t} />
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-surface-border">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs text-mint-400 hover:text-mint-300 transition-colors font-semibold"
                    onClick={e => e.preventDefault()}
                  >
                    <BookOpen size={13} />
                    Whitepaper — coming soon
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── NEWS / UPDATES ── */}
      <section className="py-24 px-4 bg-surface-card/20 border-y border-surface-border">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-mono text-mint-400 tracking-widest uppercase mb-2">Latest</p>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-ink-primary tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Updates & Research
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Newspaper size={13} />
                <span>Stream coming soon</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'VitalOS Beta — What we\'re building and why it matters for onchain capital', date: 'Sep 2026', tag: 'Announcement' },
              { title: 'Yield DNA: why APY is not enough and how we decompose protocol returns', date: 'Sep 2026', tag: 'Research' },
              { title: 'Capital Mandate as a Web3 primitive — making your financial rules machine-readable', date: 'Sep 2026', tag: 'Protocol' },
            ].map((n, i) => (
              <FadeIn key={n.title} delay={i * 0.08}>
                <NewsCard {...n} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-mono text-mint-400 tracking-widest uppercase mb-3">Questions</p>
              <h2 className="font-display font-black text-3xl text-ink-primary tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                Frequently Asked
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-surface-border bg-surface-card divide-y divide-surface-border overflow-hidden px-6">
              {[
                {
                  q: 'Is VitalOS custodial? Does it hold my funds?',
                  a: 'No. VitalOS is strictly non-custodial. We never hold your funds, request your private keys, seed phrases, or recovery phrases. Your wallet remains entirely under your control. VitalOS reads your onchain positions and prepares transactions — you always sign with your own wallet.'
                },
                {
                  q: 'Does VitalOS guarantee returns or financial advice?',
                  a: 'No. VitalOS is an intelligence and analysis system, not a financial advisor. It surfaces data, runs calculations, and helps you understand your options. All financial decisions remain yours. Digital assets are volatile, DeFi protocols can fail, and past performance does not guarantee future results.'
                },
                {
                  q: 'Which chains and protocols does VitalOS support?',
                  a: 'VitalOS currently supports major EVM chains including Ethereum, Base, Arbitrum, Optimism, and Polygon, with more being added. Protocol coverage spans major lending, liquid staking, LP, and vault protocols. New protocols go through a rigorous onboarding process before appearing in the opportunity engine.'
                },
                {
                  q: 'What is a Capital Mandate?',
                  a: 'A Capital Mandate is a first-class object that defines exactly what VitalOS is allowed to consider for your capital. You set maximum protocol exposure, chain exposure, allowed leverage, liquidity requirements, and minimum yield improvement threshold. The routing engine cannot recommend anything outside your mandate.'
                },
                {
                  q: 'What is Yield DNA?',
                  a: 'Yield DNA is VitalOS\'s proprietary decomposition of every yield opportunity into its constituent parts: organic protocol revenue, trading fees, staking rewards, and token incentives. We flag incentive dependency clearly because high incentive yields often disappear when token emissions end.'
                },
                {
                  q: 'How does pricing work?',
                  a: 'VitalOS has four tiers: Node (free, read-only), Validator ($9/mo), Staker ($29/mo), and Architect ($99/mo). All paid tiers start with a 7-day free trial at Architect level. We also offer a Protocol tier for DAOs and institutional treasuries — contact us for pricing.'
                },
                {
                  q: 'Where does VitalOS get its data?',
                  a: 'VitalOS aggregates data from multiple providers including DeFiLlama, direct protocol APIs, onchain RPC, and indexed blockchain data. Every metric carries a timestamp, data provider, and confidence classification. Stale or low-confidence data is clearly labelled — we never silently present outdated information as live.'
                },
              ].map(item => (
                <FAQItem key={item.q} {...item} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mint-500/3 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-mint-500/10 border border-mint-500/20 rounded-full px-3 py-1.5 mb-6">
              <Lock size={11} className="text-mint-400" />
              <span className="text-[11px] font-mono text-mint-400 tracking-wider uppercase">Non-custodial · Your keys, always</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-ink-primary tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              Your capital deserves<br />better intelligence.
            </h2>
            <p className="text-base text-ink-muted mb-8 text-pretty">
              Join the early access list. Be among the first to experience the Onchain Capital Operating System.
            </p>
            <div className="max-w-md mx-auto">
              <EarlyAccessForm />
            </div>
            <p className="text-xs text-ink-muted mt-4">
              No spam. No financial advice. Just intelligence.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-surface-border px-4 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#4ade80" fillOpacity="0.12" />
              <path d="M6 20 L10 12 L14 16 L18 8 L22 14" stroke="#4ade80" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-display font-black text-sm text-ink-primary">VitalOS</span>
            <span className="text-ink-muted text-xs">— Onchain Capital Operating System</span>
          </div>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Risk Disclosure', 'Contact'].map(item => (
              <a key={item} href="#" onClick={e => e.preventDefault()}
                className="text-xs text-ink-muted hover:text-ink-secondary transition-colors">
                {item}
              </a>
            ))}
          </div>
          <p className="text-xs text-ink-muted text-center md:text-right">
            © 2026 VitalOS. Not financial advice.<br />
            Digital assets involve risk.
          </p>
        </div>
      </footer>
    </div>
  )
}
