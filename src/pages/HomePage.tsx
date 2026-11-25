import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import headerImg from '../home-header.webp'
import iconsImg from '../home-icons.webp'
import grassImg from '../home-grass.webp'
import AdSlot from '../components/AdSlot'
import { isMuted, toggleMute } from '../services/audioService'
import { getNightMode, setNightMode } from '../services/displaySettingsService'

interface Props {
  onOpenCard: (id: string) => void
}

// ---------------------------------------------------------------------------------
// Everything on this page is sized in "u" = 1% of the page width (the page is never
// wider than 448px). So the layout looks the same on a small or a big phone.
// ---------------------------------------------------------------------------------
const u = (n: number) => `calc(var(--u) * ${n})`

// The header picture (kids, rainbow, title) is 1086 x 426 in the original design.
// The two round buttons are placed on top of it using these pixel positions.
const HEAD_W = 1086
const HEAD_H = 426
const SOUND_AREA = { x0: 36, y0: 24, x1: 152, y1: 136 }
const NIGHT_AREA = { x0: 938, y0: 24, x1: 1054, y1: 136 }

function headStyle(a: { x0: number; y0: number; x1: number; y1: number }): CSSProperties {
  return {
    left: `${(a.x0 / HEAD_W) * 100}%`,
    top: `${(a.y0 / HEAD_H) * 100}%`,
    width: `${((a.x1 - a.x0) / HEAD_W) * 100}%`,
    height: `${((a.y1 - a.y0) / HEAD_H) * 100}%`
  }
}

// The icons are all in one picture (3 x 3 squares). This shows one of them.
function Icon({ index, size }: { index: number; size: string }) {
  const col = index % 3
  const row = Math.floor(index / 3)
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        flexShrink: 0,
        width: size,
        height: size,
        backgroundImage: `url(${iconsImg})`,
        backgroundSize: '300% 300%',
        backgroundPosition: `${col * 50}% ${row * 50}%`,
        backgroundRepeat: 'no-repeat'
      }}
    />
  )
}

function Chevron({ color, size }: { color: string; size: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
      }}
    >
      <svg viewBox="0 0 24 24" style={{ width: '58%', height: '58%' }} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </span>
  )
}

interface Tile {
  id: string
  aria: string
  label: ReactNode
  icon: number
  top: string
  bottom: string
  edge: string
  text: string
  chevron: string
  font: number
}

const LIGHT_TEXT_SHADOW = '0 2px 0 rgba(0,0,0,0.22), 0 3px 6px rgba(0,0,0,0.22)'

// To rename a button, change its `label`. To change its colour, change top/bottom/edge.
const TILES: Tile[] = [
  { id: 'english', aria: 'English', label: 'English', icon: 1, top: '#22bbff', bottom: '#0272f0', edge: '#0a5cc0', text: '#ffffff', chevron: '#0a7cf5', font: 4.6 },
  { id: 'hindi', aria: 'Hindi', label: 'Hindi', icon: 2, top: '#ffdc40', bottom: '#ffa800', edge: '#cf8200', text: '#3b2a00', chevron: '#f59a00', font: 4.6 },
  { id: 'maths', aria: 'Maths', label: 'Maths', icon: 3, top: '#62e640', bottom: '#2dbd19', edge: '#1c8a17', text: '#ffffff', chevron: '#2fb21c', font: 4.6 },
  { id: 'games', aria: 'Learning Games', label: <>Learning<br />Games</>, icon: 4, top: '#cc62ff', bottom: '#992df5', edge: '#6d25c2', text: '#ffffff', chevron: '#9a2ff5', font: 4.1 },
  { id: 'shapes', aria: 'Colors and Shapes', label: <>Colors &amp;<br />Shapes</>, icon: 5, top: '#ffa133', bottom: '#fd630f', edge: '#c8431a', text: '#ffffff', chevron: '#fd6a14', font: 4.1 },
  { id: 'gk', aria: 'General Knowledge', label: 'GK', icon: 6, top: '#22e0f6', bottom: '#01bbdf', edge: '#0b8db6', text: '#ffffff', chevron: '#01b3d6', font: 4.6 },
  { id: 'rewards', aria: 'My Rewards', label: 'My Rewards', icon: 7, top: '#ffd324', bottom: '#ffa70a', edge: '#cd8500', text: '#ffffff', chevron: '#f59f00', font: 3.7 },
  { id: 'parent', aria: 'Parent Area', label: 'Parent Area', icon: 8, top: '#bf50ff', bottom: '#9a1ff7', edge: '#6a15bd', text: '#ffffff', chevron: '#9a1ff7', font: 3.7 }
]

