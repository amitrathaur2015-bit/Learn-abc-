import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

// Provider-agnostic on purpose (the brief: "do not hard-code a payment
// provider unless instructed"). Whatever gateway gets chosen later
// (Razorpay is the common choice for Indian UPI/cards), it plugs in here as
// one more PaymentProvider - nothing in the UI needs to change.
export interface PaymentProvider {
  id: string
  /** Opens the provider's checkout and resolves with the id it gives the
   *  payment once the user completes it - never with a "success" boolean,
   *  since that must always be re-checked server-side afterwards. */
  charge(plan: 'monthly' | 'yearly', amount: number, currency: string): Promise<{ providerPaymentId: string }>
}

/** Stand-in provider so the whole flow (checkout -> server verification ->
 *  subscription unlock) can be tested before a real gateway is wired in.
 *  Swap MockProvider for a RazorpayProvider/StripeProvider later - the rest
 *  of this file, and every screen that calls purchasePlan(), stays the same. */
class MockProvider implements PaymentProvider {
  id = 'mock'
  async charge(_plan: 'monthly' | 'yearly', _amount: number, _currency: string): Promise<{ providerPaymentId: string }> {
    await new Promise((r) => setTimeout(r, 600))
    return { providerPaymentId: `mock_${Date.now()}` }
  }
}

const activeProvider: PaymentProvider = new MockProvider()

export interface PurchaseResult {
  verified: boolean
  error?: string
}

/** The only correct way to grant premium: charge through the provider, then
 *  ALWAYS hand the resulting payment id to the verify-payment edge function
 *  and trust only what it returns. Never set local/premium state directly
 *  from the checkout callback. */
export async function purchasePlan(plan: 'monthly' | 'yearly', amount: number, currency: string): Promise<PurchaseResult> {
  if (!isSupabaseConfigured) return { verified: false, error: 'not_configured' }

  const { providerPaymentId } = await activeProvider.charge(plan, amount, currency)

  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { provider: activeProvider.id, provider_payment_id: providerPaymentId, plan }
    })
    if (error) return { verified: false, error: error.message }
    return { verified: Boolean(data?.verified) }
  } catch (e) {
    return { verified: false, error: String(e) }
  }
}
