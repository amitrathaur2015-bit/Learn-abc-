import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import { registerParent } from '../../services/authService'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { getReferralCodeFromUrl } from '../../services/referralService'

interface Props {
  onBack: () => void
  onRegistered: () => void
  onGoLogin: () => void
}

export default function RegisterPage({ onBack, onRegistered, onGoLogin }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState(getReferralCodeFromUrl() ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) return setError('Backend is not set up yet. See the README to connect Supabase.')
    setLoading(true)
    setError(null)
    const { error } = await registerParent(email, password, name, referralCode || undefined)
    setLoading(false)
    if (error) setError(error)
    else setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl">📧</div>
        <h2 className="mt-3 font-display text-xl font-extrabold text-ink">Almost done!</h2>
        <p className="mt-2 text-ink/60">
          Check <span className="font-bold">{email}</span> and tap the confirmation link, then come back and log in.
        </p>
        <button onClick={onRegistered} className="mt-6 rounded-2xl bg-coral px-6 py-3 font-display font-extrabold text-white shadow-sticker">
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="✨ Create Parent Account" onBack={onBack} />
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-2xl bg-white px-4 py-3 shadow-inner"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-2xl bg-white px-4 py-3 shadow-inner"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-2xl bg-white px-4 py-3 shadow-inner"
        />
        <input
          placeholder="Referral code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="rounded-2xl bg-white px-4 py-3 uppercase shadow-inner"
        />
        {error && <p className="text-sm font-semibold text-coral">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-sticker disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <button onClick={onGoLogin} className="mt-4 w-full text-center text-sm font-semibold text-grape underline">
        Already have an account? Login
      </button>
    </div>
  )
}
