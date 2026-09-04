type CardColor = 'sun' | 'sky' | 'coral' | 'leaf' | 'grape'

const COLOR_MAP: Record<CardColor, string> = {
  sun: 'bg-sun',
  sky: 'bg-sky',
  coral: 'bg-coral',
  leaf: 'bg-leaf',
  grape: 'bg-grape'
}

interface Props {
  title: string
  emoji: string
  color: CardColor
  onClick: () => void
  subtitle?: string
  big?: boolean
}

export default function StickerCard({ title, emoji, color, onClick, subtitle, big }: Props) {
  return (
    <button
      onClick={onClick}
      className={`sticker-card font-display flex ${
        big ? 'flex-col items-center justify-center gap-2 py-7' : 'items-center gap-3 py-4'
      } w-full rounded-3xl px-5 text-left text-white ${COLOR_MAP[color]}`}
    >
      <span className={big ? 'text-5xl' : 'text-3xl'}>{emoji}</span>
      <span className={big ? 'text-center' : ''}>
        <span className={`block font-extrabold ${big ? 'text-xl' : 'text-lg'}`}>{title}</span>
        {subtitle && <span className="block text-sm font-semibold text-white/85">{subtitle}</span>}
      </span>
    </button>
  )
}
