import ScreenHeader from '../../components/ScreenHeader'
import AdSlot from '../../components/AdSlot'
import { GK_TOPICS } from '../../data/gkContent'

interface Props {
  onBack: () => void
  onOpen: (topicId: string) => void
}

export default function GkHub({ onBack, onOpen }: Props) {
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🌍 General Knowledge" subtitle="Explore and learn" onBack={onBack} />
      <div className="grid grid-cols-2 gap-3">
        {GK_TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => onOpen(t.id)}
            className="sticker-card flex flex-col items-center gap-1 rounded-3xl bg-white py-5"
          >
            <span className="text-4xl">{t.emoji}</span>
            <span className="font-display text-sm font-extrabold text-ink">{t.title}</span>
          </button>
        ))}
      </div>
      <AdSlot placement="subject" />
    </div>
  )
}
