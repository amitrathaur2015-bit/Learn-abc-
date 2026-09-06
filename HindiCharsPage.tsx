import ScreenHeader from '../../components/ScreenHeader'
import { SWAR, VYANJAN } from '../../data/hindiContent'
import { speak } from '../../services/audioService'

interface Props {
  category: 'swar' | 'vyanjan'
  onBack: () => void
}

export default function HindiCharsPage({ category, onBack }: Props) {
  const list = category === 'swar' ? SWAR : VYANJAN

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader
        title={category === 'swar' ? 'अ Swar' : 'क Vyanjan'}
        subtitle="Tap to hear the sound"
        onBack={onBack}
      />
      <div className="grid grid-cols-4 gap-3">
        {list.map((entry) => (
          <button
            key={entry.char}
            onClick={() => speak(entry.char, 'hi-IN')}
            className="sticker-card flex aspect-square flex-col items-center justify-center rounded-3xl bg-white"
          >
            <span className="font-display text-3xl font-extrabold text-ink">{entry.char}</span>
            <span className="text-xs text-ink/40">{entry.roman}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
