import { useEffect, useState, type ReactNode } from 'react'
import { getMonetizationSettings, updateMonetizationSettings, type MonetizationSettings } from '../../services/monetizationService'

export default function AdminMonetization() {
  const [settings, setSettings] = useState<MonetizationSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getMonetizationSettings().then(setSettings)
  }, [])

  if (!settings) return <p className="text-center text-ink/50">Loading...</p>

  const patch = (p: Partial<MonetizationSettings>) => setSettings({ ...settings, ...p })

  const save = async () => {
    setSaving(true)
    setSaved(false)
    await updateMonetizationSettings(settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <Toggle label="Ads" checked={settings.ads_enabled} onChange={(v) => patch({ ads_enabled: v })} />
      <Toggle label="Paid System" checked={settings.paid_system_enabled} onChange={(v) => patch({ paid_system_enabled: v })} />
      <Toggle label="Referral System" checked={settings.referral_enabled} onChange={(v) => patch({ referral_enabled: v })} />
      <Toggle label="Free Usage Limit" checked={settings.free_limit_enabled} onChange={(v) => patch({ free_limit_enabled: v })} />

      <Field label="Free Uses Allowed">
        <select
          value={settings.free_limit_count}
          onChange={(e) => patch({ free_limit_count: Number(e.target.value) })}
          className="w-full rounded-2xl bg-white px-4 py-2.5 shadow-inner"
        >
          {[10, 15, 20, 30, 999999].map((n) => (
            <option key={n} value={n}>
              {n >= 999999 ? 'Unlimited' : n}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Monthly Price (₹)">
        <input
          type="number"
          value={settings.monthly_price}
          onChange={(e) => patch({ monthly_price: Number(e.target.value) })}
          className="w-full rounded-2xl bg-white px-4 py-2.5 shadow-inner"
        />
      </Field>

      <Field label="Yearly Price (₹)">
        <input
          type="number"
          value={settings.yearly_price}
          onChange={(e) => patch({ yearly_price: Number(e.target.value) })}
          className="w-full rounded-2xl bg-white px-4 py-2.5 shadow-inner"
        />
      </Field>

      <Field label="Referral Reward (days of premium)">
        <input
          type="number"
          value={settings.referral_reward_value}
          onChange={(e) => patch({ referral_reward_value: Number(e.target.value) })}
          className="w-full rounded-2xl bg-white px-4 py-2.5 shadow-inner"
        />
      </Field>

      <Field label="Max Referral Reward (days)">
        <input
          type="number"
          value={settings.referral_max_reward}
          onChange={(e) => patch({ referral_max_reward: Number(e.target.value) })}
          className="w-full rounded-2xl bg-white px-4 py-2.5 shadow-inner"
        />
      </Field>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-sticker disabled:opacity-60"
      >
        {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Settings'}
      </button>
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sticker"
    >
      <span className="font-display font-bold text-ink">{label}</span>
      <span className={`h-6 w-11 rounded-full p-0.5 transition ${checked ? 'bg-leaf' : 'bg-ink/20'}`}>
        <span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink/60">{label}</span>
      {children}
    </label>
  )
}