function Pill({ tile, onOpen }: { tile: Tile; onOpen: (id: string) => void }) {
  return (
    <button
      type="button"
      aria-label={tile.aria}
      onClick={() => onOpen(tile.id)}
      className="relative block w-full overflow-hidden text-left outline-none transition-transform [-webkit-tap-highlight-color:transparent] active:translate-y-[3px] focus-visible:ring-4 focus-visible:ring-white/90"
      style={{
        height: u(12.9),
        borderRadius: 999,
        background: `linear-gradient(180deg, ${tile.top} 0%, ${tile.bottom} 100%)`,
        border: '2px solid rgba(255,255,255,0.75)',
        boxShadow: `0 ${u(0.7)} 0 ${tile.edge}, 0 ${u(1.5)} ${u(2.4)} rgba(0,0,0,0.22)`
      }}
    >
      {/* soft shine across the top half */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '5%',
          right: '5%',
          top: '5%',
          height: '40%',
          borderRadius: 999,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0))'
        }}
      />
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', padding: `0 ${u(2.2)} 0 ${u(1.6)}` }}>
        <Icon index={tile.icon} size={u(11.4)} />
        <span
          className="font-display font-extrabold"
          style={{
            flex: 1,
            marginLeft: u(1.2),
            fontSize: u(tile.font),
            lineHeight: 1.05,
            color: tile.text,
            textShadow: tile.text === '#ffffff' ? LIGHT_TEXT_SHADOW : 'none'
          }}
        >
          {tile.label}
        </span>
        <Chevron color={tile.chevron} size={u(4.7)} />
      </span>
    </button>
  )
}

