import { useEffect, useState } from 'react'
import { fetchHomeCards, type HomeCard } from '../services/contentService'
import StickerCard from '../components/StickerCard'
import Hero3D from '../components/Hero3D'
import MuteToggle from '../components/MuteToggle'
import NightModeToggle from '../components/NightModeToggle'
import AdSlot from '../components/AdSlot'

interface Props {
  onOpenCard: (id: string) => void
}

export default function HomePage({ onOpenCard }: Props) {
  const [cards, setCards] = useState<HomeCard[]>([])

  useEffect(() => {
    fetchHomeCards().then(setCards)
  }, [])

  const [writing, ...rest] = cards

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <div className="flex items-center justify-between">
        <MuteToggle />
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink">Chhota Scholar</h1>
          <p className="text-sm font-semibold text-ink/50">Nursery · LKG · UKG · Class 1</p>
        </div>
        <NightModeToggle />
      </div>

      <Hero3D />

      {writing && (
        <div className="mt-4">
          <StickerCard
            title={writing.title}
            subtitle="Start here - trace, write, learn!"
            emoji={writing.emoji}
            color={writing.color}
            big
            onClick={() => onOpenCard(writing.id)}
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {rest.map((c) => (
          <StickerCard key={c.id} title={c.title} emoji={c.emoji} color={c.color} onClick={() => onOpenCard(c.id)} />
        ))}
      </div>

      <AdSlot placement="home" />
    </div>
  )
}
