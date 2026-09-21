import type { CharacterTemplate } from '../../types/tracing'

interface Props {
  template: CharacterTemplate
  registerPath: (index: number, el: SVGPathElement | null) => void
}

/** One simple guide: the letter shown as a bold, solid stencil. The child
 *  traces inside/along this thick shape with their finger - no levels, no
 *  thin dotted line to chase, no picker buttons. Always in the DOM so the
 *  tracing engine can sample it with getPointAtLength() for the check. */
export default function TracingGuide({ template, registerPath }: Props) {
  return (
    <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <line x1="20" y1="60" x2="280" y2="60" stroke="#2B2140" strokeOpacity="0.08" strokeWidth="2" />
      <line x1="20" y1="240" x2="280" y2="240" stroke="#2B2140" strokeOpacity="0.14" strokeWidth="2" />

      {template.strokes.map((stroke, i) => (
        <path
          key={stroke.id}
          ref={(el) => registerPath(i, el)}
          d={stroke.d}
          fill="none"
          stroke="#9B5DE5"
          strokeWidth={26}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.28}
        />
      ))}

      {template.strokes.map((stroke) => (
        <circle
          key={`${stroke.id}-dot`}
          cx={stroke.startPoint.x}
          cy={stroke.startPoint.y}
          r={9}
          fill="#FF6F61"
          className="animate-pulse"
        />
      ))}
    </svg>
  )
}
