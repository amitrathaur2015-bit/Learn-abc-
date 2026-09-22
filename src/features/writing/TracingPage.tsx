import { useMemo, useRef, useState } from 'react'
import type { Point } from '../../types/tracing'
import { findTemplate, getTemplates } from '../../data/tracingTemplates'
import WritingBoard, { type WritingBoardHandle } from './WritingBoard'
import TracingGuide from './TracingGuide'
import CharacterPreview from './CharacterPreview'
import { samplePath, scoreTrace, randomEncouragement } from './traceMath'
import { recordWritingCompletion, type BadgeUnlock } from '../../services/progressService'
import BadgeToast from '../../components/BadgeToast'

interface Props {
  subject: 'english' | 'numbers'
  charId: string
  onBack: () => void
  onPickChar: (charId: string) => void
}

export default function TracingPage({ subject, charId, onBack, onPickChar }: Props) {
  const template = findTemplate(subject, charId)!
  const chars = getTemplates(subject)
  const [status, setStatus] = useState<'practicing' | 'success' | 'finished-all'>('practicing')
  const [message, setMessage] = useState('')
  const [nudge, setNudge] = useState(false)
  const [badgeUnlock, setBadgeUnlock] = useState<BadgeUnlock | null>(null)

  const boardRef = useRef<WritingBoardHandle>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])

  const registerPath = (i: number, el: SVGPathElement | null) => {
    pathRefs.current[i] = el
  }

  const check = () => {
    const board = boardRef.current
    if (!board) return

    const guideSamples: Point[] = pathRefs.current
      .filter((p): p is SVGPathElement => !!p)
      .flatMap((p) => samplePath(p, 70))
    const userPoints = board.getUserPoints()
    const result = scoreTrace(userPoints, guideSamples)

    if (result.passed) {
      celebrate()
    } else {
      nudgeGently()
    }
  }

  const celebrate = () => {
    setMessage(randomEncouragement())
    setStatus('success')
    recordWritingCompletion(subject, charId).then((badge) => {
      if (badge) setBadgeUnlock(badge)
    })
  }

  const nudgeGently = () => {
    setNudge(true)
    setTimeout(() => setNudge(false), 900)
  }

  const tryAgain = () => {
    boardRef.current?.clear()
    setStatus('practicing')
  }

  const nextLetter = () => {
    const idx = chars.findIndex((c) => c.id === charId)
    const isLast = idx === chars.length - 1
    const next = chars[(idx + 1) % chars.length]
    onPickChar(next.id)
    setStatus(isLast ? 'finished-all' : 'practicing')
  }

  const guideNode = useMemo(
    () => <TracingGuide template={template} registerPath={registerPath} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template]
  )

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-8 pt-4">
      <header className="mb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sticker"
          aria-label="Back"
        >
          ⬅️
        </button>
        <div className="text-center">
          <div className="font-display text-3xl font-extrabold text-ink">{template.label}</div>
          <div className="text-xs font-bold uppercase tracking-wide text-ink/50">
            {subject === 'english' ? 'English Letters' : 'Numbers'}
          </div>
        </div>
        <div className="w-10" />
      </header>

      <div className="mb-3 rounded-2xl bg-white/80 px-4 py-2.5 text-center shadow-sticker">
        <p className="font-display text-base font-bold text-ink">✍️ Trace the Letter</p>
        <p className="text-sm text-ink/60">Move your finger inside the shape</p>
      </div>

      <div className="mx-auto mb-3 h-24 w-24 rounded-2xl bg-white p-2 shadow-sticker">
        <CharacterPreview template={template} />
      </div>

      <div className={`relative rounded-3xl ${nudge ? 'animate-wiggle' : ''}`}>
        <WritingBoard
          key={charId}
          ref={boardRef}
          guide={guideNode}
          showToolbar
          clipPaths={template.strokes.map((s) => s.d)}
          clipWidth={30}
          lockSize={44}
        />
      </div>

      <button
        onClick={check}
        className="sticker-card mt-4 rounded-2xl bg-leaf py-3 text-center font-display text-lg font-extrabold text-white shadow-sticker"
      >
        Check My Writing ✓
      </button>

      {status === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
          <div className="animate-pop w-full max-w-xs rounded-3xl bg-paper p-6 text-center shadow-sticker">
            <div className="mb-2 text-5xl">🌟</div>
            <p className="font-display text-2xl font-extrabold text-ink">{message}</p>
            <p className="mt-1 text-sm text-ink/60">You traced &ldquo;{template.label}&rdquo;</p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={nextLetter}
                className="rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-stickerPress"
              >
                Next Letter →
              </button>
              <button onClick={tryAgain} className="rounded-2xl bg-white py-3 font-display font-extrabold text-ink">
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'finished-all' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
          <div className="animate-pop w-full max-w-xs rounded-3xl bg-paper p-6 text-center shadow-sticker">
            <div className="mb-2 text-6xl">🎉</div>
            <p className="font-display text-2xl font-extrabold text-ink">You finished them all!</p>
            <p className="mt-1 text-sm text-ink/60">Starting again from the beginning</p>
            <button
              onClick={() => setStatus('practicing')}
              className="mt-5 w-full rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-stickerPress"
            >
              Keep Practicing
            </button>
          </div>
        </div>
      )}

      {badgeUnlock && <BadgeToast badge={badgeUnlock} onClose={() => setBadgeUnlock(null)} />}
    </div>
  )
}
