import { useEffect, useState } from 'react'
import { getNightMode, setNightMode } from '../services/displaySettingsService'

export default function NightModeToggle() {
  const [night, setNight] = useState(getNightMode())

  useEffect(() => {
    setNight(getNightMode())
  }, [])

  return (
    <button
      onClick={() => {
        const next = !night
        setNightMode(next)
        setNight(next)
      }}
      aria-label={night ? 'Turn off night mode' : 'Turn on night mode'}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sticker"
    >
      {night ? '🌙' : '☀️'}
    </button>
  )
}
