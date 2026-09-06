import ScreenHeader from '../../components/ScreenHeader'
import { GK_TOPICS, GK_QUIZ_TOPICS } from '../../data/gkContent'
import { speak } from '../../services/audioService'

interface Props {
  topicId: string
  onBack: () => void
  onPlayQuiz: (topicId: string) => void
}

export default function GkTopicPage({ topicId, onBack, onPlayQuiz }: Props) {
  const topic = GK_TOPICS.find((t) => t.id === topicId)
  if (!topic) return null
  const hasQuiz = GK_QUIZ_TOPICS.has(topicId)

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title={`${topic.emoji} ${topic.title}`} subtitle="Tap to hear the name" onBack={onBack} />
      <div className="grid grid-cols-3 gap-3">
        {topic.items.map((item) => (
          <button
            key={item.name}
            onClick={() => speak(item.name, 'en-IN')}
            className="sticker-card flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl bg-white p-1 text-center"
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-[11px] font-bold text-ink/70">{item.name}</span>
          </button>
        ))}
      </div>

      {hasQuiz && (
        <button
          onClick={() => onPlayQuiz(topicId)}
          className="mt-6 w-full rounded-2xl bg-grape py-3 font-display font-extrabold text-white shadow-sticker"
        >
          🧠 Play {topic.title} Quiz
        </button>
      )}
    </div>
  )
}
