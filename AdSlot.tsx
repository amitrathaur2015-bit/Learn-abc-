import { useEffect, useState } from 'react'
import { shouldShowAd, activeAdProvider, type AdPlacement } from '../services/adsService'

/** Drop this into a screen to (maybe) show a small, clearly-labelled ad slot.
 *  Renders nothing at all - not even a placeholder box - unless every
 *  condition is met (ads on, this placement on, not premium). Intentionally
 *  never placed in Writing Practice/Tracing or anywhere mid-activity. */
export default function AdSlot({ placement }: { placement: AdPlacement }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    shouldShowAd(placement).then((v) => {
      if (!cancelled) setVisible(v)
    })
    return () => {
      cancelled = true
    }
  }, [placement])

  if (!visible) return null

  const creative = activeAdProvider.render()

  return (
    <div className="my-3 rounded-2xl border border-dashed border-ink/15 bg-white/60 p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wide text-ink/30">Advertisement</p>
      <p className="mt-1 text-sm font-semibold text-ink/50">{creative.title}</p>
      <p className="text-xs text-ink/30">{creative.note}</p>
    </div>
  )
}
