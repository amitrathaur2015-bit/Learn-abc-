// Shared shapes for learning content: Subject -> Topic -> Lesson -> Activity.
// Everything here is plain data. Screens read it through contentService.ts,
// never hard-coded inline, so moving this to Supabase later only means
// rewriting the fetch functions in contentService.ts.

export interface AlphabetEntry {
  letter: string
  word: string
  emoji: string
  /** Whether the existing Writing Practice engine has a real template for this letter yet. */
  hasTracing: boolean
}

export interface WordCard {
  id: string
  word: string
  emoji: string
}

export interface HindiEntry {
  char: string
  roman: string
  category: 'swar' | 'vyanjan'
  hasTracing: boolean
}

export interface QuizOption {
  id: string
  label: string
  emoji?: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: QuizOption[]
  correctId: string
}

export interface GkTopic {
  id: string
  title: string
  emoji: string
  items: { name: string; emoji: string }[]
}

export interface ColorItem {
  id: string
  name: string
  hex: string
}

export interface ShapeItem {
  id: string
  name: string
  emoji: string
}

export interface Badge {
  id: string
  title: string
  emoji: string
  description: string
}

export interface GameConfig {
  id: string
  title: string
  emoji: string
  engine: 'match' | 'memory' | 'quiz' | 'missing-number' | 'counting'
  description: string
}
