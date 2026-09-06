export default function PaywallModal({ onUnlock, onBack }: { onUnlock: () => void; onBack: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl">🔒</div>
      <h2 className="mt-3 font-display text-xl font-extrabold text-ink">Your free learning limit is complete.</h2>
      <p className="mt-2 text-ink/60">Continue learning with Premium.</p>
      <button onClick={onUnlock} className="mt-6 rounded-2xl bg-coral px-6 py-3 font-display font-extrabold text-white shadow-sticker">
        Unlock Now 💳
      </button>
      <button onClick={onBack} className="mt-3 text-sm font-semibold text-ink/50 underline">
        Not now
      </button>
    </div>
  )
}
