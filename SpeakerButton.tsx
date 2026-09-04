import { speak } from '../services/audioService'

interface Props {
  text: string
  lang?: 'en-IN' | 'hi-IN'
  size?: 'sm' | 'md'
}

export default function SpeakerButton({ text, lang = 'en-IN', size = 'md' }: Props) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        speak(text, lang)
      }}
      aria-label={`Hear ${text}`}
      className={`flex items-center justify-center rounded-full bg-white/90 shadow-sticker ${
        size === 'sm' ? 'h-8 w-8 text-sm' : 'h-11 w-11 text-lg'
      }`}
    >
      🔊
    </button>
  )
}
