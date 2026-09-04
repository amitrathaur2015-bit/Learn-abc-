import { useEffect, useState } from 'react'
import { isMuted, toggleMute } from '../services/audioService'

export default function MuteToggle() {
  const [muted, setMuted] = useState(isMuted())

  useEffect(() => {
    setMuted(isMuted())
  }, [])

  return (
    <button
      onClick={async () => {
        const next = await toggleMute()
        setMuted(next)
      }}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sticker"
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
