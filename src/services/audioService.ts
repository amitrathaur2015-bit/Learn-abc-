import { getProgress, setAudioMuted } from './progressService'

// Uses the browser's built-in SpeechSynthesis API for pronunciation - no
// audio files to host and no external API key required. If a phone's browser
// doesn't support it, speak() just quietly does nothing (checked via
// isSupported()) rather than throwing.

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let mutedCache = false
getProgress().then((s) => {
  mutedCache = s.audioMuted
})

export function isMuted(): boolean {
  return mutedCache
}

export async function toggleMute(): Promise<boolean> {
  mutedCache = !mutedCache
  await setAudioMuted(mutedCache)
  return mutedCache
}

export function speak(text: string, lang: 'en-IN' | 'hi-IN' = 'en-IN') {
  if (!isSupported() || mutedCache || !text) return
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  } catch {
    // Speech synthesis can throw on some locked-down mobile browsers -
    // never let a pronunciation button break the rest of the page.
  }
}
