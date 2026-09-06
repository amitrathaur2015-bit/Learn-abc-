import { useEffect, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import { BADGES } from '../../data/rewardsContent'
import { getProgress, type ProgressState } from '../../services/progressService'

export default function RewardsPage({ onBack }: { onBack: () => void }) {
  const [progress, setProgress] = useState<ProgressState | null>(null)

  useEffect(() => {
    getProgress().then(setProgress)
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🏆 My Rewards" subtitle="Keep learning to earn more!" onBack={onBack} />

      <div className="sticker-card mb-6 flex items-center justify-center gap-2 rounded-3xl bg-sun py-6">
        <span className="text-4xl">⭐</span>
        <span className="font-display text-3xl font-extrabold text-ink">{progress?.stars ?? 0}</span>
        <span className="font-display text-lg font-bold text-ink/70">stars</span>
      </div>

      <h2 className="mb-3 font-display font-extrabold text-ink">Badges</h2>
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((b) => {
          const earned = progress?.badges.includes(b.id) ?? false
          return (
            <div
              key={b.id}
              className={`sticker-card rounded-3xl p-4 text-center ${earned ? 'bg-white' : 'bg-white/50 opacity-60'}`}
            >
              <div className="text-4xl">{earned ? b.emoji : '🔒'}</div>
              <p className="mt-1 font-display text-sm font-extrabold text-ink">{b.title}</p>
              <p className="text-xs text-ink/50">{b.description}</p>
            </div>
          )
        })}
      </div>

      {progress && (
        <div className="mt-6 rounded-2xl bg-white/70 p-4 text-sm text-ink/60">
          <p>✍️ Writing activities completed: {progress.writingActivitiesCompleted}</p>
          <p>🧠 Quiz questions correct: {progress.correctAnswers} / {progress.totalAnswers}</p>
        </div>
      )}
    </div>
  )
}
