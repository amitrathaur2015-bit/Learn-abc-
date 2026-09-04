import type { AlphabetEntry, WordCard, QuizQuestion } from './models'

// Only A, B, C have a real Writing Practice template today (see
// tracingTemplates.ts). The rest are flagged hasTracing: false so the UI can
// honestly show "Writing practice coming soon" instead of a broken link.
const TRACED = new Set(['A', 'B', 'C'])

const WORDS: Record<string, { word: string; emoji: string }> = {
  A: { word: 'Apple', emoji: '🍎' },
  B: { word: 'Ball', emoji: '⚽' },
  C: { word: 'Cat', emoji: '🐱' },
  D: { word: 'Dog', emoji: '🐶' },
  E: { word: 'Elephant', emoji: '🐘' },
  F: { word: 'Fish', emoji: '🐟' },
  G: { word: 'Grapes', emoji: '🍇' },
  H: { word: 'Hat', emoji: '🎩' },
  I: { word: 'Ice cream', emoji: '🍦' },
  J: { word: 'Jug', emoji: '🏺' },
  K: { word: 'Kite', emoji: '🪁' },
  L: { word: 'Lion', emoji: '🦁' },
  M: { word: 'Mango', emoji: '🥭' },
  N: { word: 'Nest', emoji: '🪺' },
  O: { word: 'Orange', emoji: '🍊' },
  P: { word: 'Pen', emoji: '🖊️' },
  Q: { word: 'Queen', emoji: '👑' },
  R: { word: 'Rabbit', emoji: '🐰' },
  S: { word: 'Sun', emoji: '☀️' },
  T: { word: 'Tiger', emoji: '🐯' },
  U: { word: 'Umbrella', emoji: '☂️' },
  V: { word: 'Van', emoji: '🚐' },
  W: { word: 'Watch', emoji: '⌚' },
  X: { word: 'Xylophone', emoji: '🎶' },
  Y: { word: 'Yoyo', emoji: '🪀' },
  Z: { word: 'Zebra', emoji: '🦓' }
}

export const ALPHABET: AlphabetEntry[] = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(65 + i)
  const w = WORDS[letter]
  return { letter, word: w.word, emoji: w.emoji, hasTracing: TRACED.has(letter) }
})

export const SIMPLE_WORDS: WordCard[] = [
  { id: 'apple', word: 'Apple', emoji: '🍎' },
  { id: 'ball', word: 'Ball', emoji: '⚽' },
  { id: 'cat', word: 'Cat', emoji: '🐱' },
  { id: 'dog', word: 'Dog', emoji: '🐶' },
  { id: 'sun', word: 'Sun', emoji: '☀️' },
  { id: 'pen', word: 'Pen', emoji: '🖊️' },
  { id: 'bag', word: 'Bag', emoji: '🎒' }
]

export const CLASS1_QUESTIONS: QuizQuestion[] = [
  {
    id: 'c1-1',
    prompt: 'Which picture shows "Apple"?',
    options: [
      { id: 'a', label: 'Apple', emoji: '🍎' },
      { id: 'b', label: 'Ball', emoji: '⚽' },
      { id: 'c', label: 'Cat', emoji: '🐱' }
    ],
    correctId: 'a'
  },
  {
    id: 'c1-2',
    prompt: 'What sound does this word start with: "Dog"?',
    options: [
      { id: 'd', label: 'D' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' }
    ],
    correctId: 'd'
  },
  {
    id: 'c1-3',
    prompt: 'Choose the correct spelling for 🐱',
    options: [
      { id: 'cat', label: 'CAT' },
      { id: 'cta', label: 'CTA' },
      { id: 'atc', label: 'ATC' }
    ],
    correctId: 'cat'
  },
  {
    id: 'c1-4',
    prompt: 'Which one completes: "The ___ is shining."',
    options: [
      { id: 'sun', label: 'Sun', emoji: '☀️' },
      { id: 'pen', label: 'Pen', emoji: '🖊️' },
      { id: 'bag', label: 'Bag', emoji: '🎒' }
    ],
    correctId: 'sun'
  }
]
