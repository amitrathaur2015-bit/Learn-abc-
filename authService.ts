import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export interface ParentProfile {
  id: string
  email: string | null
  full_name: string | null
  role: 'parent' | 'admin'
  referral_code: string | null
}

export async function registerParent(
  email: string,
  password: string,
  fullName: string,
  referredByCode?: string
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }

  let referredById: string | undefined
  if (referredByCode) {
    const { data } = await supabase.from('profiles').select('id').eq('referral_code', referredByCode.toUpperCase()).maybeSingle()
    referredById = data?.id
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, referred_by: referredById }
    }
  })
  return { error: error?.message }
}

export async function loginParent(email: string, password: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: error?.message }
}

export async function logoutParent(): Promise<void> {
  if (!isSupabaseConfigured) return
  await supabase.auth.signOut()
}

export async function sendPasswordReset(email: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  })
  return { error: error?.message }
}

export async function getCurrentParent(): Promise<ParentProfile | null> {
  if (!isSupabaseConfigured) return null
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', auth.user.id).single()
  return data as ParentProfile | null
}

export function onAuthChange(callback: (parent: ParentProfile | null) => void): () => void {
  if (!isSupabaseConfigured) return () => {}
  const { data } = supabase.auth.onAuthStateChange(async () => {
    callback(await getCurrentParent())
  })
  return () => data.subscription.unsubscribe()
}
