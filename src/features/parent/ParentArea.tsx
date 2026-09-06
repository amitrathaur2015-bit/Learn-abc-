import { useEffect, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import StickerCard from '../../components/StickerCard'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { getCurrentParent, logoutParent, type ParentProfile } from '../../services/authService'
import { listChildren, createChild, selectActiveChild, getActiveChildId, type ChildProfile } from '../../services/childProfileService'
import { getChildProgressSummary, type ChildProgressSummary } from '../../services/parentDataService'
import { getMonetizationSettings, type MonetizationSettings } from '../../services/monetizationService'
import { supabase } from '../../lib/supabaseClient'
import { getReferralInfo, type ReferralInfo } from '../../services/referralService'
import { BADGES } from '../../data/rewardsContent'
import DisplaySettingsPanel from './DisplaySettingsPanel'

interface Props {
  onBack: () => void
  onGoLogin: () => void
  onGoRegister: () => void
  onGoAdmin: () => void
  onGoPricing: () => void
}

export default function ParentArea({ onBack, onGoLogin, onGoRegister, onGoAdmin, onGoPricing }: Props) {
  const [parent, setParent] = useState<ParentProfile | null | 'loading'>('loading')
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [activeChildId, setActiveChildId] = useState<string | null>(null)
  const [summary, setSummary] = useState<ChildProgressSummary | null>(null)
  const [settings, setSettings] = useState<MonetizationSettings | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [referral, setReferral] = useState<ReferralInfo | null>(null)
  const [newChildName, setNewChildName] = useState('')

  useEffect(() => {
    getCurrentParent().then(setParent)
    getMonetizationSettings().then(setSettings)
  }, [])

  useEffect(() => {
    if (!parent || parent === 'loading') return
    listChildren().then((list) => {
      setChildren(list)
      const active = getActiveChildId() ?? list[0]?.id ?? null
      setActiveChildId(active)
    })
    supabase.rpc('has_active_subscription').then(({ data }) => setIsPremium(Boolean(data)))
    getReferralInfo().then(setReferral)
  }, [parent])

  useEffect(() => {
    if (activeChildId) getChildProgressSummary(activeChildId).then(setSummary)
  }, [activeChildId])

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
        <ScreenHeader title="👨‍👩‍👦 Parent Area" onBack={onBack} />
        <DisplaySettingsPanel />
        <div className="rounded-3xl bg-white p-5 text-center text-ink/70">
          <p className="text-4xl">🛠️</p>
          <p className="mt-2 font-display font-bold text-ink">Backend not connected yet</p>
          <p className="mt-1 text-sm">
            Once Supabase is set up (see the README), Parent login, progress reports, premium and referrals will work here.
          </p>
        </div>
      </div>
    )
  }

  if (parent === 'loading') {
    return (
      <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
        <ScreenHeader title="👨‍👩‍👦 Parent Area" onBack={onBack} />
        <p className="text-center text-ink/50">Loading...</p>
      </div>
    )
  }

  if (!parent) {
    return (
      <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
        <ScreenHeader title="👨‍👩‍👦 Parent Area" subtitle="Login to see progress, premium & referrals" onBack={onBack} />
        <DisplaySettingsPanel />
        <div className="flex flex-col gap-3">
          <StickerCard title="Login" emoji="🔑" color="sky" onClick={onGoLogin} />
          <StickerCard title="Create Parent Account" emoji="✨" color="coral" onClick={onGoRegister} />
        </div>
      </div>
    )
  }

  const addChild = async () => {
    if (!newChildName.trim()) return
    const child = await createChild(newChildName.trim())
    if (child) {
      setChildren((c) => [...c, child])
      setActiveChildId(child.id)
      setNewChildName('')
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader
        title="👨‍👩‍👦 Parent Area"
        subtitle={parent.full_name ?? parent.email ?? ''}
        onBack={onBack}
        right={
          <button onClick={async () => { await logoutParent(); setParent(null) }} className="text-xs font-bold text-ink/50 underline">
            Logout
          </button>
        }
      />

      {parent.role === 'admin' && (
        <button onClick={onGoAdmin} className="mb-4 w-full rounded-2xl bg-ink py-2.5 font-display font-extrabold text-white shadow-sticker">
          🛠️ Open Admin Panel
        </button>
      )}

      <DisplaySettingsPanel />

      {/* Child profile */}
      <section className="mb-5">
        <h2 className="mb-2 font-display font-extrabold text-ink">Child Profile</h2>
        {children.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  selectActiveChild(c.id)
                  setActiveChildId(c.id)
                }}
                className={`rounded-full px-4 py-2 font-display text-sm font-bold ${
                  activeChildId === c.id ? 'bg-coral text-white' : 'bg-white text-ink'
                }`}
              >
                {c.avatar_emoji} {c.name}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            placeholder="Add a child's name"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            className="flex-1 rounded-2xl bg-white px-4 py-2.5 shadow-inner"
          />
          <button onClick={addChild} className="rounded-2xl bg-leaf px-4 py-2.5 font-display font-extrabold text-white shadow-sticker">
            Add
          </button>
        </div>
      </section>

      {/* Progress */}
      {activeChildId && summary && (
        <section className="mb-5">
          <h2 className="mb-2 font-display font-extrabold text-ink">Progress</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Stars" value={summary.totalStars} emoji="⭐" />
            <StatCard label="Writing activities" value={summary.writingActivities} emoji="✍️" />
            <StatCard label="Letters traced" value={summary.lettersTraced.length} emoji="🔤" />
            <StatCard label="Numbers traced" value={summary.numbersTraced.length} emoji="🔢" />
            <StatCard label="Quiz correct" value={`${summary.quizCorrect}/${summary.quizTotal}`} emoji="🧠" />
            <StatCard label="Badges" value={summary.badgeIds.length} emoji="🏆" />
          </div>
          {summary.weakSubjects.length > 0 && (
            <p className="mt-3 rounded-2xl bg-white p-3 text-sm text-ink/60">
              💡 Could use more practice in: <span className="font-bold">{summary.weakSubjects.join(', ')}</span>
            </p>
          )}
          {summary.badgeIds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {summary.badgeIds.map((id) => {
                const b = BADGES.find((x) => x.id === id)
                if (!b) return null
                return (
                  <span key={id} className="rounded-full bg-sun px-3 py-1 text-sm font-bold text-ink">
                    {b.emoji} {b.title}
                  </span>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Premium */}
      <section className="mb-5">
        <h2 className="mb-2 font-display font-extrabold text-ink">Premium</h2>
        <div className="rounded-2xl bg-white p-4">
          {isPremium ? (
            <p className="font-display font-bold text-leaf">✅ Premium is active</p>
          ) : settings?.paid_system_enabled ? (
            <>
              <p className="text-sm text-ink/60">Unlock premium lessons, extra games and parent reports.</p>
              <button onClick={onGoPricing} className="mt-2 rounded-2xl bg-grape px-5 py-2.5 font-display font-extrabold text-white shadow-sticker">
                See Plans 💳
              </button>
            </>
          ) : (
            <p className="text-sm text-ink/50">Everything is free right now.</p>
          )}
        </div>
      </section>

      {/* Referral */}
      {settings?.referral_enabled && referral && (
        <section className="mb-5">
          <h2 className="mb-2 font-display font-extrabold text-ink">Refer & Earn</h2>
          <div className="rounded-2xl bg-white p-4 text-sm">
            <p className="text-ink/60">Share your code - when a friend joins and their child starts learning, you both benefit.</p>
            <p className="mt-2 font-display text-lg font-extrabold text-coral">{referral.code}</p>
            <p className="mt-1 break-all text-xs text-ink/40">{referral.link}</p>
            <p className="mt-2 text-ink/60">
              Referred: <span className="font-bold">{referral.referredCount}</span> · Rewarded:{' '}
              <span className="font-bold">{referral.rewardedCount}</span>
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({ label, value, emoji }: { label: string; value: number | string; emoji: string }) {
  return (
    <div className="sticker-card rounded-2xl bg-white p-3 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="font-display text-xl font-extrabold text-ink">{value}</div>
      <div className="text-xs text-ink/50">{label}</div>
    </div>
  )
}
