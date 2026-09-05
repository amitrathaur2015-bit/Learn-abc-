// supabase/functions/verify-payment/index.ts
//
// Deploy via: Supabase Dashboard -> Edge Functions -> Create function ->
// name it "verify-payment" -> paste this file.
//
// This is the ONLY place a payment is allowed to turn into premium access.
// The frontend must never set subscription/payment status itself - it only
// calls this function and displays whatever it returns.
//
// Required secrets (Dashboard -> Edge Functions -> verify-payment -> Secrets):
//   SUPABASE_URL              (auto-provided)
//   SUPABASE_SERVICE_ROLE_KEY (auto-provided - never put this in frontend .env)
//   PAYMENT_PROVIDER_SECRET   (your real gateway's secret key, once chosen)
//
// This ships with a "mock" provider so the flow can be tested end-to-end
// before a real payment gateway (Razorpay, Stripe, etc.) is wired in. Swap
// verifyWithProvider() for a real call to your provider's verification API -
// nothing else in this file needs to change.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface VerifyRequest {
  provider: string
  provider_payment_id: string
  plan: 'monthly' | 'yearly'
  // Whatever extra fields your real provider's verification call needs
  // (order_id, signature, etc.) can be added here later.
}

async function verifyWithProvider(payload: VerifyRequest): Promise<{ verified: boolean; amount: number }> {
  // --- MOCK PROVIDER (default) ---
  // Treats any payment id that starts with "mock_" as successful, for testing.
  // Replace this whole function body with a real call to your provider's
  // "verify payment" / "fetch order" API once one is chosen. Never trust a
  // status the frontend sends you directly - always ask the provider.
  if (payload.provider === 'mock') {
    const verified = payload.provider_payment_id.startsWith('mock_')
    const amount = payload.plan === 'yearly' ? 799 : 99
    return { verified, amount }
  }

  // Unknown/unimplemented provider - fail closed.
  return { verified: false, amount: 0 }
}

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth' }), { status: 401 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Client scoped to the caller's own JWT, just to find out who they are.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: userData, error: userErr } = await callerClient.auth.getUser()
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })
    }
    const parentId = userData.user.id

    const body: VerifyRequest = await req.json()
    if (!body.provider || !body.provider_payment_id || !body.plan) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }

    const result = await verifyWithProvider(body)

    // Service-role client - the only place in this whole project allowed to
    // write payments/subscriptions.
    const admin = createClient(supabaseUrl, serviceKey)

    const { data: payment, error: paymentErr } = await admin
      .from('payments')
      .insert({
        parent_id: parentId,
        provider: body.provider,
        provider_payment_id: body.provider_payment_id,
        amount: result.amount,
        status: result.verified ? 'verified' : 'failed'
      })
      .select()
      .single()

    if (paymentErr) {
      return new Response(JSON.stringify({ error: paymentErr.message }), { status: 500 })
    }

    if (!result.verified) {
      return new Response(JSON.stringify({ verified: false }), { status: 200 })
    }

    const durationDays = body.plan === 'yearly' ? 365 : 30
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()

    const { data: subscription, error: subErr } = await admin
      .from('subscriptions')
      .insert({
        parent_id: parentId,
        plan: body.plan,
        status: 'active',
        expires_at: expiresAt
      })
      .select()
      .single()

    if (subErr) {
      return new Response(JSON.stringify({ error: subErr.message }), { status: 500 })
    }

    await admin.from('payments').update({ subscription_id: subscription.id }).eq('id', payment.id)

    return new Response(JSON.stringify({ verified: true, subscription }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
})
