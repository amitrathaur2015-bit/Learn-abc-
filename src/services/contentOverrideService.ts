import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import type { QuizQuestion, GameConfig } from '../data/models'

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

// Remembers the last list of admin games the Games hub loaded, so the game
// screen can look up a game's title/engine without fetching again.
let cachedGames: GameConfig[] = []

/** Published games created in the Admin Panel (empty if none / not configured). */
export async function getPublishedGames(): Promise<GameConfig[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data } = await supabase.from('games').select('*').eq('is_published', true).order('title')
    cachedGames = (data ?? []).map((g) => ({
      id: g.id as string,
      title: g.title as string,
      emoji: (g.emoji as string | null) ?? '🎮',
      engine: g.engine as GameConfig['engine'],
      description: (g.description as string | null) ?? ''
    }))
    return cachedGames
  } catch {
    return []
  }
}

export function findCachedGame(id: string): GameConfig | undefined {
  return cachedGames.find((g) => g.id === id)
}
