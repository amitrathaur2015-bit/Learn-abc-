import type { ColorItem, ShapeItem, QuizQuestion } from './models'

export const COLORS: ColorItem[] = [
  { id: 'red', name: 'Red', hex: '#E5484D' },
  { id: 'blue', name: 'Blue', hex: '#2E9FD8' },
  { id: 'green', name: 'Green', hex: '#3E9B4C' },
  { id: 'yellow', name: 'Yellow', hex: '#FFC93C' },
  { id: 'orange', name: 'Orange', hex: '#FF8A3D' },
  { id: 'pink', name: 'Pink', hex: '#FF8FB3' },
  { id: 'black', name: 'Black', hex: '#2B2140' },
  { id: 'white', name: 'White', hex: '#FFFFFF' }
]

export const SHAPES: ShapeItem[] = [
  { id: 'circle', name: 'Circle', emoji: '⚪' },
  { id: 'square', name: 'Square', emoji: '⬜' },
  { id: 'triangle', name: 'Triangle', emoji: '🔺' },
  { id: 'rectangle', name: 'Rectangle', emoji: '▭' },
  { id: 'oval', name: 'Oval', emoji: '🥚' }
]

export function makeColorQuestions(): QuizQuestion[] {
  return COLORS.slice(0, 5).map((c, i) => ({
    id: `color-${i}`,
    prompt: `Which one is ${c.name}?`,
    options: pickThree(COLORS, c.id).map((o) => ({ id: o.id, label: o.name })),
    correctId: c.id
  }))
}

export function makeShapeQuestions(): QuizQuestion[] {
  return SHAPES.map((s, i) => ({
    id: `shape-${i}`,
    prompt: `Which one is a ${s.name}?`,
    options: pickThree(SHAPES, s.id).map((o) => ({ id: o.id, label: o.name, emoji: (o as ShapeItem).emoji })),
    correctId: s.id
  }))
}

function pickThree<T extends { id: string }>(all: T[], correctId: string): T[] {
  const others = all.filter((x) => x.id !== correctId)
  const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 2)
  const correct = all.find((x) => x.id === correctId)!
  return [correct, ...shuffled].sort(() => Math.random() - 0.5)
}
