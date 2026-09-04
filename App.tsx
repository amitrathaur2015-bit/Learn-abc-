import { Suspense, lazy, useState } from 'react'
import HomePage from './pages/HomePage'
import WritingHub from './features/writing/WritingHub'
import CharacterPicker from './features/writing/CharacterPicker'
import TracingPage from './features/writing/TracingPage'
import EnglishHub from './features/english/EnglishHub'
import AlphabetPage from './features/english/AlphabetPage'
import WordsPage from './features/english/WordsPage'
import HindiHub from './features/hindi/HindiHub'
import HindiCharsPage from './features/hindi/HindiCharsPage'
import MathsHub from './features/maths/MathsHub'
import ColorsShapesHub from './features/colorsShapes/ColorsShapesHub'
import GkHub from './features/gk/GkHub'
import GkTopicPage from './features/gk/GkTopicPage'
import GamesHub from './features/games/GamesHub'
import GamePlayer from './features/games/GamePlayer'
import RewardsPage from './features/rewards/RewardsPage'
import QuizEngine from './components/QuizEngine'
import { CLASS1_QUESTIONS } from './data/englishContent'
import { makeCountingQuestions, makeBeforeAfterQuestions, makeCompareQuestions, makeAdditionQuestions } from './data/mathsContent'
import { makeColorQuestions, makeShapeQuestions } from './data/colorsShapesContent'
import { makeGkQuiz } from './data/gkContent'
import UsageGate from './features/paywall/UsageGate'

// These screens are never needed for a child just playing/learning - a
// parent only reaches them a handful of times. Lazy-loading keeps them out
// of the bundle the child waits on at startup, which matters on low-end
// Android devices. Everything above stays a normal (eager) import since it's
// part of the core, most-used experience.
const LoginPage = lazy(() => import('./features/auth/LoginPage'))
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'))
const ResetPasswordPage = lazy(() => import('./features/auth/ResetPasswordPage'))
const ParentArea = lazy(() => import('./features/parent/ParentArea'))
const PricingPage = lazy(() => import('./features/parent/PricingPage'))
const AdminHub = lazy(() => import('./features/admin/AdminHub'))

function ScreenLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="animate-pulse text-4xl">✨</span>
    </div>
  )
}

type WritingSubject = 'english' | 'numbers'

