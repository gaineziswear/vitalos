import React, { useState } from 'react'
import { X, Eye, EyeOff, Loader2, AlertCircle, Zap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

type AuthView = 'sign_in' | 'sign_up'

interface AuthModalProps {
  open:    boolean
  onClose: () => void
  defaultView?: AuthView
}

// ── Component ────────────────────────────────────────────────────────────────

export function AuthModal({ open, onClose, defaultView = 'sign_in' }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()

  const [view,     setView]     = useState<AuthView>(defaultView)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState<string | null>(null)

  if (!open) return null

  const reset = () => { setError(null); setSuccess(null) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    reset()
    setLoading(true)

    if (view === 'sign_in') {
      const { error: err } = await signInWithEmail(email, password)
      if (err) { setError(err); setLoading(false); return }
      onClose()
    } else {
      if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return }
      if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return }
      const { error: err } = await signUpWithEmail(email, password, name)
      if (err) { setError(err); setLoading(false); return }
      setSuccess('Account created! Check your email to confirm, then sign in.')
      setView('sign_in')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    reset()
    setLoading(true)
    const { error: err } = await signInWithGoogle()
    if (err) { setError(err); setLoading(false) }
    // Google redirects away; no need to close modal
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={view === 'sign_in' ? 'Sign in to VitalOS' : 'Create your VitalOS account'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-[#101616] border border-white/15 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,.65)] overflow-hidden">

        {/* Header */}
        <div className="px-7 pt-7 pb-6 border-b border-white/10 bg-[#121a1a]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-mint-500/15 border border-mint-500/25 flex items-center justify-center">
                <Zap size={13} className="text-mint-400" />
              </div>
              <span className="font-display font-extrabold text-[15px] text-ink-primary tracking-tight">VitalOS</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink-primary hover:bg-surface-muted transition-colors"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          <h2 className="font-display font-bold text-xl text-ink-primary leading-tight">
            {view === 'sign_in' ? 'Welcome back' : 'Start your free trial'}
          </h2>
          <p className="text-sm text-ink-secondary mt-1">
            {view === 'sign_in'
              ? 'Sign in to your capital operating system.'
              : '7 days of Architect-tier access. No card required.'}
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-4 bg-[#0e1414]">

          {/* Trial badge */}
          {view === 'sign_up' && (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-mint-500/8 border border-mint-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400 shrink-0" />
              <p className="text-xs text-mint-300 font-medium">
                Full <strong>Architect</strong> access free for 7 days — then $99/mo or downgrade anytime.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20" role="alert">
              <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-mint-500/10 border border-mint-500/20" role="status">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400 shrink-0 mt-1" />
              <p className="text-xs text-mint-300">{success}</p>
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={() => { void handleGoogle() }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-overlay text-sm font-medium text-ink-primary transition-colors disabled:opacity-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-[11px] text-ink-muted font-medium">or</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          {/* Form */}
          <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-3" noValidate>
            {view === 'sign_up' && (
              <div>
                <label htmlFor="auth-name" className="block text-xs font-medium text-ink-secondary mb-1.5">
                  Full name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Satoshi Nakamoto"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-mint-500/50 focus:ring-1 focus:ring-mint-500/30 transition-colors"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-ink-secondary mb-1.5">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-mint-500/50 focus:ring-1 focus:ring-mint-500/30 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-medium text-ink-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete={view === 'sign_in' ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={view === 'sign_up' ? 'Minimum 8 characters' : '••••••••'}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface-muted border border-surface-border text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-mint-500/50 focus:ring-1 focus:ring-mint-500/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'btn-primary w-full justify-center mt-1',
                loading && 'opacity-70 cursor-not-allowed',
              )}
            >
              {loading
                ? <Loader2 size={14} className="animate-spin" />
                : view === 'sign_in' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-xs text-center text-ink-muted pt-1">
            {view === 'sign_in' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => { setView(view === 'sign_in' ? 'sign_up' : 'sign_in'); reset() }}
              className="text-mint-400 font-semibold hover:text-mint-300 transition-colors"
            >
              {view === 'sign_in' ? 'Start free trial' : 'Sign in'}
            </button>
          </p>

          {/* Legal */}
          <p className="text-[10px] text-ink-muted text-center leading-relaxed">
            By continuing you agree to our{' '}
            <a href="#" className="underline hover:text-ink-secondary">Terms</a>{' '}and{' '}
            <a href="#" className="underline hover:text-ink-secondary">Privacy Policy</a>.
            VitalOS is a non-custodial intelligence layer. We never hold your keys or funds.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Google icon (inline SVG — no extra dep) ───────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
