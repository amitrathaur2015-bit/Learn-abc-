import { createClient } from '@supabase/supabase-js'

// Only the URL and the ANON (public) key ever go in frontend code/env vars.
// The service-role key lives ONLY in Supabase Edge Function secrets - see
// supabase/functions/*/index.ts. Never add SUPABASE_SERVICE_ROLE_KEY to any
// VITE_-prefixed variable; anything prefixed VITE_ ships to the browser.

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

// When env vars aren't set yet (e.g. first run before Amit creates the
// Supabase project), export a client pointed at harmless placeholders rather
// than crashing the whole app - every screen that depends on it checks
// isSupabaseConfigured first and shows a friendly "not set up yet" message.
export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder-key')
