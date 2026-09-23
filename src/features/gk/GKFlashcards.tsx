import { useEffect, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import SpeakerButton from '../../components/SpeakerButton'
import { speak } from '../../services/audioService'
import type { GkTopic } from '../../data/models'

interface Props {
  topic: GkTopic
  onBack: () => void
  onPlayQuiz?: () => void
}

export default function GkFlashcards({ topic, onBack, onPlayQuiz }: Props) {
  const [index, setIndex] = useState(0)
  const item = topic.items[index]

  useEffect(() => {
    speak(item.name, 'en-IN')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, topic.id])

  const next = () => setIndex((i) => (i + 1) % topic.items.length)
  const prev = () => setIndex((i) => (i - 1 + topic.items.length) % topic.items.length)

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10 pt-6">
      <ScreenHeader title={`${topic.emoji} ${topic.title}`} subtitle="Say it out loud with me!" onBack={onBack} />

      <div className="sticker-card mx-auto flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-3xl bg-white py-10">
        <div className="text-[9rem] leading-none">{item.emoji}</div>
        <div className="flex items-center gap-3">
          <p className="font-display text-3xl font-extrabold text-ink">{item.name}</p>
          <SpeakerButton text={item.name} />
        </div>
        <p className="text-sm font-semibold text-ink/40">
          {index + 1} / {topic.items.length}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={prev}
          className="flex-1 rounded-2xl bg-white py-3 font-display text-lg font-extrabold text-ink shadow-sticker"
        >
          ⬅️ Back
        </button>
        <button
          onClick={next}
          className="flex-1 rounded-2xl bg-coral py-3 font-display text-lg font-extrabold text-white shadow-sticker"
        >
          Next ➡️
        </button>
      </div>

      {onPlayQuiz && (
        <button
          onClick={onPlayQuiz}
          className="mt-3 w-full rounded-2xl bg-grape py-3 font-display font-extrabold text-white shadow-sticker"
        >
          🧠 Play {topic.title} Quiz
        </button>
      )}
    </div>
  )
}
