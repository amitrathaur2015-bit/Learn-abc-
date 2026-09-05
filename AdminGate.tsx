import { useEffect, useState, type ReactNode } from 'react'
import { getCurrentParent } from '../../services/authService'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

export default function AdminGate({ children, onBack }: { children: ReactNode; onBack: () => void }) {
  const [state, setState] = useState<'checking' | 'ok' | 'denied'>('checking')

  useEffect(() => {
    if (!isSupabaseConfigured) return setState('denied')
    getCurrentParent().then((p) => setState(p?.role === 'admin' ? 'ok' : 'denied'))
  }, [])

  if (state === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="animate-pulse text-4xl">🛠️</span>
      </div>
    )
  }

  if (state === 'denied') {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl">🚫</div>
        <p className="mt-3 font-display text-lg font-extrabold text-ink">Admins only</p>
        <button onClick={onBack} className="mt-6 rounded-2xl bg-coral px-6 py-3 font-display font-extrabold text-white shadow-sticker">
          Back
        </button>
      </div>
    )
  }

  return <>{children}</>
}
