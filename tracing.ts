// Types for the reusable Writing / Tracing engine.
// One engine drives English letters, Hindi characters (future) and numbers -
// see src/data/tracingTemplates.ts for the actual content.

export type WritingSubject = 'english' | 'hindi' | 'numbers'

export interface Point {
  x: number
  y: number
}

/** A single pen-stroke of a character, expressed as an SVG path `d` string
 *  on a shared 300x300 viewBox. Multi-stroke characters (like "A" or "B")
 *  are an ordered array of these. */
export interface StrokeTemplate {
  id: string
  d: string
  /** Where the child should start this stroke - shown as a friendly dot. */
  startPoint: Point
}

export interface CharacterTemplate {
  id: string
  subject: WritingSubject
  /** What is displayed on cards / headers, e.g. "A" or "1". */
  label: string
  strokes: StrokeTemplate[]
  /** 1 = easiest. Reserved for future sequencing/unlock logic. */
  difficulty: number
}

export type TracingLevel = 1 | 2 | 3 | 4 | 5

export interface LevelInfo {
  level: TracingLevel
  title: string
  subtitle: string
  emoji: string
}
