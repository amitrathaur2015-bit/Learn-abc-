import type { CSSProperties } from 'react'

/** A gentle, always-on decorative layer behind every screen - soft clouds,
 *  twinkling stars, and drifting bubbles. Pure CSS/SVG (no images, no
 *  Three.js), fixed position, aria-hidden and pointer-events: none, so it
 *  never affects layout, performance-heavy work, or tap targets. Designed to
 *  make the whole app feel like a soft, dreamy nursery sky rather than a
 *  blank background - not just the home screen hero. */
export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">
      {/* clouds */}
      <Cloud className="drift-a" style={{ top: '6%', left: '-4%', width: 140, opacity: 0.6 }} />
      <Cloud className="drift-b" style={{ top: '16%', right: '-6%', width: 110, opacity: 0.5 }} />
      <Cloud className="drift-a" style={{ top: '58%', left: '2%', width: 90, opacity: 0.4 }} />

      {/* soft color bubbles */}
      <div
        className="drift-b rounded-full"
        style={{ top: '30%', right: '8%', width: 70, height: 70, background: 'radial-gradient(circle, #FFD9E8 0%, transparent 70%)' }}
      />
      <div
        className="drift-a rounded-full"
        style={{ top: '70%', right: '18%', width: 90, height: 90, background: 'radial-gradient(circle, #D6EFFF 0%, transparent 70%)' }}
      />
      <div
        className="drift-b rounded-full"
        style={{ top: '82%', left: '10%', width: 60, height: 60, background: 'radial-gradient(circle, #FFF0C2 0%, transparent 70%)' }}
      />

      {/* twinkling stars */}
      {STAR_POSITIONS.map((s, i) => (
        <span
          key={i}
          className="twinkle text-xl"
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s`, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  )
}

const STAR_POSITIONS = [
  { top: '10%', left: '78%', emoji: '⭐', delay: 0 },
  { top: '22%', left: '12%', emoji: '✨', delay: 0.6 },
  { top: '40%', left: '90%', emoji: '✨', delay: 1.2 },
  { top: '48%', left: '6%', emoji: '⭐', delay: 1.8 },
  { top: '65%', left: '85%', emoji: '✨', delay: 0.9 },
  { top: '90%', left: '55%', emoji: '⭐', delay: 1.5 }
]

function Cloud({ className, style }: { className: string; style: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 100" fill="none">
      <ellipse cx="60" cy="60" rx="45" ry="30" fill="white" />
      <ellipse cx="110" cy="45" rx="55" ry="38" fill="white" />
      <ellipse cx="160" cy="62" rx="38" ry="26" fill="white" />
    </svg>
  )
}
