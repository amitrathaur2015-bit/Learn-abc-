import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const GRID = 300
const TOP = 60
const BOTTOM = 240

interface P {
  x: number
  y: number
}

type Mode = 'smooth' | 'line'

interface Props {
  /** Strokes already saved for this letter/number (shown faintly as a guide). */
  existing: string[]
  /** Called when a finger stroke is finished, with its SVG path and start point. */
  onDrawn: (d: string, startX: number, startY: number) => void
}

const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y)
const r = (n: number) => Math.round(n)

function pathLength(pts: P[]): number {
  let total = 0
  for (let i = 1; i < pts.length; i++) total += dist(pts[i - 1], pts[i])
  return total
}

/** Points spaced evenly along the drawn line. */
function resample(pts: P[], step: number): P[] {
  if (pts.length < 2) return pts
  const out: P[] = [pts[0]]
  let carry = 0
  for (let i = 1; i < pts.length; i++) {
    let a = pts[i - 1]
    const b = pts[i]
    let segLen = dist(a, b)
    while (carry + segLen >= step) {
      const t = (step - carry) / segLen
      const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
      out.push(p)
      a = p
      segLen = dist(a, b)
      carry = 0
    }
    carry += segLen
  }
  const last = pts[pts.length - 1]
  if (dist(out[out.length - 1], last) > step * 0.4) out.push(last)
  else out[out.length - 1] = last
  return out
}

/** Averages each point with its neighbours a few times to remove finger wobble. */
function smoothPoints(pts: P[], passes: number): P[] {
  let cur = pts
  for (let k = 0; k < passes; k++) {
    const prev = cur
    cur = prev.map((p, i) => {
      if (i === 0 || i === prev.length - 1) return p
      const a = prev[i - 1]
      const b = prev[i + 1]
      return { x: (a.x + p.x * 2 + b.x) / 4, y: (a.y + p.y * 2 + b.y) / 4 }
    })
  }
  return cur
}

/** Turns points into a smooth curve (Catmull-Rom converted to Bezier). */
function toBezier(pts: P[]): string {
  let d = `M${r(pts[0].x)},${r(pts[0].y)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i > 0 ? pts[i - 1] : pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = i + 2 < pts.length ? pts[i + 2] : p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C${r(c1.x)},${r(c1.y)} ${r(c2.x)},${r(c2.y)} ${r(p2.x)},${r(p2.y)}`
  }
  return d
}

/** A line within ~10 degrees of straight up/down or sideways becomes exactly so. */
function straightLine(a: P, b: P): { a: P; b: P } {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  if (len === 0) return { a, b }
  if (Math.abs(dx) / len < 0.17) {
    const x = (a.x + b.x) / 2
    return { a: { x, y: a.y }, b: { x, y: b.y } }
  }
  if (Math.abs(dy) / len < 0.17) {
    const y = (a.y + b.y) / 2
    return { a: { x: a.x, y }, b: { x: b.x, y } }
  }
  return { a, b }
}

/** Joins an end point to a nearby earlier stroke, or to the top/bottom guide line. */
function snapEnd(p: P, anchors: P[]): P {
  let best: P | null = null
  let bestD = 14
  for (const a of anchors) {
    const d = dist(p, a)
    if (d < bestD) {
      bestD = d
      best = a
    }
  }
  if (best) return { x: best.x, y: best.y }
  const q = { x: p.x, y: p.y }
  if (Math.abs(q.y - TOP) <= 10) q.y = TOP
  else if (Math.abs(q.y - BOTTOM) <= 10) q.y = BOTTOM
  return q
}

/** First and last point of a saved path string. */
function endpointsOf(d: string): P[] {
  const nums = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
  if (nums.length < 4) return []
  return [
    { x: nums[0], y: nums[1] },
    { x: nums[nums.length - 2], y: nums[nums.length - 1] }
  ]
}

/** A small drawing box on the same 300x300 grid the built-in letters use.
 *  Draw one stroke with a finger; it is straightened/smoothed automatically
 *  and turned into an SVG path. */
