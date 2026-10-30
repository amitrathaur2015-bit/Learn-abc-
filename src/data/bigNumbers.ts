import type { CharacterTemplate, StrokeTemplate } from '../types/tracing'

// How far the numbers go (2-digit numbers only: up to 99). Raise this number
// to add more numbers to Writing Practice.
export const MAX_NUMBER = 99

// The digit 0 (the built-in list in tracingTemplates.ts starts at 1).
export const zeroTemplate: CharacterTemplate = {
  id: '0',
  subject: 'numbers',
  label: '0',
  difficulty: 1,
  strokes: [
    {
      id: '0-1',
      d: 'M150,46 C108,46 86,92 86,150 C86,208 108,244 150,244 C192,244 214,208 214,150 C214,92 192,46 150,46',
      startPoint: { x: 150, y: 46 }
    }
  ]
}

// Two-digit numbers are built from the single digits, each squeezed to half
// width so that both fit side by side on the same 300x300 board.
const SCALE = 0.5
const LEFT_X = 82
const RIGHT_X = 218

function squeeze(d: string, centerX: number): string {
  return d.replace(
    /(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g,
    (_m, x: string, y: string) => `${Math.round(centerX + (Number(x) - 150) * SCALE)},${y}`
  )
}

let cache: CharacterTemplate[] | null = null

/** Templates for 10 .. MAX_NUMBER, made from the given single-digit templates (0-9). */
export function getBigNumbers(digits: CharacterTemplate[]): CharacterTemplate[] {
  if (cache) return cache
  const byId = new Map<string, CharacterTemplate>(digits.map((t) => [t.id, t]))
  const out: CharacterTemplate[] = []

  for (let n = 10; n <= Math.min(MAX_NUMBER, 99); n++) {
    const text = String(n)
    const strokes: StrokeTemplate[] = []
    let complete = true

    text.split('').forEach((ch, i) => {
      const glyph = byId.get(ch)
      if (!glyph) {
        complete = false
        return
      }
      const cx = i === 0 ? LEFT_X : RIGHT_X
      glyph.strokes.forEach((s) =>
        strokes.push({
          id: `${n}-${i}-${s.id}`,
          d: squeeze(s.d, cx),
          startPoint: { x: Math.round(cx + (s.startPoint.x - 150) * SCALE), y: s.startPoint.y }
        })
      )
    })

    if (complete) out.push({ id: text, subject: 'numbers', label: text, difficulty: 4, strokes })
  }

  cache = out
  return out
}
