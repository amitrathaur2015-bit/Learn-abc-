// Purely visual, device-local preferences - not progress or account data, so
// this stays in localStorage only (no Supabase sync needed, same as the
// audio mute setting).

const NIGHT_KEY = 'chhota-scholar-night-mode'
const FONT_KEY = 'chhota-scholar-font-scale'

export const FONT_SCALES = [90, 100, 115, 130] as const
export type FontScale = (typeof FONT_SCALES)[number]

export function getNightMode(): boolean {
  try {
    return localStorage.getItem(NIGHT_KEY) === '1'
  } catch {
    return false
  }
}

export function getFontScale(): FontScale {
  try {
    const raw = Number(localStorage.getItem(FONT_KEY))
    return (FONT_SCALES as readonly number[]).includes(raw) ? (raw as FontScale) : 100
  } catch {
    return 100
  }
}

/** Applies the current settings to the document. Safe to call before React
 *  even mounts (uses only the DOM + localStorage), so main.tsx calls this
 *  first - the page never flashes bright-then-dim on load. */
export function applyDisplaySettings() {
  const night = getNightMode()
  const scale = getFontScale()
  document.documentElement.classList.toggle('night', night)
  document.documentElement.style.fontSize = `${scale}%`
}

export function setNightMode(value: boolean) {
  try {
    localStorage.setItem(NIGHT_KEY, value ? '1' : '0')
  } catch {
    // ignore
  }
  applyDisplaySettings()
}

export function setFontScale(value: FontScale) {
  try {
    localStorage.setItem(FONT_KEY, String(value))
  } catch {
    // ignore
  }
  applyDisplaySettings()
}
