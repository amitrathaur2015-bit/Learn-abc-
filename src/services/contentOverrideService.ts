import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import type { QuizQuestion } from '../data/models'

/** Looks for a published admin-authored quiz with this slug and returns its
 *  questions, or null if none exists / nothing is configured yet - callers
 *  fall back to the app's built-in questions in that case. */
export async function getQuizQuestionsOverride(slug: string): Promise<QuizQuestion[] | null> {
  if (!isSupabaseConfigured) return null
  try {
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('id')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
    if (!quiz) return null

    const { data: rows } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('sort_order')

    if (!rows || rows.length === 0) return null

    return rows.map((r) => ({
      id: r.id,
      prompt: r.prompt,
      options: r.options as QuizQuestion['options'],
      correctId: r.correct_option_id
    }))
  } catch {
    return null
  }
}
