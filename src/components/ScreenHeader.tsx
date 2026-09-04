import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  onBack: () => void
  right?: ReactNode
}

export default function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <header className="mb-5 flex items-center gap-3">
      <button
        onClick={onBack}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sticker"
        aria-label="Back"
      >
        ⬅️
      </button>
      <div className="flex-1">
        <h1 className="font-display text-xl font-extrabold text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-ink/50">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
