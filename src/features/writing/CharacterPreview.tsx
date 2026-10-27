import type { CharacterTemplate } from '../../types/tracing'

export default function CharacterPreview({ template }: { template: CharacterTemplate }) {
  // Letters drawn with a thinner stencil (like Hindi) get a thinner preview too.
  const w = template.strokeWidth ? Math.round(template.strokeWidth * 0.5) : 14
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      {template.strokes.map((s) => (
        <path
          key={s.id}
          d={s.d}
          fill="none"
          stroke="#2B2140"
          strokeWidth={w}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
