import ScreenHeader from '../../components/ScreenHeader'
import AdSlot from '../../components/AdSlot'
import { COLORS, SHAPES } from '../../data/colorsShapesContent'
import { speak } from '../../services/audioService'

interface Props {
  onBack: () => void
  onPlayQuiz: (kind: 'colors' | 'shapes') => void
}

export default function ColorsShapesHub({ onBack, onPlayQuiz }: Props) {
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🎨 Colors & Shapes" subtitle="Tap to hear the name" onBack={onBack} />

      <h2 className="mb-2 font-display font-extrabold text-ink">Colors</h2>
      <div className="mb-3 grid grid-cols-4 gap-3">
        {COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => speak(c.name, 'en-IN')}
            className="sticker-card flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl bg-white p-1"
          >
            <span
              className="h-8 w-8 rounded-full border border-ink/10"
              style={{ backgroundColor: c.hex }}
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold text-ink/70">{c.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => onPlayQuiz('colors')}
        className="mb-6 w-full rounded-2xl bg-sun py-2.5 font-display font-extrabold text-ink shadow-sticker"
      >
        🎯 Play "Find the Color"
      </button>

      <h2 className="mb-2 font-display font-extrabold text-ink">Shapes</h2>
      <div className="mb-3 grid grid-cols-5 gap-2">
        {SHAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => speak(s.name, 'en-IN')}
            className="sticker-card flex aspect-square flex-col items-center justify-center rounded-2xl bg-white"
          >
            <span className="text-2xl">{s.emoji}</span>
            <span className="text-[10px] font-bold text-ink/70">{s.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => onPlayQuiz('shapes')}
        className="w-full rounded-2xl bg-leaf py-2.5 font-display font-extrabold text-white shadow-sticker"
      >
        🎯 Play "Find the Shape"
      </button>
      <AdSlot placement="subject" />
    </div>
  )
}
