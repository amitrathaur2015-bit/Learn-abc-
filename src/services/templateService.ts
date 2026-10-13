import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import type { CharacterTemplate } from '../types/tracing'
import { setExtraTemplates } from '../data/tracingTemplates'

/** Loads the published letters/numbers made in the Admin Panel and hands them
 *  to the tracing engine. Templates with no strokes are skipped. If anything
 *  goes wrong the built-in letters/numbers keep working unchanged. */
export async function loadAdminTemplates(): Promise<void> {
  if (!isSupabaseConfigured) return
  try {
    const { data: templates, error } = await supabase.from('writing_templates').select('*').eq('is_published', true)
    if (error || !templates) return
    if (templates.length === 0) {
      setExtraTemplates([])
      return
    }

    const { data: paths } = await supabase
      .from('tracing_paths')
      .select('*')
      .in(
        'template_id',
        templates.map((t) => t.id as string)
      )
      .order('stroke_order')

    const result: CharacterTemplate[] = []
    for (const t of templates) {
      if (t.subject !== 'english' && t.subject !== 'numbers') continue
      const strokes = (paths ?? [])
        .filter((p) => p.template_id === t.id)
        .map((p) => ({
          id: `${t.id}-${p.id}`,
          d: p.path_d as string,
          startPoint: { x: Number(p.start_x), y: Number(p.start_y) }
        }))
      if (strokes.length === 0) continue
      result.push({
        id: t.id as string,
        subject: t.subject as 'english' | 'numbers',
        label: t.label as string,
        difficulty: Number(t.difficulty ?? 1),
        strokes
      })
    }
    setExtraTemplates(result)
  } catch {
    // Keep the built-in letters and numbers as they are.
  }
}
