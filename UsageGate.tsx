import { useEffect, useState, type ReactNode } from 'react'
import { checkUsage } from '../../services/monetizationService'
import { getActiveChildId } from '../../services/childProfileService'
import PaywallModal from './PaywallModal'

interface Props {
  activityType: 'writing' | 'quiz' | 'game'
  children: ReactNode
  onBlocked: () => void
  onGoPricing: () => void
}

/** Wraps a learning screen. Silently lets a not-signed-in / not-yet-configured
 *  visitor through (see monetizationService.checkUsage) - the limit only ever
 *  applies once a parent is signed in, which is also when it can be verified
 *  server-side rather than trusted from the device. */
export default function UsageGate({ activityType, children, onBlocked, onGoPricing }: Props) {
  const [state, setState] = useState<'checking' | 'allowed' | 'blocked'>('checking')

  useEffect(() => {
    let cancelled = false
    checkUsage(activityType, true, getActiveChildId() ?? undefined).then((result) => {
      if (cancelled) return
      setState(result.allowed ? 'allowed' : 'blocked')
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="animate-pulse text-4xl">✨</span>
      </div>
    )
  }

  if (state === 'blocked') {
    return <PaywallModal onUnlock={onGoPricing} onBack={onBlocked} />
  }

  return <>{children}</>
}
