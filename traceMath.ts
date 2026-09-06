import type { Point } from '../../types/tracing'

/** Samples an already-rendered SVG <path> element at even intervals using
 *  the browser's native path APIs - no extra geometry library needed. */
export function samplePath(path: SVGPathElement, steps = 70): Point[] {
  const total = path.getTotalLength()
  const points: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const p = path.getPointAtLength((total * i) / steps)
    points.push({ x: p.x, y: p.y })
  }
  return points
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export interface TraceResult {
  coverage: number
  accuracy: number
  passed: boolean
}

/** Approximate match: how much of the guide did the child cover, and how
 *  much of what they drew actually stayed near the guide. Deliberately
 *  forgiving - this is for young kids, not handwriting grading. */
export function scoreTrace(userPoints: Point[], guidePoints: Point[], tolerance = 30): TraceResult {
  if (userPoints.length === 0 || guidePoints.length === 0) {
    return { coverage: 0, accuracy: 0, passed: false }
  }

  let covered = 0
  for (const g of guidePoints) {
    if (userPoints.some((u) => dist(u, g) <= tolerance)) covered++
  }
  const coverage = covered / guidePoints.length

  let onTarget = 0
  for (const u of userPoints) {
    if (guidePoints.some((g) => dist(u, g) <= tolerance)) onTarget++
  }
  const accuracy = onTarget / userPoints.length

  const passed = coverage >= 0.62 && accuracy >= 0.5
  return { coverage, accuracy, passed }
}

export const ENCOURAGEMENTS = ['Great! ⭐', 'Excellent! 🎉', 'Superstar! 🌟', 'Wonderful! 🎈', 'You did it! 🥳']

export function randomEncouragement(): string {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
}
