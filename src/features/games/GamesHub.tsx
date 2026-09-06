import ScreenHeader from '../../components/ScreenHeader'
import AdSlot from '../../components/AdSlot'
import type { GameConfig } from '../../data/models'

export const GAMES: GameConfig[] = [
  { id: 'letter-picture', title: 'Letter-Picture Match', emoji: '🔤', engine: 'match', description: 'Match each letter to its picture' },
  { id: 'number-match', title: 'Number Match', emoji: '🔢', engine: 'match', description: 'Match numbers to groups of objects' },
  { id: 'memory-animals', title: 'Memory Cards', emoji: '🃏', engine: 'memory', description: 'Flip and find matching pairs' },
  { id: 'missing-number', title: 'Missing Number', emoji: '🧩', engine: 'missing-number', description: 'Find the number that is missing' },
  { id: 'counting-objects', title: 'Counting Objects', emoji: '🍎', engine: 'counting', description: 'Count and choose the right number' },
  { id: 'correct-word', title: 'Choose the Word', emoji: '✅', engine: 'quiz', description: 'Pick the correct word for the picture' },
  { id: 'correct-letter', title: 'Choose the Letter', emoji: '🔡', engine: 'quiz', description: 'Pick the correct starting letter' },
  { id: 'general-quiz', title: 'Simple Quiz', emoji: '🧠', engine: 'quiz', description: 'A little bit of everything' }
]

export default function GamesHub({ onBack, onPlay }: { onBack: () => void; onPlay: (id: string) => void }) {
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🎮 Learning Games" subtitle="Short, fun and educational" onBack={onBack} />
      <div className="flex flex-col gap-3">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => onPlay(g.id)}
            className="sticker-card flex items-center gap-3 rounded-3xl bg-white px-5 py-4 text-left"
          >
            <span className="text-3xl">{g.emoji}</span>
            <span>
              <span className="block font-display text-base font-extrabold text-ink">{g.title}</span>
              <span className="block text-xs text-ink/50">{g.description}</span>
            </span>
          </button>
        ))}
      </div>
      <AdSlot placement="games" />
    </div>
  )
}
