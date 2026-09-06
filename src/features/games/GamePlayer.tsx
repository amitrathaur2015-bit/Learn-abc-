import QuizEngine from '../../components/QuizEngine'
import MemoryGame from './MemoryGame'
import CountingGame from './CountingGame'
import { GAMES } from './GamesHub'
import {
  makeLetterPictureQuestions,
  makeNumberMatchQuestions,
  makeWordQuestions,
  makeLetterSoundQuestions,
  makeMissingNumberQuestions,
  makeGeneralQuizQuestions
} from './gameData'

interface Props {
  gameId: string
  onBack: () => void
}

export default function GamePlayer({ gameId, onBack }: Props) {
  const game = GAMES.find((g) => g.id === gameId)
  if (!game) return null

  if (game.id === 'memory-animals') return <MemoryGame onBack={onBack} />
  if (game.id === 'counting-objects') return <CountingGame onBack={onBack} />

  const questions =
    game.id === 'letter-picture'
      ? makeLetterPictureQuestions()
      : game.id === 'number-match'
      ? makeNumberMatchQuestions()
      : game.id === 'correct-word'
      ? makeWordQuestions()
      : game.id === 'correct-letter'
      ? makeLetterSoundQuestions()
      : game.id === 'missing-number'
      ? makeMissingNumberQuestions()
      : makeGeneralQuizQuestions()

  return <QuizEngine title={game.title} questions={questions} onFinish={onBack} />
}
