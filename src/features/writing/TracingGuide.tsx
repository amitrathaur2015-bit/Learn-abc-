import type { CharacterTemplate } from '../../types/tracing'

interface Props {
  template: CharacterTemplate
  registerPath: (index: number, el: SVGPathElement | null) => void
}

function startDirection(d: string): number {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  if (nums.length < 4) return 90
  const [x0, y0, x1, y1] = nums
  return Math.atan2(y1 - y0, x1 - x0) * (180 / Math.PI)
}

/** A big, bold, colorful stencil - like a coloring-book letter. The child
 *  traces inside this shape with their finger. Always in the DOM so the
 *  tracing engine can sample it with getPointAtLength() for the check.
 *  Letters can ask for a thinner stencil (strokeWidth) so small loops stay readable. */
export default function TracingGuide({ template, registerPath }: Props) {
  const first = template.strokes[0]
  const angle = first ? startDirection(first.d) : 0
  const w = template.strokeWidth ?? 30

  return (
    <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <line x1="20" y1="60" x2="280" y2="60" stroke="#2B2140" strokeOpacity="0.08" strokeWidth="2" />
      <line x1="20" y1="240" x2="280" y2="240" stroke="#2B2140" strokeOpacity="0.14" strokeWidth="2" />

      {/* black outline (drawn first, slightly thicker, sits behind the color) */}
      {template.strokes.map((stroke) => (
        <path
          key={`${stroke.id}-outline`}
          d={stroke.d}
          fill="none"
          stroke="#2B2140"
          strokeWidth={w + 8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* bold color fill on top */}
      {template.strokes.map((stroke, i) => (
        <path
          key={stroke.id}
          ref={(el) => registerPath(i, el)}
          d={stroke.d}
          fill="none"
          stroke="#FF3D9A"
          strokeWidth={w}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* one arrow showing where and which way to start */}
      {first && (
        <g transform={`translate(${first.startPoint.x}, ${first.startPoint.y}) rotate(${angle})`}>
          <circle r={Math.round(w * 0.47)} fill="#FFC93C" stroke="#2B2140" strokeWidth={2} className="animate-pulse" />
          <polygon points="-4,-8 8,0 -4,8" fill="#2B2140" />
        </g>
      )}
    </svg>
  )
}
