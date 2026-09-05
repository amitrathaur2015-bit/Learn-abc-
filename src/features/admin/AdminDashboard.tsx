import { useEffect, useState } from 'react'
import { getAdminStats, type AdminStats } from '../../services/adminDataService'
import { getMonetizationSettings, type MonetizationSettings } from '../../services/monetizationService'
import { getAdSettings, type AdSettings } from '../../services/adsService'
import MiniBarChart from '../../components/MiniBarChart'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [monetization, setMonetization] = useState<MonetizationSettings | null>(null)
  const [ads, setAds] = useState<AdSettings | null>(null)

  useEffect(() => {
    getAdminStats().then(setStats)
    getMonetizationSettings().then(setMonetization)
    getAdSettings().then(setAds)
  }, [])

  if (!stats) return <p className="text-center text-ink/50">Loading...</p>

  const cards: { label: string; value: number | string; emoji: string }[] = [
    { label: 'Total Users', value: stats.totalUsers, emoji: '👨\u200d👩\u200d👦' },
    { label: 'Free Users', value: stats.freeUsers, emoji: '🆓' },
    { label: 'Premium Users', value: stats.premiumUsers, emoji: '👑' },
    { label: 'Active Subscriptions', value: stats.activeSubscriptions, emoji: '📦' },
    { label: 'Free Usage Events', value: stats.totalUsageEvents, emoji: '⏳' },
    { label: 'Referrals', value: stats.totalReferrals, emoji: '🔗' },
    { label: 'Rewarded Referrals', value: stats.rewardedReferrals, emoji: '🎁' },
    { label: 'Revenue (verified)', value: `₹${stats.revenue}`, emoji: '💰' }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="sticker-card rounded-2xl bg-white p-4 text-center">
            <div className="text-2xl">{c.emoji}</div>
            <div className="font-display text-xl font-extrabold text-ink">{c.value}</div>
            <div className="text-xs text-ink/50">{c.label}</div>
          </div>
        ))}
      </div>

      <MiniBarChart
        title="Learning Activity"
        bars={[
          { label: 'Writing', value: stats.writingActivities, color: '#FF6F61' },
          { label: 'Quiz', value: stats.quizActivities, color: '#9B5DE5' }
        ]}
      />

      {monetization && ads && (
        <div className="rounded-2xl bg-white p-4 text-sm">
          <p className="mb-2 font-display font-extrabold text-ink">Configuration Status</p>
          <ConfigRow label="Paid System" on={monetization.paid_system_enabled} />
          <ConfigRow label="Free Usage Limit" on={monetization.free_limit_enabled} detail={`${monetization.free_limit_count} uses`} />
          <ConfigRow label="Referral System" on={monetization.referral_enabled} />
          <ConfigRow label="Ads (master)" on={monetization.ads_enabled} />
          {monetization.ads_enabled && (
            <p className="mt-1 pl-4 text-xs text-ink/40">
              Home: {ads.home_page_ads ? 'On' : 'Off'} · Subjects: {ads.subject_page_ads ? 'On' : 'Off'} · Games:{' '}
              {ads.games_ads ? 'On' : 'Off'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function ConfigRow({ label, on, detail }: { label: string; on: boolean; detail?: string }) {
  return (
    <p className="flex items-center justify-between py-0.5">
      <span className="text-ink/60">{label}</span>
      <span className={`font-bold ${on ? 'text-leaf' : 'text-ink/30'}`}>
        {on ? 'ON' : 'OFF'} {detail && on ? `· ${detail}` : ''}
      </span>
    </p>
  )
}
