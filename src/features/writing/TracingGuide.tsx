import type { CharacterTemplate } from '../../types/tracing'

interface Props {
  template: CharacterTemplate
  registerPath: (index: number, el: SVGPathElement | null) => void
}

// The letter is drawn as a white shape with a black edge, like a colouring-book page.
const LETTER_FILL = '#FFFFFF'
const EDGE_COLOR = '#000000'

/** A big, bold stencil - like a coloring-book letter. The child
 *  colours inside this shape with their finger.
 *  - Letters with an `outline` (Hindi, numbers) show the real printed shape of the letter.
 *  - Other letters are drawn as thick lines along their strokes.
 *  Either way the stroke paths stay in the page (invisible when an outline is used)
 *  because the tracing check measures against them with getPointAtLength(). */
export default function TracingGuide({ template, registerPath }: Props) {
  const w = template.strokeWidth ?? 30
  const outline = template.outline
  const grow = template.outlineGrow ?? 0

  return (
    <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <line x1="20" y1="60" x2="280" y2="60" stroke={EDGE_COLOR} strokeOpacity="0.08" strokeWidth="2" />
      <line x1="20" y1="240" x2="280" y2="240" stroke={EDGE_COLOR} strokeOpacity="0.14" strokeWidth="2" />

      {outline ? (
        <>
          {/* black edge, then the white letter on top */}
          <path d={outline} fill={EDGE_COLOR} stroke={EDGE_COLOR} strokeWidth={2 * grow + 6} strokeLinejoin="round" />
          <path d={outline} fill={LETTER_FILL} stroke={LETTER_FILL} strokeWidth={2 * grow} strokeLinejoin="round" />
          {template.strokes.map((stroke, i) => (
            <path key={stroke.id} ref={(el) => registerPath(i, el)} d={stroke.d} fill="none" stroke="none" />
          ))}
        </>
      ) : (
        <>
          {/* black edge (drawn first, slightly thicker, sits behind the white) */}
          {template.strokes.map((stroke) => (
            <path
              key={`${stroke.id}-outline`}
              d={stroke.d}
              fill="none"
              stroke={EDGE_COLOR}
              strokeWidth={w + 8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* white letter on top */}
          {template.strokes.map((stroke, i) => (
            <path
              key={stroke.id}
              ref={(el) => registerPath(i, el)}
              d={stroke.d}
              fill="none"
              stroke={LETTER_FILL}
              strokeWidth={w}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </>
      )}
    </svg>
  )
}
