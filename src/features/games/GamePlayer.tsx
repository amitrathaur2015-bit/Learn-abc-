import QuizEngine from '../../components/QuizEngine'
import MemoryGame from './MemoryGame'
import CountingGame from './CountingGame'
import { GAMES } from './GamesHub'
import { findCachedGame } from '../../services/contentOverrideService'
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
  const builtIn = GAMES.find((g) => g.id === gameId)
  // Games made in the Admin Panel aren't in GAMES - the Games hub remembered them.
  const game = builtIn ?? findCachedGame(gameId)
  if (!game) return null

  if (game.id === 'memory-animals' || (!builtIn && game.engine === 'memory')) return <MemoryGame onBack={onBack} />
  if (game.id === 'counting-objects' || (!builtIn && game.engine === 'counting')) return <CountingGame onBack={onBack} />

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

  return <QuizEngine title={game.title} questions={questions} onFinish={onBack} slug={`game-${game.id}`} />
}
