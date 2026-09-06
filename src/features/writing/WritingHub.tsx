import { useEffect, useState } from 'react'
import { fetchWritingSubjects, type WritingSubjectCard } from '../../services/contentService'
import StickerCard from '../../components/StickerCard'

interface Props {
  onBack: () => void
  onPickSubject: (id: WritingSubjectCard['id']) => void
}

export default function WritingHub({ onBack, onPickSubject }: Props) {
  const [subjects, setSubjects] = useState<WritingSubjectCard[]>([])

  useEffect(() => {
    fetchWritingSubjects().then(setSubjects)
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <header className="mb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sticker"
          aria-label="Back to home"
        >
          ⬅️
        </button>
        <div>
          <h1 className="font-display text-xl font-extrabold text-ink">✍️ Writing Practice</h1>
          <p className="text-sm text-ink/50">What would you like to write?</p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {subjects.map((s) => (
          <div key={s.id} className="relative">
            <StickerCard
              title={s.title}
              emoji={s.emoji}
              color={s.color}
              subtitle={s.ready ? undefined : 'Coming soon'}
              onClick={() => s.ready && onPickSubject(s.id)}
            />
            {!s.ready && <div className="absolute inset-0 rounded-3xl bg-white/40" />}
          </div>
        ))}
      </div>
    </div>
  )
}
