import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import { loginParent } from '../../services/authService'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

interface Props {
  onBack: () => void
  onLoggedIn: () => void
  onGoRegister: () => void
  onGoReset: () => void
}

export default function LoginPage({ onBack, onLoggedIn, onGoRegister, onGoReset }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) return setError('Backend is not set up yet. See the README to connect Supabase.')
    setLoading(true)
    setError(null)
    const { error } = await loginParent(email, password)
    setLoading(false)
    if (error) setError(error)
    else onLoggedIn()
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="👨‍👩‍👦 Parent Login" onBack={onBack} />
      <form onSubmit={submit} className="flex flex-col gap-3">
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-2xl bg-white px-4 py-3 shadow-inner"
        />
        {error && <p className="text-sm font-semibold text-coral">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-sticker disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <button onClick={onGoReset} className="font-semibold text-ink/60 underline">
          Forgot password?
        </button>
        <button onClick={onGoRegister} className="font-semibold text-grape underline">
          New here? Create a Parent Account
        </button>
      </div>
    </div>
  )
}