function RoundButton({
  area,
  label,
  onClick,
  children
}: {
  area: { x0: number; y0: number; x1: number; y1: number }
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={headStyle(area)}
      className="absolute flex items-center justify-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.2)] outline-none transition-transform [-webkit-tap-highlight-color:transparent] active:scale-95 focus-visible:ring-4 focus-visible:ring-white/80"
    >
      {children}
    </button>
  )
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none" stroke="#1E40C8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#1E40C8" />
      {muted ? (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#F5B301" stroke="#E39A00" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none" stroke="#F5A300" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="#FFD43B" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

// faint drawings on the big red card
const FAINT = 'rgba(255,255,255,0.28)'

function WritingCard({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <button
      type="button"
      aria-label="Writing Practice"
      onClick={() => onOpen('writing')}
      className="relative block w-full overflow-hidden text-center outline-none transition-transform [-webkit-tap-highlight-color:transparent] active:translate-y-[3px] focus-visible:ring-4 focus-visible:ring-white/90"
      style={{
        height: u(26.3),
        borderRadius: u(5.5),
        background: 'linear-gradient(180deg, #ff6384 0%, #f2284f 100%)',
        border: '3px solid rgba(255,255,255,0.92)',
        boxShadow: `0 ${u(0.9)} 0 #b8173d, 0 ${u(1.8)} ${u(3)} rgba(0,0,0,0.25)`
      }}
    >
      {/* faint decorations */}
      <span aria-hidden="true" className="font-display font-extrabold" style={{ position: 'absolute', left: u(5), top: u(4.2), fontSize: u(6.6), color: FAINT, transform: 'rotate(-14deg)', lineHeight: 1 }}>
        ABC
      </span>
      <svg aria-hidden="true" viewBox="0 0 24 24" style={{ position: 'absolute', left: u(6), bottom: u(2.6), width: u(6.2), height: u(6.2) }} fill="none" stroke={FAINT} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M3 21l1.5-5L16 4.5a2.1 2.1 0 013 3L8 19l-5 2zM14 6.5l3 3" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" style={{ position: 'absolute', right: u(5.5), top: u(4.2), width: u(4.8), height: u(4.8) }} fill="none" stroke={FAINT} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" style={{ position: 'absolute', right: u(1.6), top: u(8.6), width: u(2.4), height: u(2.4) }} fill="none" stroke={FAINT} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" style={{ position: 'absolute', right: u(11), bottom: u(3), width: u(10), height: u(10) }} fill="none" stroke={FAINT} strokeWidth="1.2" strokeLinejoin="round">
        <path d="M2 5.5c3-1.5 6-1.5 9 .5v13c-3-2-6-2-9-.5zM22 5.5c-3-1.5-6-1.5-9 .5v13c3-2 6-2 9-.5z" />
      </svg>

      {/* notebook and pencil, title, one-line hint */}
      <span style={{ position: 'absolute', left: '50%', top: u(-0.9), transform: 'translateX(-50%)' }}>
        <Icon index={0} size={u(16)} />
      </span>
      <span
        className="font-display font-extrabold"
        style={{ position: 'absolute', left: 0, right: 0, top: u(12.4), fontSize: u(5.4), lineHeight: 1.1, color: '#fff', textShadow: LIGHT_TEXT_SHADOW }}
      >
        Writing Practice
      </span>
      <span
        className="font-display font-bold"
        style={{ position: 'absolute', left: 0, right: 0, top: u(19.4), fontSize: u(3.1), lineHeight: 1.1, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}
      >
        Start here – trace, write, learn!
      </span>

      <span style={{ position: 'absolute', right: u(2.8), bottom: u(2.6) }}>
        <Chevron color="#f2284f" size={u(5.6)} />
      </span>
    </button>
  )
}

export default function HomePage({ onOpenCard }: Props) {
  const [muted, setMuted] = useState(isMuted())
  const [night, setNight] = useState(getNightMode())

  return (
    <div
      className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-white"
      style={{ ['--u' as string]: 'min(1vw, 4.48px)' } as CSSProperties}
    >
      <h1 className="sr-only">Chhota Scholar</h1>

      {/* top: kids, rainbow and the title (a picture) with the two round buttons on it */}
      <div className="relative w-full" style={{ aspectRatio: `${HEAD_W} / ${HEAD_H}` }}>
        <img
          src={headerImg}
          alt="Chhota Scholar - Nursery, LKG, UKG, Class 1. Let's learn today!"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none"
        />

        <RoundButton
          area={SOUND_AREA}
          label={muted ? 'Unmute sound' : 'Mute sound'}
          onClick={async () => {
            const next = await toggleMute()
            setMuted(next)
          }}
        >
          <SpeakerIcon muted={muted} />
        </RoundButton>

        <RoundButton
          area={NIGHT_AREA}
          label={night ? 'Turn off night mode' : 'Turn on night mode'}
          onClick={() => {
            const next = !night
            setNightMode(next)
            setNight(next)
          }}
        >
          {night ? <SunIcon /> : <MoonIcon />}
        </RoundButton>
      </div>

      {/* the real buttons */}
      <div
        style={{
          padding: `${u(0.6)} ${u(4.6)} ${u(3)}`,
          background: `linear-gradient(180deg, #e2f1ac 0, #f5f9de ${u(9)}, #ffffff ${u(24)})`
        }}
      >
        <WritingCard onOpen={onOpenCard} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: u(1.6), rowGap: u(2.1), marginTop: u(2.1) }}>
          {TILES.map((t) => (
            <Pill key={t.id} tile={t} onOpen={onOpenCard} />
          ))}
        </div>
      </div>

      <div className="px-4">
        <AdSlot placement="home" />
      </div>

      {/* grass along the bottom edge */}
      <img src={grassImg} alt="" aria-hidden="true" draggable={false} className="mt-auto block w-full select-none" />
    </div>
  )
}
