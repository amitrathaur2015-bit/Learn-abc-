import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import { sendPasswordReset } from '../../services/authService'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

export default function ResetPasswordPage({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) return setError('Backend is not set up yet. See the README to connect Supabase.')
    setLoading(true)
    const { error } = await sendPasswordReset(email)
    setLoading(false)
    if (error) setError(error)
    else setSent(true)
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🔑 Reset Password" onBack={onBack} />
      {sent ? (
        <p className="rounded-2xl bg-white p-4 text-center text-ink/70">
          If an account exists for <span className="font-bold">{email}</span>, a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl bg-white px-4 py-3 shadow-inner"
          />
          {error && <p className="text-sm font-semibold text-coral">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-coral py-3 font-display font-extrabold text-white shadow-sticker disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  )
}
