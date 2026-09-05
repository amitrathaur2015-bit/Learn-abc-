import ScreenHeader from '../../components/ScreenHeader'
import SpeakerButton from '../../components/SpeakerButton'
import { SIMPLE_WORDS } from '../../data/englishContent'

export default function WordsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="📖 Simple Words" subtitle="Picture, word and sound" onBack={onBack} />
      <div className="grid grid-cols-2 gap-3">
        {SIMPLE_WORDS.map((w) => (
          <div key={w.id} className="sticker-card flex flex-col items-center gap-1 rounded-3xl bg-white p-4">
            <span className="text-5xl">{w.emoji}</span>
            <span className="font-display text-lg font-extrabold text-ink">{w.word}</span>
            <SpeakerButton text={w.word} size="sm" />
          </div>
        ))}
      </div>
    </div>
  )
}