export default function StrokeDrawPad({ existing, onDrawn }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const points = useRef<P[]>([])
  const preview = useRef<string | null>(null)
  const drawing = useRef(false)
  const [mode, setMode] = useState<Mode>('smooth')
  const [ready, setReady] = useState(false)
  const existingKey = existing.join('|')

  const redraw = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, GRID, GRID)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, GRID, GRID)

    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(43,33,64,0.15)'
    ctx.beginPath()
    ctx.moveTo(10, TOP)
    ctx.lineTo(290, TOP)
    ctx.moveTo(10, BOTTOM)
    ctx.lineTo(290, BOTTOM)
    ctx.stroke()

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 14
    ctx.strokeStyle = 'rgba(155,93,229,0.3)'
    for (const d of existing) ctx.stroke(new Path2D(d))

    ctx.lineWidth = 10
    ctx.strokeStyle = '#FF6F61'
    if (drawing.current && points.current.length > 0) {
      ctx.beginPath()
      ctx.moveTo(points.current[0].x, points.current[0].y)
      for (const p of points.current.slice(1)) ctx.lineTo(p.x, p.y)
      ctx.stroke()
    } else if (preview.current) {
      ctx.stroke(new Path2D(preview.current))
    }
  }

  // A stroke was saved (or the template changed): start fresh.
  useEffect(() => {
    points.current = []
    preview.current = null
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
    preview.current = null
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
    const raw = points.current
    points.current = []

    if (raw.length < 2) {
      redraw()
      return
    }

    const anchors = existing.flatMap(endpointsOf)
    const start = raw[0]
    const end = raw[raw.length - 1]
    const chord = dist(start, end)

    // Is the drawn line (almost) straight?
    let straight = mode === 'line'
    if (!straight && chord >= 20) {
      let maxDev = 0
      for (const p of raw) {
        const dev =
          Math.abs((end.x - start.x) * (start.y - p.y) - (start.x - p.x) * (end.y - start.y)) / chord
        if (dev > maxDev) maxDev = dev
      }
      straight = maxDev <= Math.max(8, chord * 0.07)
    }

    let d = ''
    let first: P = start

    if (straight) {
      if (chord < 8) {
        redraw()
        return
      }
      const s = straightLine(start, end)
      const a = snapEnd(s.a, anchors)
      const b = snapEnd(s.b, anchors)
      d = `M${r(a.x)},${r(a.y)} L${r(b.x)},${r(b.y)}`
      first = a
    } else {
      const closed = chord < 25 && pathLength(raw) > 80
      let pts = smoothPoints(resample(raw, 6), 6)
      const thin = pts.filter((_, i) => i % 4 === 0)
      const lastPt = pts[pts.length - 1]
      if (thin[thin.length - 1] !== lastPt) thin.push(lastPt)
      if (thin.length < 2) {
        redraw()
        return
      }
      thin[0] = snapEnd(thin[0], anchors)
      thin[thin.length - 1] = closed ? thin[0] : snapEnd(thin[thin.length - 1], anchors)
      pts = thin
      d = toBezier(pts)
      first = pts[0]
    }

    preview.current = d
    onDrawn(d, r(first.x), r(first.y))
    setReady(true)
    redraw()
  }

  const clear = () => {
    points.current = []
    preview.current = null
    setReady(false)
    redraw()
  }

  return (
    <div className="mb-2 rounded-xl bg-chalk p-2">
      <div className="mb-1 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('smooth')}
          className={`rounded-full px-3 py-1 text-xs font-bold ${mode === 'smooth' ? 'bg-coral text-white' : 'bg-white text-ink'}`}
        >
          〰️ Curve / Auto
        </button>
        <button
          type="button"
          onClick={() => setMode('line')}
          className={`rounded-full px-3 py-1 text-xs font-bold ${mode === 'line' ? 'bg-coral text-white' : 'bg-white text-ink'}`}
        >
          📏 Seedhi line
        </button>
      </div>
      <p className="mb-1 text-xs text-ink/60">
        {mode === 'smooth'
          ? 'Ungli se banao - seedhi line apne aap seedhi, curve apne aap smooth ho jayegi.'
          : 'Shuru se ant tak ungli ghumao - sirf shuru aur ant ka point liya jayega, line pakka seedhi banegi.'}
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
      <p className="mt-1 text-[10px] text-ink/40">
        Kone wale letters (A, E, L, T...) ko alag-alag seedhi lines (stroke) mein banao.
      </p>
    </div>
  )
}
