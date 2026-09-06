import { useEffect, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import { getMonetizationSettings, type MonetizationSettings } from '../../services/monetizationService'
import { purchasePlan } from '../../services/paymentService'

export default function PricingPage({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [settings, setSettings] = useState<MonetizationSettings | null>(null)
  const [busyPlan, setBusyPlan] = useState<'monthly' | 'yearly' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getMonetizationSettings().then(setSettings)
  }, [])

  const buy = async (plan: 'monthly' | 'yearly') => {
    if (!settings) return
    setBusyPlan(plan)
    setError(null)
    const amount = plan === 'monthly' ? settings.monthly_price : settings.yearly_price
    const result = await purchasePlan(plan, amount, settings.currency)
    setBusyPlan(null)
    if (result.verified) setSuccess(true)
    else setError(result.error ?? 'Payment could not be verified. Please try again.')
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">Premium Unlocked!</h2>
        <button onClick={onSuccess} className="mt-6 rounded-2xl bg-coral px-6 py-3 font-display font-extrabold text-white shadow-sticker">
          Continue
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="💳 Choose a Plan" onBack={onBack} />
      {settings && (
        <div className="flex flex-col gap-4">
          <PlanCard
            title="Monthly"
            price={`₹${settings.monthly_price} / month`}
            busy={busyPlan === 'monthly'}
            onBuy={() => buy('monthly')}
          />
          <PlanCard
            title="Yearly"
            price={`₹${settings.yearly_price} / year`}
            badge="Best Value"
            busy={busyPlan === 'yearly'}
            onBuy={() => buy('yearly')}
          />
        </div>
      )}
      {error && <p className="mt-4 text-center text-sm font-semibold text-coral">{error}</p>}
      <p className="mt-6 text-center text-xs text-ink/40">
        This demo uses a test payment provider - it always verifies your purchase on the server before unlocking premium, exactly
        like a real gateway would.
      </p>
    </div>
  )
}

function PlanCard({ title, price, badge, busy, onBuy }: { title: string; price: string; badge?: string; busy: boolean; onBuy: () => void }) {
  return (
    <div className="sticker-card relative rounded-3xl bg-white p-5">
      {badge && <span className="absolute -top-2 right-4 rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink">{badge}</span>}
      <p className="font-display text-lg font-extrabold text-ink">{title}</p>
      <p className="text-ink/60">{price}</p>
      <button
        onClick={onBuy}
        disabled={busy}
        className="mt-3 w-full rounded-2xl bg-grape py-2.5 font-display font-extrabold text-white shadow-sticker disabled:opacity-60"
      >
        {busy ? 'Processing...' : 'Choose'}
      </button>
    </div>
  )
}
