import type { BadgeUnlock } from '../services/progressService'

export default function BadgeToast({ badge, onClose }: { badge: BadgeUnlock; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6" onClick={onClose}>
      <div className="animate-pop w-full max-w-xs rounded-3xl bg-paper p-6 text-center shadow-sticker">
        <div className="text-6xl">{badge.emoji}</div>
        <p className="mt-2 font-display text-lg font-extrabold text-grape">New Badge!</p>
        <p className="font-display text-2xl font-extrabold text-ink">{badge.title}</p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-stickerPress"
        >
          Yay! 🎉
        </button>
      </div>
    </div>
  )
}
