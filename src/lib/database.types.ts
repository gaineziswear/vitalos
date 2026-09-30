// ── VitalOS Supabase database types ─────────────────────────────────────────
// Run `supabase gen types typescript` to regenerate from a live project.

export type Tier = 'node' | 'validator' | 'staker' | 'architect' | 'protocol'

export type TierStatus = 'active' | 'trialing' | 'expired' | 'cancelled'

export interface Profile {
  id: string                   // matches auth.users.id
  email: string
  display_name: string | null
  avatar_url: string | null
  tier: Tier
  tier_status: TierStatus
  trial_started_at: string | null
  trial_ends_at: string | null
  subscription_id: string | null
  subscription_period_end: string | null
  preferred_language: 'en' | 'fr'
  mode: 'beginner' | 'professional'
  onboarding_completed: boolean
  capital_objective: string | null
  created_at: string
  updated_at: string
}

export interface CapitalMandate {
  id: string
  user_id: string
  name: string
  objective: string | null
  liquidity: string | null
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive' | null
  max_protocol_exposure: number | null
  max_chain_exposure: number | null
  max_illiquid: number | null
  max_leverage: number | null
  experimental_budget: number | null
  min_liquidity: number | null
  min_yield_improvement: number | null
  is_active: boolean | null
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Profile
        Update: Partial<Profile>
      }
      capital_mandates: {
        Row: CapitalMandate
        Insert: Partial<CapitalMandate> & { user_id: string }
        Update: Partial<CapitalMandate>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      tier: Tier
      tier_status: TierStatus
    }
  }
}
