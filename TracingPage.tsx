import { useMemo, useRef, useState } from 'react'
import type { Point, TracingLevel } from '../../types/tracing'
import { findTemplate, getTemplates } from '../../data/tracingTemplates'
import WritingBoard, { type WritingBoardHandle } from './WritingBoard'
import TracingGuide from './TracingGuide'
import CharacterPreview from './CharacterPreview'
import { LEVELS } from './levels'
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
  const [level, setLevel] = useState<TracingLevel>(1)
  const [status, setStatus] = useState<'practicing' | 'success'>('practicing')
  const [message, setMessage] = useState('')
  const [nudge, setNudge] = useState(false)
  const [badgeUnlock, setBadgeUnlock] = useState<BadgeUnlock | null>(null)

  const boardRef = useRef<WritingBoardHandle>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])

  const levelInfo = LEVELS[level - 1]
  // Levels 1-2 have a guide (dotted / half-drawn) right there to trace along,
  // so strict path-matching is fair. Level 3 only shows a small example
  // above the board - the child is copying freehand, with no guide under
  // their finger to align to, so the same strict check made it very hard to
  // pass even for a good attempt. Treat it like Level 4/5: just check that
  // they wrote something.
  const strict = level <= 2

  const boardKey = `${charId}-${level}`

  const registerPath = (i: number, el: SVGPathElement | null) => {
    pathRefs.current[i] = el
  }

  const check = () => {
    const board = boardRef.current
    if (!board) return

    if (!strict) {
      if (board.hasInk()) {
        celebrate()
      } else {
        nudgeGently()
      }
      return
    }

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

  const goToLevel = (l: TracingLevel) => {
    setLevel(l)
    setStatus('practicing')
  }

  const nextStep = () => {
    if (level < 5) {
      goToLevel((level + 1) as TracingLevel)
    } else {
      const idx = chars.findIndex((c) => c.id === charId)
      const next = chars[(idx + 1) % chars.length]
      onPickChar(next.id)
      goToLevel(1)
    }
  }

  const guideNode = useMemo(
    () => <TracingGuide template={template} level={level} registerPath={registerPath} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template, level]
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
        <div className="flex gap-1">
          {chars.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onPickChar(c.id)
                goToLevel(1)
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold shadow-sticker ${
                c.id === charId ? 'bg-coral text-white' : 'bg-white text-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* Level stepper */}
      <div className="mb-4 flex justify-center gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.level}
            onClick={() => goToLevel(l.level)}
            className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-extrabold transition ${
              l.level === level
                ? 'bg-grape text-white shadow-sticker'
                : 'bg-white/70 text-ink/50'
            }`}
            aria-label={`Level ${l.level}: ${l.title}`}
          >
            {l.level}
          </button>
        ))}
      </div>

      <div className="mb-3 rounded-2xl bg-white/80 px-4 py-2.5 text-center shadow-sticker">
        <p className="font-display text-base font-bold text-ink">
          {levelInfo.emoji} {levelInfo.title}
        </p>
        <p className="text-sm text-ink/60">{levelInfo.subtitle}</p>
      </div>

      {level === 3 && (
        <div className="mx-auto mb-3 h-24 w-24 rounded-2xl bg-white p-2 shadow-sticker">
          <CharacterPreview template={template} />
        </div>
      )}

      {level === 4 && (
        <div className="mb-3 text-center font-display text-2xl font-extrabold text-grape">
          Write &ldquo;{template.label}&rdquo;
        </div>
      )}

      <div className={`relative rounded-3xl ${nudge ? 'animate-wiggle' : ''}`}>
        <WritingBoard key={boardKey} ref={boardRef} guide={guideNode} showToolbar />
      </div>

      <button
        onClick={check}
        className="sticker-card mt-4 rounded-2xl bg-leaf py-3 text-center font-display text-lg font-extrabold text-white shadow-sticker"
      >
        {strict ? 'Check My Writing ✓' : "I'm Done ✍️"}
      </button>

      {status === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
          <div className="animate-pop w-full max-w-xs rounded-3xl bg-paper p-6 text-center shadow-sticker">
            <div className="mb-2 text-5xl">🌟</div>
            <p className="font-display text-2xl font-extrabold text-ink">{message}</p>
            <p className="mt-1 text-sm text-ink/60">You practiced &ldquo;{template.label}&rdquo; - {levelInfo.title}</p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={nextStep}
                className="rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-stickerPress"
              >
                {level < 5 ? 'Next Level →' : 'Next Letter →'}
              </button>
              <button onClick={tryAgain} className="rounded-2xl bg-white py-3 font-display font-extrabold text-ink">
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {badgeUnlock && <BadgeToast badge={badgeUnlock} onClose={() => setBadgeUnlock(null)} />}
    </div>
  )
}

