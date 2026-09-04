import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export interface ChildProgressSummary {
  totalStars: number
  writingActivities: number
  lettersTraced: string[]
  numbersTraced: string[]
  quizCorrect: number
  quizTotal: number
  badgeIds: string[]
  weakSubjects: string[]
}

const EMPTY: ChildProgressSummary = {
  totalStars: 0,
  writingActivities: 0,
  lettersTraced: [],
  numbersTraced: [],
  quizCorrect: 0,
  quizTotal: 0,
  badgeIds: [],
  weakSubjects: []
}

export async function getChildProgressSummary(childId: string): Promise<ChildProgressSummary> {
  if (!isSupabaseConfigured) return EMPTY

  const { data: progressRows } = await supabase.from('progress').select('*').eq('child_id', childId)
  const { data: badgeRows } = await supabase.from('child_badges').select('badge_id').eq('child_id', childId)

  const rows = progressRows ?? []
  const writing = rows.filter((r) => r.activity_type === 'writing')
  const quiz = rows.filter((r) => r.activity_type === 'quiz')

  const bySubjectWrong: Record<string, number> = {}
  for (const r of quiz) {
    if (r.correct === false && r.subject_id) {
      bySubjectWrong[r.subject_id] = (bySubjectWrong[r.subject_id] ?? 0) + 1
    }
  }
  const weakSubjects = Object.entries(bySubjectWrong)
    .filter(([, count]) => count >= 2)
    .map(([subject]) => subject)

  return {
    totalStars: rows.reduce((sum, r) => sum + (r.stars_earned ?? 0), 0),
    writingActivities: writing.length,
    lettersTraced: Array.from(new Set(writing.filter((r) => r.subject_id === 'english').map((r) => r.ref_id as string))),
    numbersTraced: Array.from(new Set(writing.filter((r) => r.subject_id === 'numbers').map((r) => r.ref_id as string))),
    quizCorrect: quiz.filter((r) => r.correct).length,
    quizTotal: quiz.length,
    badgeIds: (badgeRows ?? []).map((b) => b.badge_id as string),
    weakSubjects
  }
}
