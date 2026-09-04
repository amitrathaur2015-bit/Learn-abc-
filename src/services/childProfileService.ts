import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export interface ChildProfile {
  id: string
  name: string
  avatar_emoji: string
}

const ACTIVE_CHILD_KEY = 'chhota-scholar-active-child'

export function getActiveChildId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CHILD_KEY)
  } catch {
    return null
  }
}

function setActiveChildId(id: string) {
  try {
    localStorage.setItem(ACTIVE_CHILD_KEY, id)
  } catch {
    // ignore
  }
}

export async function listChildren(): Promise<ChildProfile[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('child_profiles').select('id, name, avatar_emoji').order('created_at')
  return (data as ChildProfile[]) ?? []
}

export async function createChild(name: string, avatarEmoji = '🧒'): Promise<ChildProfile | null> {
  if (!isSupabaseConfigured) return null
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return null

  const { data, error } = await supabase
    .from('child_profiles')
    .insert({ parent_id: auth.user.id, name, avatar_emoji: avatarEmoji })
    .select('id, name, avatar_emoji')
    .single()

  if (error || !data) return null
  setActiveChildId(data.id)
  return data as ChildProfile
}

export function selectActiveChild(id: string) {
  setActiveChildId(id)
}
