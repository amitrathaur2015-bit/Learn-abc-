// supabase/functions/process-referral/index.ts
//
// Deploy via: Supabase Dashboard -> Edge Functions -> Create function ->
// name it "process-referral" -> paste this file.
//
// The referral row itself is created automatically at signup (see the
// handle_new_user trigger in supabase/schema.sql). This function is called
// once the referred parent does something that counts as "qualified" (the
// app calls it after the referred parent's child completes their first
// writing activity - see monetizationService.ts) and is where the reward is
// actually granted, with the anti-fraud checks the brief asked for:
//   - no self-referrals
//   - no duplicate rewards for the same referral
//   - a referrer's total rewards are capped at referral_max_reward

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth' }), { status: 401 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })
    }
    const referredId = userData.user.id

    const admin = createClient(supabaseUrl, serviceKey)

    const { data: settings } = await admin.from('monetization_settings').select('*').eq('id', 1).single()
    if (!settings?.referral_enabled) {
      return new Response(JSON.stringify({ qualified: false, reason: 'referrals_disabled' }), { status: 200 })
    }

    const { data: referral } = await admin
      .from('referrals')
      .select('*')
      .eq('referred_id', referredId)
      .maybeSingle()

    if (!referral) {
      return new Response(JSON.stringify({ qualified: false, reason: 'no_referral' }), { status: 200 })
    }

    // Anti-fraud: no self-referrals (shouldn't be possible given the trigger,
    // but double-checked here since this function is the one granting value).
    if (referral.referrer_id === referral.referred_id) {
      return new Response(JSON.stringify({ qualified: false, reason: 'self_referral' }), { status: 200 })
    }

    // Anti-fraud: already rewarded - never reward the same referral twice.
    if (referral.status === 'rewarded') {
      return new Response(JSON.stringify({ qualified: true, alreadyRewarded: true }), { status: 200 })
    }

    // Anti-fraud: cap total rewards per referrer.
    const { data: existingRewards } = await admin
      .from('referral_rewards')
      .select('reward_value')
      .eq('parent_id', referral.referrer_id)

    const totalSoFar = (existingRewards ?? []).reduce((sum, r) => sum + Number(r.reward_value), 0)
    if (totalSoFar >= Number(settings.referral_max_reward)) {
      return new Response(JSON.stringify({ qualified: false, reason: 'max_reward_reached' }), { status: 200 })
    }

    const rewardValue = Math.min(
      Number(settings.referral_reward_value),
      Number(settings.referral_max_reward) - totalSoFar
    )

    await admin.from('referral_rewards').insert({
      referral_id: referral.id,
      parent_id: referral.referrer_id,
      reward_type: settings.referral_reward_type,
      reward_value: rewardValue
    })

    await admin.from('referrals').update({ status: 'rewarded' }).eq('id', referral.id)

    // If the reward type is free premium days and the referrer already has
    // an active subscription, extend it; otherwise this is recorded and can
    // be applied when they subscribe. Kept simple on purpose for Part 3.
    if (settings.referral_reward_type === 'free_days') {
      const { data: activeSub } = await admin
        .from('subscriptions')
        .select('*')
        .eq('parent_id', referral.referrer_id)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (activeSub) {
        const newExpiry = new Date(new Date(activeSub.expires_at).getTime() + rewardValue * 24 * 60 * 60 * 1000)
        await admin.from('subscriptions').update({ expires_at: newExpiry.toISOString() }).eq('id', activeSub.id)
      }
    }

    return new Response(JSON.stringify({ qualified: true, rewardValue }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
})
