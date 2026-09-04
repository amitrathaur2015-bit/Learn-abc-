import { BADGES } from '../data/rewardsContent'
import { syncWritingCompletion, syncQuizAnswer, syncBadgeEarned } from './cloudSyncService'
import { tryQualifyReferral } from './referralService'

export interface ProgressState {
  writingActivitiesCompleted: number
  lettersTraced: string[]
  numbersTraced: string[]
  quizzesTaken: number
  correctAnswers: number
  totalAnswers: number
  stars: number
  badges: string[]
  audioMuted: boolean
}

const EMPTY_STATE: ProgressState = {
  writingActivitiesCompleted: 0,
  lettersTraced: [],
  numbersTraced: [],
  quizzesTaken: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  stars: 0,
  badges: [],
  audioMuted: false
}

/** Any storage backend just has to implement this. Today it's localStorage;
 *  swapping in Supabase later means writing one new class that implements
 *  this same interface - nothing else in the app needs to change. */
interface ProgressBackend {
  load(): Promise<ProgressState>
  save(state: ProgressState): Promise<void>
}

class LocalStorageBackend implements ProgressBackend {
  private key = 'chhota-scholar-progress'

  async load(): Promise<ProgressState> {
    try {
      const raw = localStorage.getItem(this.key)
      if (!raw) return { ...EMPTY_STATE }
      return { ...EMPTY_STATE, ...JSON.parse(raw) }
    } catch {
      return { ...EMPTY_STATE }
    }
  }

  async save(state: ProgressState): Promise<void> {
    try {
      localStorage.setItem(this.key, JSON.stringify(state))
    } catch {
      // Storage might be unavailable (private browsing etc.) - fail silently,
      // the app still works, progress just won't persist this session.
    }
  }
}

const backend: ProgressBackend = new LocalStorageBackend()

type Listener = (state: ProgressState) => void
const listeners = new Set<Listener>()
let cache: ProgressState | null = null

async function ensureLoaded(): Promise<ProgressState> {
  if (!cache) cache = await backend.load()
  return cache
}

export async function getProgress(): Promise<ProgressState> {
  return ensureLoaded()
}

export function subscribeToProgress(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

async function commit(next: ProgressState) {
  cache = next
  await backend.save(next)
  listeners.forEach((l) => l(next))
}

export interface BadgeUnlock {
  id: string
  title: string
  emoji: string
}

/** Records one writing-level completion and returns any badge newly unlocked. */
export async function recordWritingCompletion(subject: 'english' | 'numbers', charId: string): Promise<BadgeUnlock | null> {
  const state = await ensureLoaded()
  const next: ProgressState = {
    ...state,
    writingActivitiesCompleted: state.writingActivitiesCompleted + 1,
    stars: state.stars + 1,
    lettersTraced:
      subject === 'english' && !state.lettersTraced.includes(charId)
        ? [...state.lettersTraced, charId]
        : state.lettersTraced,
    numbersTraced:
      subject === 'numbers' && !state.numbersTraced.includes(charId)
        ? [...state.numbersTraced, charId]
        : state.numbersTraced
  }
  const unlocked = evaluateBadges(state, next)
  await commit(next)
  syncWritingCompletion(subject, charId)
  if (unlocked) syncBadgeEarned(unlocked.id)
  if (state.writingActivitiesCompleted === 0) tryQualifyReferral()
  return unlocked
}

/** Records a quiz/game question answer and returns any badge newly unlocked. */
export async function recordQuizAnswer(correct: boolean): Promise<BadgeUnlock | null> {
  const state = await ensureLoaded()
  const next: ProgressState = {
    ...state,
    totalAnswers: state.totalAnswers + 1,
    correctAnswers: state.correctAnswers + (correct ? 1 : 0),
    stars: state.stars + (correct ? 1 : 0)
  }
  const unlocked = evaluateBadges(state, next)
  await commit(next)
  syncQuizAnswer(correct)
  if (unlocked) syncBadgeEarned(unlocked.id)
  return unlocked
}

export async function recordQuizFinished(): Promise<void> {
  const state = await ensureLoaded()
  await commit({ ...state, quizzesTaken: state.quizzesTaken + 1 })
}

export async function setAudioMuted(muted: boolean): Promise<void> {
  const state = await ensureLoaded()
  await commit({ ...state, audioMuted: muted })
}

const AVAILABLE_LETTERS = ['A', 'B', 'C']
const AVAILABLE_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function evaluateBadges(before: ProgressState, after: ProgressState): BadgeUnlock | null {
  const newlyEarned: string[] = []

  if (after.writingActivitiesCompleted >= 10 && !after.badges.includes('writing-star')) {
    newlyEarned.push('writing-star')
  }
  if (AVAILABLE_LETTERS.every((l) => after.lettersTraced.includes(l)) && !after.badges.includes('abc-champion')) {
    newlyEarned.push('abc-champion')
  }
  if (AVAILABLE_NUMBERS.every((n) => after.numbersTraced.includes(n)) && !after.badges.includes('number-star')) {
    newlyEarned.push('number-star')
  }
  if (after.correctAnswers >= 20 && !after.badges.includes('quiz-whiz')) {
    newlyEarned.push('quiz-whiz')
  }

  if (newlyEarned.length === 0) return null

  after.badges = [...after.badges, ...newlyEarned]
  const firstId = newlyEarned[0]
  const badge = BADGES.find((b) => b.id === firstId)!
  return { id: badge.id, title: badge.title, emoji: badge.emoji }
}
