import type { QuizQuestion } from '../../data/models'
import { ALPHABET, SIMPLE_WORDS } from '../../data/englishContent'
import { GK_TOPICS } from '../../data/gkContent'
import { COLORS } from '../../data/colorsShapesContent'

function pickThreeById<T extends { id: string }>(all: T[], correctId: string): T[] {
  const others = all.filter((x) => x.id !== correctId)
  const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 2)
  const correct = all.find((x) => x.id === correctId)!
  return [correct, ...shuffled].sort(() => Math.random() - 0.5)
}

/** "Letter-Picture Match" - shown as: here's a letter, tap its picture. */
export function makeLetterPictureQuestions(): QuizQuestion[] {
  const sample = [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, 6)
  const pool = ALPHABET.map((a) => ({ id: a.letter, emoji: a.emoji, word: a.word }))
  return sample.map((a, i) => {
    const options = pickThreeById(pool, a.letter)
    return {
      id: `lp-${i}`,
      prompt: `Which picture matches the letter "${a.letter}"?`,
      options: options.map((o) => ({ id: o.id, label: o.word, emoji: o.emoji })),
      correctId: a.letter
    }
  })
}

/** "Number Match" - shown as: here's a number, tap the matching group of objects. */
export function makeNumberMatchQuestions(): QuizQuestion[] {
  const numbers = [2, 3, 4, 5, 6]
  return numbers.map((n, i) => {
    const options = new Set<number>([n])
    while (options.size < 3) {
      const candidate = Math.max(1, n + Math.floor(Math.random() * 5) - 2)
      options.add(candidate)
    }
    const shuffled = Array.from(options).sort(() => Math.random() - 0.5)
    return {
      id: `nm-${i}`,
      prompt: `Which group has ${n} apples?`,
      options: shuffled.map((v) => ({ id: String(v), label: '🍎'.repeat(v) })),
      correctId: String(n)
    }
  })
}

/** "Choose the Word" - picture shown, pick the matching word. */
export function makeWordQuestions(): QuizQuestion[] {
  return SIMPLE_WORDS.map((w, i) => {
    const options = pickThreeById(
      SIMPLE_WORDS.map((x) => ({ id: x.id, label: x.word })),
      w.id
    )
    return {
      id: `word-${i}`,
      prompt: `${w.emoji}  What is this called?`,
      options,
      correctId: w.id
    }
  })
}

/** "Choose the Letter" - picture shown, pick the starting letter. */
export function makeLetterSoundQuestions(): QuizQuestion[] {
  const sample = [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, 6)
  return sample.map((a, i) => {
    const letterPool = ALPHABET.map((x) => ({ id: x.letter, label: x.letter }))
    const options = pickThreeById(letterPool, a.letter)
    return {
      id: `ls-${i}`,
      prompt: `${a.emoji}  Which letter does this start with?`,
      options,
      correctId: a.letter
    }
  })
}

/** "Missing Number" - a short number sequence with one number hidden. */
export function makeMissingNumberQuestions(): QuizQuestion[] {
  const starts = [1, 3, 5]
  return starts.map((start, i) => {
    const sequence = [start, start + 1, start + 2, start + 3, start + 4]
    const hiddenIndex = 1 + Math.floor(Math.random() * 3)
    const answer = sequence[hiddenIndex]
    const display = sequence.map((n, idx) => (idx === hiddenIndex ? '❓' : String(n))).join(', ')
    const options = new Set<number>([answer])
    while (options.size < 3) {
      const candidate = Math.max(1, answer + Math.floor(Math.random() * 5) - 2)
      options.add(candidate)
    }
    return {
      id: `miss-${i}`,
      prompt: `What number is missing? ${display}`,
      options: Array.from(options)
        .sort(() => Math.random() - 0.5)
        .map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(answer)
    }
  })
}

/** "Simple Quiz" - a small general-knowledge mix across subjects. */
export function makeGeneralQuizQuestions(): QuizQuestion[] {
  const animalTopic = GK_TOPICS.find((t) => t.id === 'animals')!
  const animalItem = animalTopic.items[0]
  const animalOptions = animalTopic.items.slice(0, 3)

  const colorItem = COLORS[0]
  const colorOptions = pickThreeById(COLORS, colorItem.id)

  const wordItem = SIMPLE_WORDS[0]
  const wordOptions = pickThreeById(
    SIMPLE_WORDS.map((x) => ({ id: x.id, label: x.word })),
    wordItem.id
  )

  return [
    {
      id: 'gq-1',
      prompt: `Which one is a ${animalItem.name}?`,
      options: animalOptions.map((o) => ({ id: o.name, label: o.name, emoji: o.emoji })),
      correctId: animalItem.name
    },
    {
      id: 'gq-2',
      prompt: `Which one is the color ${colorItem.name}?`,
      options: colorOptions.map((o) => ({ id: o.id, label: o.name })),
      correctId: colorItem.id
    },
    {
      id: 'gq-3',
      prompt: `${wordItem.emoji}  What is this called?`,
      options: wordOptions,
      correctId: wordItem.id
    }
  ]
}
