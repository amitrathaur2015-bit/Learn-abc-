// supabase/functions/check-usage/index.ts
//
// Deploy via: Supabase Dashboard -> Edge Functions -> Create function ->
// name it "check-usage" -> paste this file.
//
// Called before a child starts a writing/quiz/game activity. Decides
// (server-side, not from anything the frontend claims) whether they're
// still within the free limit, and - if allowed - records the usage event
// in the same call so refreshing the page can't reset the count.
//
// This deliberately does its counting through the count_recent_usage()
// Postgres function (see supabase/schema.sql) rather than trusting a count
// sent by the client.

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
    const parentId = userData.user.id

    const { activity_type, child_id, record } = await req.json()

    const admin = createClient(supabaseUrl, serviceKey)

    const { data: settings } = await admin.from('monetization_settings').select('*').eq('id', 1).single()

    const { data: sub } = await admin
      .from('subscriptions')
      .select('id')
      .eq('parent_id', parentId)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    const isPremium = !!sub
    const limitActive = settings?.paid_system_enabled && settings?.free_limit_enabled && !isPremium

    let usedCount = 0
    if (limitActive) {
      const { count } = await admin
        .from('usage_events')
        .select('id', { count: 'exact', head: true })
        .eq('parent_id', parentId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      usedCount = count ?? 0
    }

    const limit = settings?.free_limit_count ?? 15
    const allowed = !limitActive || usedCount < limit

    // Only actually log a usage event if the caller asked us to (i.e. the
    // activity is really starting, not just a UI check) and it's allowed.
    if (allowed && record) {
      await admin.from('usage_events').insert({
        parent_id: parentId,
        child_id: child_id ?? null,
        activity_type: activity_type ?? 'writing'
      })
    }

    return new Response(
      JSON.stringify({
        allowed,
        isPremium,
        limitActive,
        used: usedCount,
        limit
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
})