type Screen =
  | { name: 'home' }
  | { name: 'writing-hub' }
  | { name: 'writing-picker'; subject: WritingSubject }
  | { name: 'tracing'; subject: WritingSubject; charId: string }
  | { name: 'english-hub' }
  | { name: 'english-alphabet' }
  | { name: 'english-words' }
  | { name: 'english-class1' }
  | { name: 'hindi-hub' }
  | { name: 'hindi-chars'; category: 'swar' | 'vyanjan' }
  | { name: 'maths-hub' }
  | { name: 'maths-quiz'; topicId: string }
  | { name: 'colors-shapes-hub' }
  | { name: 'colors-shapes-quiz'; kind: 'colors' | 'shapes' }
  | { name: 'gk-hub' }
  | { name: 'gk-topic'; topicId: string }
  | { name: 'gk-quiz'; topicId: string }
  | { name: 'games-hub' }
  | { name: 'game'; gameId: string }
  | { name: 'rewards' }
  | { name: 'login' }
  | { name: 'register' }
  | { name: 'reset-password' }
  | { name: 'parent-area' }
  | { name: 'pricing' }
  | { name: 'admin' }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const goHome = () => setScreen({ name: 'home' })
  const goParent = () => setScreen({ name: 'parent-area' })

  const openHomeCard = (id: string) => {
    if (id === 'writing') return setScreen({ name: 'writing-hub' })
    if (id === 'english') return setScreen({ name: 'english-hub' })
    if (id === 'hindi') return setScreen({ name: 'hindi-hub' })
    if (id === 'maths') return setScreen({ name: 'maths-hub' })
    if (id === 'games') return setScreen({ name: 'games-hub' })
    if (id === 'shapes') return setScreen({ name: 'colors-shapes-hub' })
    if (id === 'gk') return setScreen({ name: 'gk-hub' })
    if (id === 'rewards') return setScreen({ name: 'rewards' })
    if (id === 'parent') return setScreen({ name: 'parent-area' })
  }

  const content = (() => {
    switch (screen.name) {
      case 'home':
        return <HomePage onOpenCard={openHomeCard} />

    // ---- Writing Practice (Part 1, unchanged) ----
    case 'writing-hub':
      return (
        <WritingHub
          onBack={goHome}
          onPickSubject={(subject) => {
            if (subject === 'hindi') return setScreen({ name: 'hindi-hub' })
            setScreen({ name: 'writing-picker', subject })
          }}
        />
      )
    case 'writing-picker':
      return (
        <CharacterPicker
          subject={screen.subject}
          onBack={() => setScreen({ name: 'writing-hub' })}
          onPick={(charId) => setScreen({ name: 'tracing', subject: screen.subject, charId })}
        />
      )
    case 'tracing':
      return (
        <UsageGate activityType="writing" onBlocked={() => setScreen({ name: 'writing-picker', subject: screen.subject })} onGoPricing={() => setScreen({ name: 'pricing' })}>
          <TracingPage
            subject={screen.subject}
            charId={screen.charId}
            onBack={() => setScreen({ name: 'writing-picker', subject: screen.subject })}
            onPickChar={(charId) => setScreen({ name: 'tracing', subject: screen.subject, charId })}
          />
        </UsageGate>
      )

    // ---- English ----
    case 'english-hub':
      return (
        <EnglishHub
          onBack={goHome}
          onOpen={(section) =>
            setScreen(
              section === 'alphabet'
                ? { name: 'english-alphabet' }
                : section === 'words'
                ? { name: 'english-words' }
                : { name: 'english-class1' }
            )
          }
        />
      )
    case 'english-alphabet':
      return (
        <AlphabetPage
          onBack={() => setScreen({ name: 'english-hub' })}
          onPractice={(letter) => setScreen({ name: 'tracing', subject: 'english', charId: letter })}
        />
      )
    case 'english-words':
      return <WordsPage onBack={() => setScreen({ name: 'english-hub' })} />
    case 'english-class1':
      return (
        <UsageGate activityType="quiz" onBlocked={() => setScreen({ name: 'english-hub' })} onGoPricing={() => setScreen({ name: 'pricing' })}>
          <QuizEngine title="Class 1 Practice" questions={CLASS1_QUESTIONS} onFinish={() => setScreen({ name: 'english-hub' })} />
        </UsageGate>
      )

    // ---- Hindi ----
    case 'hindi-hub':
      return <HindiHub onBack={goHome} onOpen={(section) => setScreen({ name: 'hindi-chars', category: section })} />
    case 'hindi-chars':
      return <HindiCharsPage category={screen.category} onBack={() => setScreen({ name: 'hindi-hub' })} />

    // ---- Maths ----
    case 'maths-hub':
      return (
        <MathsHub
          onBack={goHome}
          onOpen={(topicId) =>
            topicId === 'numbers'
              ? setScreen({ name: 'writing-picker', subject: 'numbers' })
              : setScreen({ name: 'maths-quiz', topicId })
          }
        />
      )
    case 'maths-quiz': {
      const generators: Record<string, () => ReturnType<typeof makeCountingQuestions>> = {
        counting: makeCountingQuestions,
        'before-after': makeBeforeAfterQuestions,
        compare: makeCompareQuestions,
        addition: makeAdditionQuestions
      }
      const gen = generators[screen.topicId] ?? makeCountingQuestions
      return (
        <UsageGate activityType="quiz" onBlocked={() => setScreen({ name: 'maths-hub' })} onGoPricing={() => setScreen({ name: 'pricing' })}>
          <QuizEngine title="Maths" questions={gen()} onFinish={() => setScreen({ name: 'maths-hub' })} />
        </UsageGate>
      )
    }

    // ---- Colors & Shapes ----
    case 'colors-shapes-hub':
      return <ColorsShapesHub onBack={goHome} onPlayQuiz={(kind) => setScreen({ name: 'colors-shapes-quiz', kind })} />
    case 'colors-shapes-quiz':
      return (
        <UsageGate activityType="quiz" onBlocked={() => setScreen({ name: 'colors-shapes-hub' })} onGoPricing={() => setScreen({ name: 'pricing' })}>
          <QuizEngine
            title={screen.kind === 'colors' ? 'Find the Color' : 'Find the Shape'}
            questions={screen.kind === 'colors' ? makeColorQuestions() : makeShapeQuestions()}
            onFinish={() => setScreen({ name: 'colors-shapes-hub' })}
          />
        </UsageGate>
      )

    // ---- GK ----
    case 'gk-hub':
      return <GkHub onBack={goHome} onOpen={(topicId) => setScreen({ name: 'gk-topic', topicId })} />
    case 'gk-topic':
      return (
        <GkTopicPage
          topicId={screen.topicId}
          onBack={() => setScreen({ name: 'gk-hub' })}
          onPlayQuiz={(topicId) => setScreen({ name: 'gk-quiz', topicId })}
        />
      )
    case 'gk-quiz':
      return (
        <UsageGate activityType="quiz" onBlocked={() => setScreen({ name: 'gk-topic', topicId: screen.topicId })} onGoPricing={() => setScreen({ name: 'pricing' })}>
          <QuizEngine title="GK Quiz" questions={makeGkQuiz(screen.topicId)} onFinish={() => setScreen({ name: 'gk-topic', topicId: screen.topicId })} />
        </UsageGate>
      )

    // ---- Games ----
    case 'games-hub':
      return <GamesHub onBack={goHome} onPlay={(gameId) => setScreen({ name: 'game', gameId })} />
    case 'game':
      return (
        <UsageGate activityType="game" onBlocked={() => setScreen({ name: 'games-hub' })} onGoPricing={() => setScreen({ name: 'pricing' })}>
          <GamePlayer gameId={screen.gameId} onBack={() => setScreen({ name: 'games-hub' })} />
        </UsageGate>
      )

    // ---- Rewards ----
    case 'rewards':
      return <RewardsPage onBack={goHome} />

    // ---- Auth ----
    case 'login':
      return (
        <LoginPage
          onBack={goParent}
          onLoggedIn={goParent}
          onGoRegister={() => setScreen({ name: 'register' })}
          onGoReset={() => setScreen({ name: 'reset-password' })}
        />
      )
    case 'register':
      return <RegisterPage onBack={goParent} onRegistered={() => setScreen({ name: 'login' })} onGoLogin={() => setScreen({ name: 'login' })} />
    case 'reset-password':
      return <ResetPasswordPage onBack={goParent} />

    // ---- Parent / Admin / Pricing ----
    case 'parent-area':
      return (
        <ParentArea
          onBack={goHome}
          onGoLogin={() => setScreen({ name: 'login' })}
          onGoRegister={() => setScreen({ name: 'register' })}
          onGoAdmin={() => setScreen({ name: 'admin' })}
          onGoPricing={() => setScreen({ name: 'pricing' })}
        />
      )
    case 'pricing':
      return <PricingPage onBack={goParent} onSuccess={goParent} />
    case 'admin':
      return <AdminHub onBack={goParent} />

    default:
      return <HomePage onOpenCard={openHomeCard} />
    }
  })()

  return <Suspense fallback={<ScreenLoading />}>{content}</Suspense>
}
