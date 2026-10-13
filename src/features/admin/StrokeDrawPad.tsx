import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const GRID = 300

interface P {
  x: number
  y: number
}

interface Props {
  /** Strokes already saved for this letter/number (shown faintly as a guide). */
  existing: string[]
  /** Called when a finger stroke is finished, with its SVG path and start point. */
  onDrawn: (d: string, startX: number, startY: number) => void
}

function simplify(points: P[], minDist = 6): P[] {
  if (points.length <= 2) return points
  const out: P[] = [points[0]]
  for (let i = 1; i < points.length - 1; i++) {
    const last = out[out.length - 1]
    if (Math.hypot(points[i].x - last.x, points[i].y - last.y) >= minDist) out.push(points[i])
  }
  out.push(points[points.length - 1])
  return out
}

/** A small drawing box on the same 300x300 grid the built-in letters use.
 *  Draw one stroke with a finger and it becomes an SVG path automatically. */
export default function StrokeDrawPad({ existing, onDrawn }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const points = useRef<P[]>([])
  const drawing = useRef(false)
  const [ready, setReady] = useState(false)
  const existingKey = existing.join('|')

  const redraw = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, GRID, GRID)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, GRID, GRID)

    // the same faint top/bottom lines the child's board has
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(43,33,64,0.15)'
    ctx.beginPath()
    ctx.moveTo(10, 60)
    ctx.lineTo(290, 60)
    ctx.moveTo(10, 240)
    ctx.lineTo(290, 240)
    ctx.stroke()

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 14
    ctx.strokeStyle = 'rgba(155,93,229,0.3)'
    for (const d of existing) ctx.stroke(new Path2D(d))

    if (points.current.length > 0) {
      ctx.lineWidth = 10
      ctx.strokeStyle = '#FF6F61'
      ctx.beginPath()
      ctx.moveTo(points.current[0].x, points.current[0].y)
      for (const p of points.current.slice(1)) ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
  }

  // A stroke was saved (or the template changed): start fresh.
  useEffect(() => {
    points.current = []
    setReady(false)
    redraw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingKey])

  const toPoint = (e: ReactPointerEvent<HTMLCanvasElement>): P => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * GRID,
      y: ((e.clientY - rect.top) / rect.height) * GRID
    }
  }

  const down = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    points.current = [toPoint(e)]
    setReady(false)
    redraw()
  }

  const move = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    points.current.push(toPoint(e))
    redraw()
  }

  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    const s = simplify(points.current)
    if (s.length < 2) {
      points.current = []
      redraw()
      return
    }
    const d = s.map((p, i) => `${i === 0 ? 'M' : 'L'}${Math.round(p.x)},${Math.round(p.y)}`).join(' ')
    onDrawn(d, Math.round(s[0].x), Math.round(s[0].y))
    setReady(true)
  }

  const clear = () => {
    points.current = []
    setReady(false)
    redraw()
  }

  return (
    <div className="mb-2 rounded-xl bg-chalk p-2">
      <p className="mb-1 text-xs font-bold text-ink/60">
        ✏️ Ungli se ek stroke banao - bada, upar aur neeche ki halki lines ke beech
      </p>
      <canvas
        ref={canvasRef}
        width={GRID}
        height={GRID}
        className="aspect-square w-full touch-none rounded-lg"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      />
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-leaf">{ready ? '✓ Stroke taiyaar - ab neeche "Add Stroke" dabao' : ''}</span>
        <button type="button" onClick={clear} className="text-xs font-bold text-coral">
          Clear
        </button>
      </div>
    </div>
  )
}
