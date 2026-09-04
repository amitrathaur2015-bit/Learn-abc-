import type { QuizQuestion } from './models'

export interface MathsTopic {
  id: string
  title: string
  emoji: string
  ready: boolean
}

// Numbers 1-9 have real Writing Practice templates (see tracingTemplates.ts).
// 10 and beyond need multi-digit tracing support, saved for Part 3.
export const MATHS_TOPICS: MathsTopic[] = [
  { id: 'numbers', title: 'Number Writing (1-9)', emoji: '✍️', ready: true },
  { id: 'counting', title: 'Counting', emoji: '🔢', ready: true },
  { id: 'before-after', title: 'Before, After & Between', emoji: '↔️', ready: true },
  { id: 'compare', title: 'Greater, Smaller & Equal', emoji: '⚖️', ready: true },
  { id: 'addition', title: 'Basic Addition', emoji: '➕', ready: true },
  { id: 'subtraction', title: 'Basic Subtraction', emoji: '➖', ready: false },
  { id: 'shapes', title: 'Shapes', emoji: '🔺', ready: false },
  { id: 'time', title: 'Basic Time', emoji: '🕐', ready: false },
  { id: 'money', title: 'Basic Money', emoji: '🪙', ready: false }
]

export function makeCountingQuestions(): QuizQuestion[] {
  const items = [3, 5, 7, 4, 6]
  return items.map((n, i) => ({
    id: `count-${i}`,
    prompt: `How many 🍎 are there?`,
    options: shuffleNear(n).map((v) => ({ id: String(v), label: String(v) })),
    correctId: String(n)
  }))
}

export function makeBeforeAfterQuestions(): QuizQuestion[] {
  const items: { n: number; kind: 'before' | 'after' | 'between' }[] = [
    { n: 5, kind: 'before' },
    { n: 3, kind: 'after' },
    { n: 6, kind: 'between' }
  ]
  return items.map((it, i) => {
    if (it.kind === 'before') {
      return {
        id: `ba-${i}`,
        prompt: `What number comes just before ${it.n}?`,
        options: shuffleNear(it.n - 1).map((v) => ({ id: String(v), label: String(v) })),
        correctId: String(it.n - 1)
      }
    }
    if (it.kind === 'after') {
      return {
        id: `ba-${i}`,
        prompt: `What number comes just after ${it.n}?`,
        options: shuffleNear(it.n + 1).map((v) => ({ id: String(v), label: String(v) })),
        correctId: String(it.n + 1)
      }
    }
    return {
      id: `ba-${i}`,
      prompt: `What number comes between ${it.n - 1} and ${it.n + 1}?`,
      options: shuffleNear(it.n).map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(it.n)
    }
  })
}

export function makeCompareQuestions(): QuizQuestion[] {
  const pairs: [number, number][] = [
    [3, 7],
    [8, 2],
    [5, 5],
    [4, 9]
  ]
  return pairs.map(([a, b], i) => ({
    id: `cmp-${i}`,
    prompt: `Which is bigger: ${a} or ${b}?`,
    options: [
      { id: 'a', label: String(a) },
      { id: 'b', label: String(b) },
      { id: 'eq', label: 'Equal' }
    ],
    correctId: a === b ? 'eq' : a > b ? 'a' : 'b'
  }))
}

export function makeAdditionQuestions(): QuizQuestion[] {
  const sums: [number, number][] = [
    [1, 1],
    [2, 2],
    [3, 1],
    [2, 3]
  ]
  return sums.map(([a, b], i) => ({
    id: `add-${i}`,
    prompt: `${a} + ${b} = ?`,
    options: shuffleNear(a + b).map((v) => ({ id: String(v), label: String(v) })),
    correctId: String(a + b)
  }))
}

function shuffleNear(correct: number): number[] {
  const set = new Set<number>([correct])
  while (set.size < 3) {
    const candidate = Math.max(0, correct + Math.floor(Math.random() * 5) - 2)
    set.add(candidate)
  }
  return Array.from(set).sort(() => Math.random() - 0.5)
}
