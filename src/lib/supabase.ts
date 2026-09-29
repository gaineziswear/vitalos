import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnon) {
  console.warn('[VitalOS] Supabase env vars missing — auth features disabled.')
}

const clientOpts = {
  auth: {
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: true,
  },
}

const url  = supabaseUrl  ?? 'https://placeholder.supabase.co'
const anon = supabaseAnon ?? 'placeholder'

/** Typed client — use for reads/updates where Database types are accurate */
export const supabase = createClient<Database>(url, anon, clientOpts)

/** Untyped client — use for inserts where the Database Insert type resolves to never */
export const supabaseUntyped = createClient(url, anon, clientOpts)
