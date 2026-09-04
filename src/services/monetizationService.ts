import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export interface MonetizationSettings {
  ads_enabled: boolean
  paid_system_enabled: boolean
  referral_enabled: boolean
  free_limit_enabled: boolean
  free_limit_count: number
  monthly_price: number
  yearly_price: number
  currency: string
  referral_reward_type: string
  referral_reward_value: number
  referral_max_reward: number
}

const DEFAULT_SETTINGS: MonetizationSettings = {
  ads_enabled: false,
  paid_system_enabled: false,
  referral_enabled: true,
  free_limit_enabled: true,
  free_limit_count: 15,
  monthly_price: 99,
  yearly_price: 799,
  currency: 'INR',
  referral_reward_type: 'free_days',
  referral_reward_value: 7,
  referral_max_reward: 90
}

export async function getMonetizationSettings(): Promise<MonetizationSettings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS
  const { data, error } = await supabase.from('monetization_settings').select('*').eq('id', 1).single()
  if (error || !data) return DEFAULT_SETTINGS
  return data as MonetizationSettings
}

export async function updateMonetizationSettings(patch: Partial<MonetizationSettings>): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('monetization_settings').update(patch).eq('id', 1)
  return { error: error?.message }
}

export interface UsageCheckResult {
  allowed: boolean
  isPremium: boolean
  limitActive: boolean
  used: number
  limit: number
}

const OPEN_RESULT: UsageCheckResult = { allowed: true, isPremium: false, limitActive: false, used: 0, limit: 15 }

/** Calls the check-usage edge function. If the person isn't signed in, or
 *  Supabase isn't configured yet, this fails open (learning stays free) -
 *  the limit only ever restricts signed-in parents, matching the brief's
 *  "meaningful learning sessions" framing rather than blocking anonymous
 *  exploration before a parent has even created an account. */
export async function checkUsage(
  activityType: 'writing' | 'quiz' | 'game',
  record: boolean,
  childId?: string
): Promise<UsageCheckResult> {
  if (!isSupabaseConfigured) return OPEN_RESULT
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) return OPEN_RESULT

  try {
    const { data, error } = await supabase.functions.invoke('check-usage', {
      body: { activity_type: activityType, child_id: childId, record }
    })
    if (error || !data) return OPEN_RESULT
    return data as UsageCheckResult
  } catch {
    return OPEN_RESULT
  }
}

export async function hasActiveSubscription(): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const { data } = await supabase.rpc('has_active_subscription')
  return Boolean(data)
}
