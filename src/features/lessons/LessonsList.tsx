import { useEffect, useState } from 'react'
import SpeakerButton from '../../components/SpeakerButton'
import { getPublishedLessons, type PublishedLesson } from '../../services/lessonService'

/** Shows the admin-made lessons for one subject. Renders nothing at all if
 *  there are none, so subject screens look exactly as before until a lesson
 *  is published. */
export default function LessonsList({ subjectId }: { subjectId: string }) {
  const [lessons, setLessons] = useState<PublishedLesson[]>([])
  const [open, setOpen] = useState<PublishedLesson | null>(null)
  const lang = subjectId === 'hindi' ? 'hi-IN' : 'en-IN'

  useEffect(() => {
    let cancelled = false
    getPublishedLessons(subjectId).then((rows) => {
      if (!cancelled) setLessons(rows)
    })
    return () => {
      cancelled = true
    }
  }, [subjectId])

  if (lessons.length === 0) return null

  return (
    <>
      <section className="mt-6">
        <h2 className="mb-2 font-display font-extrabold text-ink">📖 Lessons</h2>
        <div className="flex flex-col gap-3">
          {lessons.map((l) => (
            <button
              key={l.id}
              onClick={() => setOpen(l)}
              className="sticker-card flex items-center gap-3 rounded-3xl bg-white px-5 py-4 text-left"
            >
              <span className="text-3xl">📘</span>
              <span className="font-display text-base font-extrabold text-ink">{l.title}</span>
            </button>
          ))}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setOpen(null)}>
          <div
            className="animate-pop max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-paper p-6 text-center shadow-sticker"
            onClick={(e) => e.stopPropagation()}
          >
            {open.imageUrl && <img src={open.imageUrl} alt="" className="mx-auto mb-3 max-h-48 rounded-2xl object-contain" />}
            <h3 className="font-display text-2xl font-extrabold text-ink">{open.title}</h3>
            {open.description && (
              <p className="mt-3 whitespace-pre-line text-left text-lg text-ink/80">{open.description}</p>
            )}
            <div className="mt-4 flex justify-center">
              <SpeakerButton text={`${open.title}. ${open.description}`} lang={lang} />
            </div>
            <button
              onClick={() => setOpen(null)}
              className="mt-5 w-full rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-stickerPress"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
