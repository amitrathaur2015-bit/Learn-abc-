import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import SpeakerButton from '../../components/SpeakerButton'
import { ALPHABET } from '../../data/englishContent'
import type { AlphabetEntry } from '../../data/models'
import { speak } from '../../services/audioService'

interface Props {
  onBack: () => void
  onPractice: (letter: string) => void
}

export default function AlphabetPage({ onBack, onPractice }: Props) {
  const [open, setOpen] = useState<AlphabetEntry | null>(null)

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🔡 Alphabet A-Z" subtitle="Tap a letter to hear it" onBack={onBack} />

      <div className="grid grid-cols-3 gap-3">
        {ALPHABET.map((entry) => (
          <button
            key={entry.letter}
            onClick={() => {
              setOpen(entry)
              speak(`${entry.letter}, ${entry.letter} for ${entry.word}`, 'en-IN')
            }}
            className="sticker-card flex aspect-square flex-col items-center justify-center rounded-3xl bg-white"
          >
            <span className="font-display text-3xl font-extrabold text-ink">{entry.letter}</span>
            <span className="text-2xl">{entry.emoji}</span>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6" onClick={() => setOpen(null)}>
          <div
            className="animate-pop w-full max-w-xs rounded-3xl bg-paper p-6 text-center shadow-sticker"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display text-6xl font-extrabold text-ink">{open.letter}</div>
            <div className="mt-1 text-5xl">{open.emoji}</div>
            <p className="mt-2 font-display text-xl font-bold text-ink">
              {open.letter} for {open.word}
            </p>
            <div className="mt-3 flex justify-center">
              <SpeakerButton text={`${open.letter}, ${open.letter} for ${open.word}`} />
            </div>
            <div className="mt-5 flex flex-col gap-2">
              {open.hasTracing ? (
                <button
                  onClick={() => onPractice(open.letter)}
                  className="rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-stickerPress"
                >
                  ✍️ Practice Writing
                </button>
              ) : (
                <p className="rounded-2xl bg-white py-3 text-sm font-semibold text-ink/50">
                  Writing practice for this letter is coming soon
                </p>
              )}
              <button onClick={() => setOpen(null)} className="rounded-2xl bg-white py-3 font-display font-extrabold text-ink">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
