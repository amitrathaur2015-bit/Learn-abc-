import { useEffect, useState } from 'react'
import { getTemplates } from '../../data/tracingTemplates'
import { hindiSwarIds } from '../../data/hindiLetters'
import { loadAdminTemplates } from '../../services/templateService'
import type { CharacterTemplate } from '../../types/tracing'

interface Props {
  subject: 'english' | 'numbers' | 'hindi'
  onBack: () => void
  onPick: (charId: string) => void
}

const TITLES = {
  english: '🔤 English A-Z',
  numbers: '🔢 Numbers',
  hindi: '🅰️ Hindi अ-ह'
}

function CharGrid({ items, cols, onPick }: { items: CharacterTemplate[]; cols: 3 | 4; onPick: (id: string) => void }) {
  return (
    <div className={`grid gap-3 ${cols === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
      {items.map((c) => (
        <button
          key={c.id}
          onClick={() => onPick(c.id)}
          className={`sticker-card font-display flex aspect-square items-center justify-center rounded-3xl bg-white font-extrabold text-ink ${
            cols === 4 ? 'text-3xl' : 'text-4xl'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

export default function CharacterPicker({ subject, onBack, onPick }: Props) {
  const [, setTick] = useState(0)

  // Pull in any letters/numbers the admin added, then redraw the list.
  useEffect(() => {
    let cancelled = false
    loadAdminTemplates().then(() => {
      if (!cancelled) setTick((t) => t + 1)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const chars = getTemplates(subject)
  const swar = chars.filter((c) => hindiSwarIds.includes(c.id))
  const vyanjan = chars.filter((c) => !hindiSwarIds.includes(c.id))

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
          <h1 className="font-display text-xl font-extrabold text-ink">{TITLES[subject]}</h1>
          <p className="text-sm text-ink/50">Pick one to practice</p>
        </div>
      </header>

      {subject === 'hindi' ? (
        <>
          <h2 className="mb-2 font-display font-extrabold text-ink">स्वर (Swar)</h2>
          <CharGrid items={swar} cols={4} onPick={onPick} />
          <h2 className="mb-2 mt-6 font-display font-extrabold text-ink">व्यंजन (Vyanjan)</h2>
          <CharGrid items={vyanjan} cols={4} onPick={onPick} />
        </>
      ) : (
        <CharGrid items={chars} cols={3} onPick={onPick} />
      )}

      <p className="mt-6 text-center text-sm text-ink/40">More letters and numbers are on the way! ✨</p>
    </div>
  )
}
