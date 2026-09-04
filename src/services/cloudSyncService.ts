import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { getActiveChildId } from './childProfileService'

// Every function here is fire-and-forget and fails silently. The local
// progressService (localStorage) is still the source of truth for the
// child's immediate in-app experience (stars, badges, unlock popups) - this
// module only ever ADDS a copy in Supabase, for a signed-in parent with a
// child profile, so the Parent Area has something real to show. Nothing in
// the actual writing/quiz/game screens depends on this succeeding.

async function getSessionParentId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export async function syncWritingCompletion(subject: 'english' | 'numbers', charId: string): Promise<void> {
  const childId = getActiveChildId()
  const parentId = await getSessionParentId()
  if (!childId || !parentId) return
  try {
    await supabase.from('progress').insert({
      child_id: childId,
      activity_type: 'writing',
      subject_id: subject,
      ref_id: charId,
      stars_earned: 1
    })
  } catch {
    // best-effort
  }
}

export async function syncQuizAnswer(correct: boolean, subjectId?: string): Promise<void> {
  const childId = getActiveChildId()
  const parentId = await getSessionParentId()
  if (!childId || !parentId) return
  try {
    await supabase.from('progress').insert({
      child_id: childId,
      activity_type: 'quiz',
      subject_id: subjectId ?? null,
      correct,
      stars_earned: correct ? 1 : 0
    })
  } catch {
    // best-effort
  }
}

export async function syncBadgeEarned(badgeId: string): Promise<void> {
  const childId = getActiveChildId()
  const parentId = await getSessionParentId()
  if (!childId || !parentId) return
  try {
    await supabase.from('child_badges').insert({ child_id: childId, badge_id: badgeId })
  } catch {
    // best-effort - e.g. already earned (unique constraint), fine to ignore
  }
}
