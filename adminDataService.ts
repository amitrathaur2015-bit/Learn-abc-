import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export interface AdminStats {
  totalUsers: number
  premiumUsers: number
  freeUsers: number
  activeSubscriptions: number
  totalActivities: number
  writingActivities: number
  quizActivities: number
  totalUsageEvents: number
  totalReferrals: number
  rewardedReferrals: number
  revenue: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const empty: AdminStats = {
    totalUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    activeSubscriptions: 0,
    totalActivities: 0,
    writingActivities: 0,
    quizActivities: 0,
    totalUsageEvents: 0,
    totalReferrals: 0,
    rewardedReferrals: 0,
    revenue: 0
  }
  if (!isSupabaseConfigured) return empty

  const [
    { count: totalUsers },
    { count: activeSubs },
    { count: totalActivities },
    { count: writingActivities },
    { count: quizActivities },
    { count: totalUsageEvents },
    { data: referrals },
    { data: payments }
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString()),
    supabase.from('progress').select('id', { count: 'exact', head: true }),
    supabase.from('progress').select('id', { count: 'exact', head: true }).eq('activity_type', 'writing'),
    supabase.from('progress').select('id', { count: 'exact', head: true }).eq('activity_type', 'quiz'),
    supabase.from('usage_events').select('id', { count: 'exact', head: true }),
    supabase.from('referrals').select('status'),
    supabase.from('payments').select('amount, status').eq('status', 'verified')
  ])

  const premium = activeSubs ?? 0
  const total = totalUsers ?? 0

  return {
    totalUsers: total,
    premiumUsers: premium,
    freeUsers: Math.max(0, total - premium),
    activeSubscriptions: premium,
    totalActivities: totalActivities ?? 0,
    writingActivities: writingActivities ?? 0,
    quizActivities: quizActivities ?? 0,
    totalUsageEvents: totalUsageEvents ?? 0,
    totalReferrals: referrals?.length ?? 0,
    rewardedReferrals: referrals?.filter((r) => r.status === 'rewarded').length ?? 0,
    revenue: (payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0)
  }
}

export interface AdminLesson {
  id: string
  title: string
  description: string | null
  subject_id: string | null
  level_id: string | null
  is_premium: boolean
  is_published: boolean
}

export async function listLessons(): Promise<AdminLesson[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('lessons').select('*').order('created_at', { ascending: false })
  return (data as AdminLesson[]) ?? []
}

export async function saveLesson(lesson: Partial<AdminLesson> & { title: string }): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  if (lesson.id) {
    const { error } = await supabase.from('lessons').update(lesson).eq('id', lesson.id)
    return { error: error?.message }
  }
  const { error } = await supabase.from('lessons').insert(lesson)
  return { error: error?.message }
}

export async function deleteLesson(id: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('lessons').delete().eq('id', id)
  return { error: error?.message }
}

export interface AdminQuizQuestion {
  id: string
  quiz_id: string
  prompt: string
  options: { id: string; label: string; emoji?: string }[]
  correct_option_id: string
}

export async function listQuizQuestions(quizId: string): Promise<AdminQuizQuestion[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizId).order('sort_order')
  return (data as AdminQuizQuestion[]) ?? []
}

export async function listQuizzes(): Promise<{ id: string; title: string }[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('quizzes').select('id, title').order('created_at', { ascending: false })
  return data ?? []
}

export async function createQuiz(title: string): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase.from('quizzes').insert({ title, is_published: true }).select('id').single()
  if (error) return null
  return data
}

export async function saveQuizQuestion(q: Partial<AdminQuizQuestion> & { quiz_id: string; prompt: string }): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  if (q.id) {
    const { error } = await supabase.from('quiz_questions').update(q).eq('id', q.id)
    return { error: error?.message }
  }
  const { error } = await supabase.from('quiz_questions').insert(q)
  return { error: error?.message }
}

export async function deleteQuizQuestion(id: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('quiz_questions').delete().eq('id', id)
  return { error: error?.message }
}

// ---- Writing Templates (letters/numbers) ----
export interface AdminWritingTemplate {
  id: string
  subject: 'english' | 'hindi' | 'numbers'
  label: string
  difficulty: number
  is_published: boolean
}

export async function listWritingTemplates(): Promise<AdminWritingTemplate[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('writing_templates').select('*').order('subject').order('id')
  return (data as AdminWritingTemplate[]) ?? []
}

export async function saveWritingTemplate(t: AdminWritingTemplate): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('writing_templates').upsert(t)
  return { error: error?.message }
}

export async function deleteWritingTemplate(id: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('writing_templates').delete().eq('id', id)
  return { error: error?.message }
}

export interface AdminTracingPath {
  id: string
  template_id: string
  stroke_order: number
  path_d: string
  start_x: number
  start_y: number
}

export async function listTracingPaths(templateId: string): Promise<AdminTracingPath[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('tracing_paths').select('*').eq('template_id', templateId).order('stroke_order')
  return (data as AdminTracingPath[]) ?? []
}

export async function saveTracingPath(p: Partial<AdminTracingPath> & { template_id: string; path_d: string }): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  if (p.id) {
    const { error } = await supabase.from('tracing_paths').update(p).eq('id', p.id)
    return { error: error?.message }
  }
  const { error } = await supabase.from('tracing_paths').insert(p)
  return { error: error?.message }
}

export async function deleteTracingPath(id: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('tracing_paths').delete().eq('id', id)
  return { error: error?.message }
}

// ---- Games ----
export interface AdminGame {
  id: string
  title: string
  emoji: string | null
  engine: string
  description: string | null
  is_premium: boolean
  is_published: boolean
}

export async function listGames(): Promise<AdminGame[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('games').select('*').order('title')
  return (data as AdminGame[]) ?? []
}

export async function saveGame(g: AdminGame): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('games').upsert(g)
  return { error: error?.message }
}

export async function deleteGame(id: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('games').delete().eq('id', id)
  return { error: error?.message }
}
