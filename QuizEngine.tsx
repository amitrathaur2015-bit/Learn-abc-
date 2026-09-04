import { useState } from 'react'
import type { QuizQuestion } from '../data/models'
import { recordQuizAnswer, recordQuizFinished, type BadgeUnlock } from '../services/progressService'
import BadgeToast from './BadgeToast'

interface Props {
  title: string
  questions: QuizQuestion[]
  onFinish: () => void
}

const RIGHT_MESSAGES = ['Great job! ⭐', 'Excellent! 🎉', 'Superstar! 🌟', 'Well done! 🎈']
const WRONG_MESSAGES = ['Almost there! 😊', 'Try again 😊', "Let's see the answer 🙂"]

export default function QuizEngine({ title, questions, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [unlock, setUnlock] = useState<BadgeUnlock | null>(null)
  const [done, setDone] = useState(false)

  const q = questions[index]

  const choose = async (optionId: string) => {
    if (selected) return
    setSelected(optionId)
    const correct = optionId === q.correctId
    if (correct) setScore((s) => s + 1)
    const badge = await recordQuizAnswer(correct)
    if (badge) setUnlock(badge)
  }

  const next = async () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1)
      setSelected(null)
    } else {
      await recordQuizFinished()
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">Well done!</h2>
        <p className="mt-1 text-ink/60">
          You got {score} out of {questions.length} right.
        </p>
        <button
          onClick={onFinish}
          className="mt-6 rounded-2xl bg-coral px-6 py-3 font-display font-extrabold text-white shadow-sticker"
        >
          Continue
        </button>
        {unlock && <BadgeToast badge={unlock} onClose={() => setUnlock(null)} />}
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <p className="text-center text-sm font-bold uppercase tracking-wide text-ink/40">
        {title} · {index + 1}/{questions.length}
      </p>
      <h2 className="mt-2 text-center font-display text-xl font-extrabold text-ink">{q.prompt}</h2>

      <div className="mt-6 flex flex-col gap-3">
        {q.options.map((opt) => {
          const isCorrect = opt.id === q.correctId
          const isChosen = opt.id === selected
          const showState = selected !== null
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              disabled={selected !== null}
              className={`sticker-card flex items-center justify-center gap-2 rounded-2xl px-5 py-4 font-display text-lg font-extrabold ${
                showState && isCorrect
                  ? 'bg-leaf text-white'
                  : showState && isChosen
                  ? 'bg-coral/80 text-white'
                  : 'bg-white text-ink'
              }`}
            >
              {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
              {opt.label}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="mt-6 text-center">
          <p className="font-display text-lg font-bold text-ink">
            {selected === q.correctId
              ? RIGHT_MESSAGES[Math.floor(Math.random() * RIGHT_MESSAGES.length)]
              : WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)]}
          </p>
          <button
            onClick={next}
            className="mt-3 rounded-2xl bg-grape px-6 py-3 font-display font-extrabold text-white shadow-sticker"
          >
            {index + 1 < questions.length ? 'Next →' : 'Finish 🎉'}
          </button>
        </div>
      )}

      {unlock && <BadgeToast badge={unlock} onClose={() => setUnlock(null)} />}
    </div>
  )
}
