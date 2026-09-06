import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Point } from '../../types/tracing'

const GRID = 300 // internal drawing resolution, shared with the SVG guide viewBox

const PEN_COLORS = [
  { name: 'ink', value: '#2B2140' },
  { name: 'coral', value: '#FF6F61' },
  { name: 'sky', value: '#2E9FD8' },
  { name: 'leaf', value: '#3E9B4C' },
  { name: 'grape', value: '#9B5DE5' }
]
const PEN_SIZES = [
  { name: 'S', value: 6 },
  { name: 'M', value: 11 },
  { name: 'L', value: 18 }
]

interface Stroke {
  points: Point[]
  color: string
  size: number
  eraser: boolean
}

export interface WritingBoardHandle {
  clear: () => void
  getUserPoints: () => Point[]
  hasInk: () => boolean
}

interface Props {
  /** Called after every completed stroke, with all points drawn so far. */
  onStrokeEnd?: (allPoints: Point[]) => void
  /** Hide the toolbar for a simplified view (rarely needed). */
  showToolbar?: boolean
  /** Optional guide (e.g. <TracingGuide />) rendered underneath the canvas. */
  guide?: ReactNode
}

const WritingBoard = forwardRef<WritingBoardHandle, Props>(function WritingBoard(
  { onStrokeEnd, showToolbar = true, guide },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [redoStack, setRedoStack] = useState<Stroke[]>([])
  const [color, setColor] = useState(PEN_COLORS[0].value)
  const [size, setSize] = useState(PEN_SIZES[1].value)
  const [eraser, setEraser] = useState(false)
  const drawing = useRef(false)
  const current = useRef<Stroke | null>(null)

  const redraw = useCallback((all: Stroke[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, GRID, GRID)
    for (const s of all) {
      if (s.points.length === 0) continue
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.strokeStyle = s.eraser ? '#FFFFFF' : s.color
      ctx.globalCompositeOperation = s.eraser ? 'destination-out' : 'source-over'
      ctx.lineWidth = s.eraser ? s.size * 2.2 : s.size
      ctx.beginPath()
      ctx.moveTo(s.points[0].x, s.points[0].y)
      for (const p of s.points.slice(1)) ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    ctx.globalCompositeOperation = 'source-over'
  }, [])

  useEffect(() => {
    redraw(strokes)
  }, [strokes, redraw])

  const toLocalPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * GRID
    const y = ((e.clientY - rect.top) / rect.height) * GRID
    return { x, y }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    const p = toLocalPoint(e)
    current.current = { points: [p], color, size, eraser }
    setRedoStack([])
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !current.current) return
    const p = toLocalPoint(e)
    current.current.points.push(p)
    // Live-draw just this stroke on top of the existing canvas for smoothness.
    redraw([...strokes, current.current])
  }

  const finishStroke = () => {
    if (!drawing.current || !current.current) return
    drawing.current = false
    const finished = current.current
    current.current = null
    setStrokes((prev) => {
      const next = [...prev, finished]
      const allPoints = next.flatMap((s) => (s.eraser ? [] : s.points))
      onStrokeEnd?.(allPoints)
      return next
    })
  }

  useImperativeHandle(ref, () => ({
    clear: () => {
      setStrokes([])
      setRedoStack([])
    },
    getUserPoints: () => strokes.flatMap((s) => (s.eraser ? [] : s.points)),
    hasInk: () => strokes.some((s) => !s.eraser && s.points.length > 2)
  }))

  const undo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev
      const next = prev.slice(0, -1)
      setRedoStack((r) => [prev[prev.length - 1], ...r])
      return next
    })
  }
  const redo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev
      const [first, ...rest] = prev
      setStrokes((s) => [...s, first])
      return rest
    })
  }
  const clearAll = () => {
    setStrokes([])
    setRedoStack([])
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden touch-none select-none bg-white">
        {guide}
        <canvas
          ref={canvasRef}
          width={GRID}
          height={GRID}
          className="absolute inset-0 w-full h-full touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerLeave={finishStroke}
          onPointerCancel={finishStroke}
        />
      </div>

      {showToolbar && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-white/70 p-2.5 shadow-inner">
          {PEN_COLORS.map((c) => (
            <button
              key={c.value}
              aria-label={`Pen color ${c.name}`}
              onClick={() => {
                setEraser(false)
                setColor(c.value)
              }}
              className={`h-8 w-8 rounded-full border-2 ${
                !eraser && color === c.value ? 'border-ink scale-110' : 'border-white/60'
              } transition-transform`}
              style={{ backgroundColor: c.value }}
            />
          ))}

          <span className="mx-1 h-6 w-px bg-ink/15" />

          {PEN_SIZES.map((s) => (
            <button
              key={s.value}
              aria-label={`Pen size ${s.name}`}
              onClick={() => setSize(s.value)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold font-display ${
                size === s.value ? 'bg-ink text-white' : 'bg-white text-ink'
              }`}
            >
              {s.name}
            </button>
          ))}

          <span className="mx-1 h-6 w-px bg-ink/15" />

          <button
            aria-label="Eraser"
            onClick={() => setEraser((v) => !v)}
            className={`flex h-8 items-center gap-1 rounded-full px-3 text-sm font-bold font-display ${
              eraser ? 'bg-coral text-white' : 'bg-white text-ink'
            }`}
          >
            🧽 Eraser
          </button>
          <button
            aria-label="Undo"
            onClick={undo}
            className="flex h-8 items-center gap-1 rounded-full bg-white px-3 text-sm font-bold font-display text-ink"
          >
            ↩️ Undo
          </button>
          <button
            aria-label="Redo"
            onClick={redo}
            className="flex h-8 items-center gap-1 rounded-full bg-white px-3 text-sm font-bold font-display text-ink"
          >
            ↪️ Redo
          </button>
          <button
            aria-label="Clear all"
            onClick={clearAll}
            className="flex h-8 items-center gap-1 rounded-full bg-white px-3 text-sm font-bold font-display text-ink"
          >
            🗑️ Clear
          </button>
        </div>
      )}
    </div>
  )
})

export default WritingBoard
