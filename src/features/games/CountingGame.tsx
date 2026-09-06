import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import BadgeToast from '../../components/BadgeToast'
import { recordQuizAnswer, recordQuizFinished, type BadgeUnlock } from '../../services/progressService'

const ROUNDS = [3, 5, 7, 4, 6, 8]

export default function CountingGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [badge, setBadge] = useState<BadgeUnlock | null>(null)
  const [done, setDone] = useState(false)

  const target = ROUNDS[round]
  const options = buildOptions(target)

  const choose = async (n: number) => {
    if (selected !== null) return
    setSelected(n)
    const b = await recordQuizAnswer(n === target)
    if (b) setBadge(b)
  }

  const next = async () => {
    if (round + 1 < ROUNDS.length) {
      setRound((r) => r + 1)
      setSelected(null)
    } else {
      await recordQuizFinished()
      setDone(true)
    }
  }

  const restart = () => {
    setRound(0)
    setSelected(null)
    setDone(false)
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <ScreenHeader title="🍎 Counting Objects" onBack={onBack} />
        <div className="text-6xl">🎉</div>
        <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">Great counting!</h2>
        <button onClick={restart} className="mt-6 rounded-2xl bg-coral px-6 py-3 font-display font-extrabold text-white shadow-sticker">
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🍎 Counting Objects" subtitle={`Round ${round + 1}/${ROUNDS.length}`} onBack={onBack} />

      <div className="sticker-card mb-6 flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white p-6">
        {Array.from({ length: target }).map((_, i) => (
          <span key={i} className="text-4xl">
            🍎
          </span>
        ))}
      </div>

      <p className="mb-4 text-center font-display text-lg font-extrabold text-ink">How many apples do you see?</p>

      <div className="grid grid-cols-3 gap-3">
        {options.map((n) => {
          const showState = selected !== null
          const isCorrect = n === target
          const isChosen = n === selected
          return (
            <button
              key={n}
              onClick={() => choose(n)}
              disabled={selected !== null}
              className={`sticker-card rounded-2xl py-4 font-display text-2xl font-extrabold ${
                showState && isCorrect ? 'bg-leaf text-white' : showState && isChosen ? 'bg-coral/80 text-white' : 'bg-white text-ink'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className="mt-6 text-center">
          <p className="font-display text-lg font-bold text-ink">{selected === target ? 'Great job! ⭐' : 'Almost there! 😊'}</p>
          <button onClick={next} className="mt-3 rounded-2xl bg-grape px-6 py-3 font-display font-extrabold text-white shadow-sticker">
            {round + 1 < ROUNDS.length ? 'Next →' : 'Finish 🎉'}
          </button>
        </div>
      )}

      {badge && <BadgeToast badge={badge} onClose={() => setBadge(null)} />}
    </div>
  )
}

function buildOptions(correct: number): number[] {
  const set = new Set<number>([correct])
  while (set.size < 3) {
    const candidate = Math.max(1, correct + Math.floor(Math.random() * 5) - 2)
    set.add(candidate)
  }
  return Array.from(set).sort(() => Math.random() - 0.5)
}
