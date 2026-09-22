import type { CharacterTemplate } from '../../types/tracing'

interface Props {
  template: CharacterTemplate
  registerPath: (index: number, el: SVGPathElement | null) => void
}

/** A big, bold, colorful stencil - like a coloring-book letter. The child
 *  traces inside this shape with their finger. Always in the DOM so the
 *  tracing engine can sample it with getPointAtLength() for the check. */
export default function TracingGuide({ template, registerPath }: Props) {
  return (
    <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <line x1="20" y1="60" x2="280" y2="60" stroke="#2B2140" strokeOpacity="0.08" strokeWidth="2" />
      <line x1="20" y1="240" x2="280" y2="240" stroke="#2B2140" strokeOpacity="0.14" strokeWidth="2" />

      {/* black outline (drawn first, slightly thicker, sits behind the color) */}
      {template.strokes.map((stroke, i) => (
        <path
          key={`${stroke.id}-outline`}
          ref={i === 0 ? undefined : undefined}
          d={stroke.d}
          fill="none"
          stroke="#2B2140"
          strokeWidth={38}
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
          strokeWidth={30}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {template.strokes.map((stroke) => (
        <circle
          key={`${stroke.id}-dot`}
          cx={stroke.startPoint.x}
          cy={stroke.startPoint.y}
          r={10}
          fill="#FFC93C"
          stroke="#2B2140"
          strokeWidth={2}
          className="animate-pulse"
        />
      ))}
    </svg>
  )
}
