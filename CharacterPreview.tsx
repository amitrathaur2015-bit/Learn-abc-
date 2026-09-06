import type { CharacterTemplate } from '../../types/tracing'

export default function CharacterPreview({ template }: { template: CharacterTemplate }) {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      {template.strokes.map((s) => (
        <path
          key={s.id}
          d={s.d}
          fill="none"
          stroke="#2B2140"
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
