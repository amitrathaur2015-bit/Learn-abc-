import { useEffect, useState } from 'react'
import { getAdSettings, updateAdSettings, type AdSettings } from '../../services/adsService'
import { getMonetizationSettings, updateMonetizationSettings, type MonetizationSettings } from '../../services/monetizationService'

export default function AdminAds() {
  const [ads, setAds] = useState<AdSettings | null>(null)
  const [monetization, setMonetization] = useState<MonetizationSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getAdSettings().then(setAds)
    getMonetizationSettings().then(setMonetization)
  }, [])

  if (!ads || !monetization) return <p className="text-center text-ink/50">Loading...</p>

  const save = async () => {
    setSaving(true)
    setSaved(false)
    await Promise.all([updateAdSettings(ads), updateMonetizationSettings({ ads_enabled: monetization.ads_enabled })])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-white p-3 text-sm text-ink/60">
        Ads are <span className="font-bold">never</span> shown inside Writing Practice, tracing, or any active learning
        activity - only on browse/home screens, and only for non-premium users when Ads (master) is on below.
      </div>

      <Toggle
        label="Ads (master switch)"
        checked={monetization.ads_enabled}
        onChange={(v) => setMonetization({ ...monetization, ads_enabled: v })}
      />

      <div className={monetization.ads_enabled ? '' : 'pointer-events-none opacity-40'}>
        <p className="mb-2 text-sm font-bold text-ink/50">Placements</p>
        <div className="flex flex-col gap-3">
          <Toggle label="Home Page Ads" checked={ads.home_page_ads} onChange={(v) => setAds({ ...ads, home_page_ads: v })} />
          <Toggle label="Subject Page Ads" checked={ads.subject_page_ads} onChange={(v) => setAds({ ...ads, subject_page_ads: v })} />
          <Toggle label="Learning Games Ads" checked={ads.games_ads} onChange={(v) => setAds({ ...ads, games_ads: v })} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-3 text-xs text-ink/50">
        Provider: <span className="font-bold">{ads.provider === 'none' ? 'Not connected yet' : ads.provider}</span> - a real ad
        network can be wired into <code>src/services/adsService.ts</code> later without changing any screen.
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-sticker disabled:opacity-60"
      >
        {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Ads Settings'}
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
