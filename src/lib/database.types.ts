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

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Profile
        Update: Partial<Profile>
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
