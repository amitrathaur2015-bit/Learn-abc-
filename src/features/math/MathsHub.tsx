import ScreenHeader from '../../components/ScreenHeader'
import AdSlot from '../../components/AdSlot'
import { MATHS_TOPICS } from '../../data/mathsContent'

interface Props {
  onBack: () => void
  onOpen: (topicId: string) => void
}

export default function MathsHub({ onBack, onOpen }: Props) {
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🔢 Maths" subtitle="Numbers, counting and more" onBack={onBack} />
      <div className="flex flex-col gap-3">
        {MATHS_TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => t.ready && onOpen(t.id)}
            className={`sticker-card flex items-center gap-3 rounded-3xl bg-white px-5 py-4 text-left ${
              !t.ready && 'opacity-50'
            }`}
          >
            <span className="text-3xl">{t.emoji}</span>
            <span className="font-display text-lg font-extrabold text-ink">{t.title}</span>
            {!t.ready && <span className="ml-auto text-xs font-bold text-ink/40">Soon</span>}
          </button>
        ))}
      </div>
      <AdSlot placement="subject" />
    </div>
  )
}
