import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export interface PublishedLesson {
  id: string
  title: string
  description: string
  imageUrl: string | null
}

/** Published lessons the admin made for one subject (english, hindi, maths,
 *  gk or colors-shapes). Empty list if none, or if Supabase isn't set up. */
export async function getPublishedLessons(subjectId: string): Promise<PublishedLesson[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('is_published', true)
      .order('sort_order')
      .order('created_at')

    return (data ?? []).map((l) => ({
      id: l.id as string,
      title: l.title as string,
      description: (l.description as string | null) ?? '',
      imageUrl: (l.image_url as string | null) ?? null
    }))
  } catch {
    return []
  }
}
