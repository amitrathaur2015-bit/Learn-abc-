import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export interface ReferralInfo {
  code: string
  link: string
  referredCount: number
  rewardedCount: number
  totalRewardValue: number
  rewardType: string
}

export async function getReferralInfo(): Promise<ReferralInfo | null> {
  if (!isSupabaseConfigured) return null
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return null

  const { data: profile } = await supabase.from('profiles').select('referral_code').eq('id', auth.user.id).single()
  if (!profile?.referral_code) return null

  const { data: referrals } = await supabase.from('referrals').select('status').eq('referrer_id', auth.user.id)
  const { data: rewards } = await supabase
    .from('referral_rewards')
    .select('reward_value, reward_type')
    .eq('parent_id', auth.user.id)

  const totalRewardValue = (rewards ?? []).reduce((sum, r) => sum + Number(r.reward_value), 0)

  return {
    code: profile.referral_code,
    link: `${window.location.origin}/?ref=${profile.referral_code}`,
    referredCount: referrals?.length ?? 0,
    rewardedCount: referrals?.filter((r) => r.status === 'rewarded').length ?? 0,
    totalRewardValue,
    rewardType: rewards?.[0]?.reward_type ?? 'free_days'
  }
}

/** Call this once, right after the referred parent's child finishes their
 *  first real activity - a deliberately light "qualification" bar that's
 *  still enough to filter out an empty signup. The actual anti-fraud +
 *  reward-granting logic lives server-side in process-referral. */
export async function tryQualifyReferral(): Promise<void> {
  if (!isSupabaseConfigured) return
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) return
  try {
    await supabase.functions.invoke('process-referral', { body: {} })
  } catch {
    // Best-effort - if this fails, the referral just stays pending and can
    // be reprocessed later; it should never break the child's activity flow.
  }
}

/** Reads ?ref=CODE from the URL, if present, for prefilling the register form. */
export function getReferralCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('ref')
}
