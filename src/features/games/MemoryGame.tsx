import { useEffect, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import BadgeToast from '../../components/BadgeToast'
import { GK_TOPICS } from '../../data/gkContent'
import { recordQuizAnswer, recordQuizFinished, type BadgeUnlock } from '../../services/progressService'

interface Card {
  key: string
  pairId: string
  emoji: string
  flipped: boolean
  matched: boolean
}

function buildDeck(): Card[] {
  const animals = GK_TOPICS.find((t) => t.id === 'animals')!.items.slice(0, 6)
  const cards: Card[] = []
  animals.forEach((a, i) => {
    cards.push({ key: `${i}-a`, pairId: a.name, emoji: a.emoji, flipped: false, matched: false })
    cards.push({ key: `${i}-b`, pairId: a.name, emoji: a.emoji, flipped: false, matched: false })
  })
  return cards.sort(() => Math.random() - 0.5)
}

export default function MemoryGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>(buildDeck)
  const [selected, setSelected] = useState<string[]>([])
  const [badge, setBadge] = useState<BadgeUnlock | null>(null)
  const [finished, setFinished] = useState(false)

  const allMatched = cards.every((c) => c.matched)

  useEffect(() => {
    if (allMatched && !finished) {
      setFinished(true)
      recordQuizFinished()
    }
  }, [allMatched, finished])

  const flip = (key: string) => {
    if (selected.length === 2) return
    const card = cards.find((c) => c.key === key)
    if (!card || card.flipped || card.matched) return

    const nextCards = cards.map((c) => (c.key === key ? { ...c, flipped: true } : c))
    setCards(nextCards)
    const nextSelected = [...selected, key]
    setSelected(nextSelected)

    if (nextSelected.length === 2) {
      const [firstKey, secondKey] = nextSelected
      const first = nextCards.find((c) => c.key === firstKey)!
      const second = nextCards.find((c) => c.key === secondKey)!
      const isMatch = first.pairId === second.pairId

      recordQuizAnswer(isMatch).then((b) => {
        if (b) setBadge(b)
      })

      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => {
            if (c.key !== firstKey && c.key !== secondKey) return c
            return isMatch ? { ...c, matched: true, flipped: true } : { ...c, flipped: false }
          })
        )
        setSelected([])
      }, isMatch ? 400 : 800)
    }
  }

  const restart = () => {
    setCards(buildDeck())
    setSelected([])
    setFinished(false)
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🃏 Memory Cards" subtitle="Flip two cards to find a pair" onBack={onBack} />

      <div className="grid grid-cols-4 gap-2.5">
        {cards.map((c) => (
          <button
            key={c.key}
            onClick={() => flip(c.key)}
            className={`sticker-card flex aspect-square items-center justify-center rounded-2xl text-3xl ${
              c.flipped || c.matched ? 'bg-white' : 'bg-grape'
            }`}
          >
            {c.flipped || c.matched ? c.emoji : '❓'}
          </button>
        ))}
      </div>

      {finished && (
        <div className="mt-6 text-center">
          <p className="font-display text-xl font-extrabold text-ink">You found every pair! 🎉</p>
          <div className="mt-3 flex justify-center gap-3">
            <button onClick={restart} className="rounded-2xl bg-coral px-6 py-3 font-display font-extrabold text-white shadow-sticker">
              Play Again
            </button>
            <button onClick={onBack} className="rounded-2xl bg-white px-6 py-3 font-display font-extrabold text-ink shadow-sticker">
              Back
            </button>
          </div>
        </div>
      )}

      {badge && <BadgeToast badge={badge} onClose={() => setBadge(null)} />}
    </div>
  )
}
