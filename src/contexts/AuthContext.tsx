import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, supabaseUntyped } from '../lib/supabase'
import type { Profile } from '../lib/database.types'
import type { Tier } from '../lib/database.types'
import { TRIAL_DAYS, tierAtLeast } from '../lib/tiers'

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  session:  Session | null
  user:     User    | null
  profile:  Profile | null
  loading:  boolean
  authReady: boolean
}

interface AuthActions {
  signInWithEmail:    (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail:    (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signInWithGoogle:   () => Promise<{ error: string | null }>
  signOut:            () => Promise<void>
  refreshProfile:     () => Promise<void>
  can:                (requiredTier: Tier) => boolean
  effectiveTier:      Tier
}

type AuthContextValue = AuthState & AuthActions

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session,   setSession]   = useState<Session | null>(null)
  const [user,      setUser]      = useState<User    | null>(null)
  const [profile,   setProfile]   = useState<Profile | null>(null as Profile | null)
  const [loading,   setLoading]   = useState(true)
  const [authReady, setAuthReady] = useState(false)

  // ── Load profile from Supabase ─────────────────────────────────────────────

  const loadProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()

    if (error || !data) {
      console.warn('[VitalOS] Could not load profile:', error?.message)
      return null
    }
    return data
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const p = await loadProfile(user.id)
    if (p) setProfile(p)
  }, [user, loadProfile])

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        void loadProfile(s.user.id).then(p => {
          setProfile(p)
          setLoading(false)
          setAuthReady(true)
        })
      } else {
        setLoading(false)
        setAuthReady(true)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s)
        setUser(s?.user ?? null)
        if (s?.user) {
          const p = await loadProfile(s.user.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [loadProfile])

  // ── Create profile on first sign-up ───────────────────────────────────────

  const createProfile = useCallback(async (u: User, name: string) => {
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS)

    const newProfile: Profile = {
      id:                      u.id,
      email:                   u.email ?? '',
      display_name:            name || null,
      avatar_url:              null,
      tier:                    'architect',   // trial = full Architect access
      tier_status:             'trialing',
      trial_started_at:        new Date().toISOString(),
      trial_ends_at:           trialEnd.toISOString(),
      subscription_id:         null,
      subscription_period_end: null,
      preferred_language:      'en',
      mode:                    'beginner',
      onboarding_completed:    false,
      capital_objective:       null,
      created_at:              new Date().toISOString(),
      updated_at:              new Date().toISOString(),
    }

    // supabaseUntyped: insert via untyped client; the typed client's Insert resolves to never.
    const { error } = await supabaseUntyped.from('profiles').upsert(newProfile, { onConflict: 'id' })
    if (error) console.warn('[VitalOS] Could not create profile:', error.message)
    return newProfile
  }, [])

  // ── Auth actions ───────────────────────────────────────────────────────────

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUpWithEmail = useCallback(async (
    email: string, password: string, name: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }

    if (data.user) {
      // Check if profile already exists (e.g. email confirmation re-trigger)
      const existing = await loadProfile(data.user.id)
      if (!existing) {
        const p = await createProfile(data.user, name)
        setProfile(p)
      }
    }
    return { error: null }
  }, [loadProfile, createProfile])

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  // ── Effective tier (trial = architect access; expired trial → node) ────────

  const effectiveTier: Tier = (() => {
    if (!profile) return 'node'
    if (profile.tier_status === 'trialing') {
      if (!profile.trial_ends_at) return 'node'
      return new Date(profile.trial_ends_at) > new Date() ? 'architect' : 'node'
    }
    if (profile.tier_status === 'active') return profile.tier
    return 'node'
  })()

  const can = useCallback((required: Tier) => {
    return tierAtLeast(effectiveTier, required)
  }, [effectiveTier])

  // ── Value ──────────────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    session, user, profile, loading, authReady,
    signInWithEmail, signUpWithEmail, signInWithGoogle,
    signOut, refreshProfile,
    can, effectiveTier,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
