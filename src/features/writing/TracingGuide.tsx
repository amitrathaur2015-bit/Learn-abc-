import type { CharacterTemplate, TracingLevel } from '../../types/tracing'

interface Props {
  template: CharacterTemplate
  level: TracingLevel
  registerPath: (index: number, el: SVGPathElement | null) => void
}

/** Renders the guide strokes for a character. The guide is always present in
 *  the DOM (even when invisible) so the tracing engine can sample it with
 *  getPointAtLength() for any level - only its visual style changes:
 *   - Level 1: fully dotted, child traces the whole thing
 *   - Level 2: first half already "written" solid, second half is missing
 *   - Level 3/4/5: invisible (example shown separately, or no help at all)
 */
export default function TracingGuide({ template, level, registerPath }: Props) {
  const showDotted = level === 1
  const showIncomplete = level === 2
  const showStartDots = level === 1 || level === 2

  return (
    <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* faint 4-line practice ruling, purely decorative */}
      <line x1="20" y1="60" x2="280" y2="60" stroke="#2B2140" strokeOpacity="0.08" strokeWidth="2" />
      <line x1="20" y1="240" x2="280" y2="240" stroke="#2B2140" strokeOpacity="0.14" strokeWidth="2" />

      {template.strokes.map((stroke, i) => (
        <path
          key={stroke.id}
          ref={(el) => registerPath(i, el)}
          d={stroke.d}
          fill="none"
          pathLength={100}
          stroke={showIncomplete ? '#2B2140' : '#9B5DE5'}
          strokeWidth={showDotted ? 10 : showIncomplete ? 12 : 1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={showDotted ? 0.35 : showIncomplete ? 0.85 : 0}
          strokeDasharray={showDotted ? '2 6' : showIncomplete ? '50 50' : undefined}
        />
      ))}

      {showStartDots &&
        template.strokes.map((stroke) => (
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
