import { useEffect, useState } from 'react'
import { FONT_SCALES, type FontScale, getFontScale, getNightMode, setFontScale, setNightMode } from '../../services/displaySettingsService'

const FONT_LABELS: Record<FontScale, string> = {
  90: 'Small',
  100: 'Normal',
  115: 'Large',
  130: 'Extra Large'
}

export default function DisplaySettingsPanel() {
  const [night, setNight] = useState(false)
  const [scale, setScale] = useState<FontScale>(100)

  useEffect(() => {
    setNight(getNightMode())
    setScale(getFontScale())
  }, [])

  return (
    <section className="mb-5">
      <h2 className="mb-2 font-display font-extrabold text-ink">Display</h2>
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4">
        <button
          onClick={() => {
            const next = !night
            setNightMode(next)
            setNight(next)
          }}
          className="flex items-center justify-between"
        >
          <span className="font-display font-bold text-ink">{night ? '🌙 Night Mode' : '☀️ Night Mode'}</span>
          <span className={`h-6 w-11 rounded-full p-0.5 transition ${night ? 'bg-leaf' : 'bg-ink/20'}`}>
            <span className={`block h-5 w-5 rounded-full bg-white transition ${night ? 'translate-x-5' : ''}`} />
          </span>
        </button>
        <p className="text-xs text-ink/40">Dims and warms the colors a little - easier on the eyes for evening use.</p>

        <div className="mt-1 border-t border-ink/10 pt-3">
          <p className="mb-2 font-display font-bold text-ink">Text Size</p>
          <div className="flex gap-2">
            {FONT_SCALES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setFontScale(s)
                  setScale(s)
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-bold ${scale === s ? 'bg-coral text-white' : 'bg-chalk text-ink'}`}
              >
                {FONT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
