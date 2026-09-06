import { getTemplates } from '../../data/tracingTemplates'

interface Props {
  subject: 'english' | 'numbers'
  onBack: () => void
  onPick: (charId: string) => void
}

export default function CharacterPicker({ subject, onBack, onPick }: Props) {
  const chars = getTemplates(subject)

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <header className="mb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sticker"
          aria-label="Back"
        >
          ⬅️
        </button>
        <div>
          <h1 className="font-display text-xl font-extrabold text-ink">
            {subject === 'english' ? '🔤 English A-Z' : '🔢 Numbers'}
          </h1>
          <p className="text-sm text-ink/50">Pick one to practice</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {chars.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            className="sticker-card font-display flex aspect-square items-center justify-center rounded-3xl bg-white text-4xl font-extrabold text-ink"
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-ink/40">
        More letters and numbers are on the way! ✨
      </p>
    </div>
  )
}
