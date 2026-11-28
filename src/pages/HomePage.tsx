import { useState } from 'react'
import type { ReactNode } from 'react'
import AdSlot from '../components/AdSlot'
import { isMuted, toggleMute } from '../services/audioService'
import { getNightMode, setNightMode } from '../services/displaySettingsService'

interface Props {
  onOpenCard: (id: string) => void
}

// The whole home screen is drawn with code (SVG) - no pictures. It is drawn on a board
// 1000 wide and 2060 tall, and scales to any phone width.
const W = 1000
const H = 2060
const FONT = "'Baloo 2', 'Baloo Bhai 2', 'Nunito', system-ui, sans-serif"

// ------------------------------------------------------------------ small pieces ----

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="30" rx="105" ry="34" fill="#CFEBFF" />
      <ellipse cx="0" cy="22" rx="105" ry="34" fill="#fff" />
      <circle cx="-52" cy="2" r="40" fill="#fff" />
      <circle cx="2" cy="-16" r="54" fill="#fff" />
      <circle cx="58" cy="2" r="40" fill="#fff" />
    </g>
  )
}

function Star({ x, y, r, fill = '#FFD43B', rot = 0 }: { x: number; y: number; r: number; fill?: string; rot?: number }) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 === 0 ? r : r * 0.48
    pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`)
  }
  return (
    <polygon
      points={pts.join(' ')}
      transform={`translate(${x} ${y}) rotate(${rot})`}
      fill={fill}
      stroke="#F4A900"
      strokeWidth={r * 0.12}
      strokeLinejoin="round"
    >
      {fill !== 'none' && <animate attributeName="opacity" values="1;0.5;1" dur={`${2 + (x % 7) / 5}s`} repeatCount="indefinite" />}
    </polygon>
  )
}

function Daisy({ x, y, s = 1, petal = '#fff', centre = '#FFC93C' }: { x: number; y: number; s?: number; petal?: string; centre?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy="-17" rx="9" ry="14" fill={petal} stroke="#E6EEF5" strokeWidth="1.5" transform={`rotate(${a})`} />
      ))}
      <circle r="9" fill={centre} />
    </g>
  )
}

function Tuft({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#2F8F1B">
      <path d="M-14,0 C-12,-22 -8,-34 -16,-48 C-4,-38 0,-22 0,0 Z" />
      <path d="M-2,0 C0,-30 6,-46 4,-64 C14,-46 14,-22 10,0 Z" />
      <path d="M8,0 C12,-18 20,-30 30,-40 C28,-24 24,-10 22,0 Z" />
    </g>
  )
}

// ------------------------------------------------------------------ the two kids ----

const SKIN = '#FFD3AB'
const SKIN_SHADE = '#F2B98C'

function Face({ girl }: { girl?: boolean }) {
  return (
    <g>
      {/* ears */}
      <circle cx="-90" cy="10" r="18" fill={SKIN} />
      <circle cx="90" cy="10" r="18" fill={SKIN} />
      <circle cx="-90" cy="10" r="8" fill="#FFB39B" />
      <circle cx="90" cy="10" r="8" fill="#FFB39B" />
      {/* head */}
      <ellipse cx="0" cy="6" rx="92" ry="88" fill={SKIN} />
      <ellipse cx="0" cy="50" rx="70" ry="40" fill={SKIN_SHADE} opacity="0.35" />
      {/* eyes */}
      {[-34, 34].map((ex) => (
        <g key={ex}>
          <ellipse cx={ex} cy="8" rx="18" ry="23" fill="#fff" />
          <ellipse cx={ex} cy="11" rx="14" ry="19" fill="#4A2A14" />
          <ellipse cx={ex} cy="12" rx="9" ry="13" fill="#2A150A" />
          <circle cx={ex + 5} cy="3" r="6" fill="#fff" />
          <circle cx={ex - 5} cy="18" r="3" fill="#fff" />
        </g>
      ))}
      {girl &&
        [-34, 34].map((ex) => (
          <path key={ex} d={`M${ex - 19},-8 q${ex < 0 ? -6 : 6},-8 ${ex < 0 ? -12 : 12},-6`} stroke="#4A2A14" strokeWidth="4" fill="none" strokeLinecap="round" />
        ))}
      {/* eyebrows */}
      <path d="M-56,-24 Q-38,-36 -16,-26" stroke="#5B3517" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M56,-24 Q38,-36 16,-26" stroke="#5B3517" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="-62" cy="42" r="15" fill="#FF8FA3" opacity="0.55" />
      <circle cx="62" cy="42" r="15" fill="#FF8FA3" opacity="0.55" />
      {/* nose */}
      <path d="M-5,36 Q0,41 5,36" stroke="#D9906A" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* open smile */}
      <path d="M-30,52 Q0,100 30,52 Z" fill="#8A2230" />
      <path d="M-24,53 Q0,60 24,53 Q22,62 0,63 Q-22,62 -24,53 Z" fill="#fff" />
      <path d="M-14,78 Q0,66 14,78 Q0,92 -14,78 Z" fill="#FF7A8C" />
    </g>
  )
}

function Boy() {
  return (
    <g>
      {/* backpack */}
      <rect x="-122" y="78" width="62" height="170" rx="28" fill="#2A63DB" />
      <rect x="60" y="78" width="62" height="170" rx="28" fill="#2A63DB" />
      {/* body */}
      <path d="M-100,160 Q-100,96 -48,90 L48,90 Q100,96 100,160 L100,330 L-100,330 Z" fill="#F7F9FF" stroke="#D6DFF3" strokeWidth="4" />
      <path d="M-64,92 L-38,92 L-30,330 L-72,330 Z" fill="#3A78F0" />
      <path d="M64,92 L38,92 L30,330 L72,330 Z" fill="#3A78F0" />
      <circle cx="-51" cy="160" r="7" fill="#FFD43B" />
      <circle cx="51" cy="160" r="7" fill="#FFD43B" />
      {/* neck and collar */}
      <rect x="-24" y="66" width="48" height="40" rx="16" fill={SKIN_SHADE} />
      <path d="M-30,90 L0,128 L30,90 L18,86 L0,104 L-18,86 Z" fill="#DCE9FF" stroke="#C3D6F5" strokeWidth="2" />
      {/* left arm (resting) */}
      <circle cx="-96" cy="150" r="34" fill="#F7F9FF" stroke="#D6DFF3" strokeWidth="4" />
      {/* right arm: thumbs up */}
      <path d="M86,140 C150,140 178,92 172,38" stroke={SKIN} strokeWidth="46" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="146" r="38" fill="#F7F9FF" stroke="#D6DFF3" strokeWidth="4" />
      <circle cx="170" cy="20" r="38" fill={SKIN} />
      <rect x="152" y="-52" width="32" height="64" rx="16" fill={SKIN} />
      <path d="M142,26 q14,10 34,4 M142,42 q14,10 34,4" stroke={SKIN_SHADE} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* head */}
      <Face />
      {/* hair */}
      <path
        d="M-98,-4 C-112,-96 -42,-132 6,-124 C68,-132 116,-78 98,-2 C92,-36 62,-56 34,-52 C14,-70 -18,-72 -40,-56 C-70,-52 -90,-34 -98,-4 Z"
        fill="#5A3414"
      />
      <path d="M-30,-118 C-20,-146 18,-150 30,-122 C14,-134 -10,-134 -30,-118 Z" fill="#5A3414" />
      <path d="M-60,-88 C-40,-110 -10,-116 20,-114" stroke="#7A4A20" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  )
}

function Girl() {
  return (
    <g>
      {/* hair behind */}
      <path d="M-104,0 C-120,90 -112,150 -84,170 L-60,100 Z" fill="#5A3414" />
      <path d="M104,0 C120,90 112,150 84,170 L60,100 Z" fill="#5A3414" />
      {/* body: white blouse and pink dungarees */}
      <path d="M-100,160 Q-100,96 -48,90 L48,90 Q100,96 100,160 L100,330 L-100,330 Z" fill="#fff" stroke="#EBD9E1" strokeWidth="4" />
      <path d="M-58,170 L58,170 L66,330 L-66,330 Z" fill="#F4577A" />
      <path d="M-58,92 L-34,92 L-44,176 L-62,176 Z" fill="#F4577A" />
      <path d="M58,92 L34,92 L44,176 L62,176 Z" fill="#F4577A" />
      <circle cx="-48" cy="186" r="8" fill="#FFD43B" />
      <circle cx="48" cy="186" r="8" fill="#FFD43B" />
      <rect x="-26" y="205" width="52" height="38" rx="10" fill="#E83E65" />
      <rect x="-24" y="66" width="48" height="40" rx="16" fill={SKIN_SHADE} />
      <path d="M-30,90 L0,122 L30,90 L18,86 L0,100 L-18,86 Z" fill="#fff" stroke="#EBD9E1" strokeWidth="2" />
      {/* left arm resting */}
      <circle cx="-98" cy="150" r="34" fill="#fff" stroke="#EBD9E1" strokeWidth="4" />
      {/* right arm: waving */}
      <path d="M88,140 C146,132 176,96 176,50" stroke={SKIN} strokeWidth="44" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="146" r="38" fill="#fff" stroke="#EBD9E1" strokeWidth="4" />
      <g transform="translate(176 24) rotate(10)">
        <ellipse cx="0" cy="0" rx="36" ry="40" fill={SKIN} />
        {[-26, -9, 9, 26].map((fx, i) => (
          <rect key={fx} x={fx - 8} y={-64 + (i === 0 || i === 3 ? 10 : 0)} width="16" height="40" rx="8" fill={SKIN} />
        ))}
        <rect x="-56" y="-8" width="16" height="34" rx="8" fill={SKIN} transform="rotate(-34 -48 10)" />
      </g>
      {/* head */}
      <Face girl />
      {/* hair top and fringe */}
      <path
        d="M-100,0 C-116,-98 -40,-134 8,-126 C70,-134 118,-80 100,0 C96,-40 70,-66 40,-70 C30,-34 -20,-44 -40,-72 C-70,-66 -94,-40 -100,0 Z"
        fill="#5A3414"
      />
      <path d="M-62,-84 C-40,-110 -8,-118 24,-114" stroke="#7A4A20" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* pink bow */}
      <g transform="translate(62 -108) rotate(18)">
        <path d="M0,0 C-30,-44 -86,-28 -74,6 C-70,30 -28,24 0,0 Z" fill="#FF4F9A" stroke="#D93680" strokeWidth="4" />
        <path d="M0,0 C30,-44 86,-28 74,6 C70,30 28,24 0,0 Z" fill="#FF4F9A" stroke="#D93680" strokeWidth="4" />
        <path d="M-48,-4 C-40,-16 -26,-14 -14,-4 M48,-4 C40,-16 26,-14 14,-4" stroke="#FF9CC8" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle r="17" fill="#FF70AE" stroke="#D93680" strokeWidth="4" />
      </g>
    </g>
  )
}

// ------------------------------------------------------------------ the 9 icons -----
// Each icon is drawn inside a 120 x 120 box (0,0 to 120,120).

function IconWriting() {
  return (
    <g>
      <g transform="rotate(-8 50 70)">
        <rect x="14" y="24" width="78" height="86" rx="12" fill="#2D55B8" />
        <rect x="18" y="20" width="76" height="86" rx="11" fill="#F6F9FF" stroke="#2D55B8" strokeWidth="5" />
        {[40, 55, 70, 85].map((ly) => (
          <rect key={ly} x="30" y={ly} width="50" height="6" rx="3" fill="#86B7F7" />
        ))}
      </g>
      <g transform="translate(86 26) rotate(40)">
        <rect x="-12" y="-58" width="24" height="16" rx="6" fill="#F2433F" />
        <rect x="-12" y="-44" width="24" height="9" fill="#3AA7E8" />
        <rect x="-12" y="-36" width="24" height="76" fill="#FFC531" />
        <rect x="-12" y="-36" width="9" height="76" fill="#FFD95E" />
        <path d="M-12,40 L12,40 L0,66 Z" fill="#F2C48E" />
        <path d="M-4,56 L4,56 L0,66 Z" fill="#33323A" />
      </g>
    </g>
  )
}

function IconEnglish() {
  return (
    <g transform="rotate(-6 60 60)">
      <rect x="14" y="14" width="94" height="96" rx="14" fill="#C9480A" />
      <rect x="10" y="8" width="94" height="94" rx="14" fill="url(#gIconOrange)" />
      <rect x="18" y="96" width="82" height="9" rx="4" fill="#FFE9CF" />
      <text x="57" y="66" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="46" fill="#fff" stroke="#D9560A" strokeWidth="2" paintOrder="stroke">
        abc
      </text>
    </g>
  )
}

function IconHindi() {
  return (
    <g transform="rotate(7 60 60)">
      <rect x="12" y="14" width="92" height="94" rx="16" fill="#A50F18" />
      <rect x="10" y="8" width="92" height="92" rx="16" fill="url(#gIconRed)" />
      <rect x="18" y="14" width="76" height="16" rx="8" fill="#fff" opacity="0.22" />
      <text x="56" y="84" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="78" fill="#fff">
        अ
      </text>
    </g>
  )
}

function IconMaths() {
  const d = { fontFamily: FONT, fontWeight: 800 as const, paintOrder: 'stroke' as const, strokeLinejoin: 'round' as const }
  return (
    <g>
      <text x="6" y="100" fontSize="86" fill="#FFC531" stroke="#E8921A" strokeWidth="7" {...d}>1</text>
      <text x="40" y="70" fontSize="78" fill="#FF72D6" stroke="#D1389F" strokeWidth="7" {...d}>2</text>
      <text x="72" y="104" fontSize="78" fill="#52C6F7" stroke="#1C86C4" strokeWidth="7" {...d}>3</text>
    </g>
  )
}

function IconGames() {
  return (
    <g>
      <path d="M18,60 C18,40 32,30 48,30 L72,30 C88,30 102,40 102,60 C102,86 94,102 82,102 C72,102 68,88 60,88 C52,88 48,102 38,102 C26,102 18,86 18,60 Z" fill="#14172A" transform="translate(0 5)" />
      <path d="M18,60 C18,40 32,30 48,30 L72,30 C88,30 102,40 102,60 C102,86 94,102 82,102 C72,102 68,88 60,88 C52,88 48,102 38,102 C26,102 18,86 18,60 Z" fill="url(#gIconDark)" />
      <path d="M30,38 C40,32 52,34 60,34" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.35" />
      <rect x="30" y="52" width="26" height="9" rx="3" fill="#fff" />
      <rect x="38.5" y="43.5" width="9" height="26" rx="3" fill="#fff" />
      <circle cx="84" cy="44" r="6.5" fill="#FFD43B" />
      <circle cx="94" cy="54" r="6.5" fill="#FF5A5A" />
      <circle cx="84" cy="64" r="6.5" fill="#66D94E" />
      <circle cx="74" cy="54" r="6.5" fill="#B66BFF" />
      <circle cx="44" cy="80" r="9" fill="#B66BFF" stroke="#7A3FCF" strokeWidth="3" />
      <circle cx="76" cy="80" r="9" fill="#B66BFF" stroke="#7A3FCF" strokeWidth="3" />
    </g>
  )
}

function IconShapes() {
  return (
    <g>
      <path d="M58,18 C28,14 8,38 12,66 C16,96 44,108 72,100 C84,96 80,84 70,80 C60,76 62,64 74,64 L98,66 C112,62 112,34 94,24 C84,18 70,18 58,18 Z" fill="#E4B24F" />
      <path d="M56,12 C26,8 6,32 10,60 C14,90 42,102 70,94 C82,90 78,78 68,74 C58,70 60,58 72,58 L96,60 C110,56 110,28 92,18 C82,12 68,12 56,12 Z" fill="#F7D488" stroke="#D9A23C" strokeWidth="3" />
      <circle cx="34" cy="36" r="9" fill="#43B64A" />
      <circle cx="62" cy="26" r="9" fill="#EE3B3B" />
      <circle cx="24" cy="62" r="9" fill="#2D7FE8" />
      <circle cx="44" cy="82" r="9" fill="#FF9A1F" />
      <circle cx="68" cy="78" r="0" fill="none" />
      <ellipse cx="82" cy="46" rx="9" ry="7" fill="#D9A23C" opacity="0.5" />
      <g transform="translate(88 40) rotate(40)">
        <rect x="-6" y="-44" width="12" height="62" rx="6" fill="#2F7BE8" stroke="#1C54B0" strokeWidth="2" />
        <rect x="-6" y="-44" width="12" height="14" rx="6" fill="#1C3F8F" />
        <path d="M-6,18 L6,18 L0,34 Z" fill="#E4B24F" />
      </g>
    </g>
  )
}

function IconGK() {
  return (
    <g>
      <circle cx="60" cy="62" r="48" fill="#0B3F9E" />
      <circle cx="60" cy="58" r="48" fill="url(#gIconGlobe)" />
      <path d="M26,42 C32,28 50,22 62,28 C58,36 48,38 46,48 C44,58 34,56 30,66 C24,60 22,50 26,42 Z" fill="#7CDB45" />
      <path d="M62,48 C74,44 90,50 96,62 C92,76 80,84 74,98 C66,94 66,80 62,72 C58,64 56,54 62,48 Z" fill="#7CDB45" />
      <path d="M40,84 C46,80 54,84 56,92 C50,100 42,96 40,84 Z" fill="#7CDB45" />
      <path d="M26,34 C40,16 70,14 88,28" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.35" />
    </g>
  )
}

function IconRewards() {
  return (
    <g>
      <path d="M30,24 C6,22 6,52 28,58 M90,24 C114,22 114,52 92,58" stroke="#E69A00" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M30,24 C6,22 6,52 28,58 M90,24 C114,22 114,52 92,58" stroke="#FFD43B" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M28,12 L92,12 C92,52 82,72 64,76 L56,76 C38,72 28,52 28,12 Z" fill="url(#gIconGold)" stroke="#E69A00" strokeWidth="3" />
      <path d="M38,18 C38,44 44,60 54,68" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.45" />
      <rect x="52" y="76" width="16" height="16" fill="#E8A300" />
      <rect x="38" y="90" width="44" height="10" rx="4" fill="#F2B310" />
      <rect x="30" y="98" width="60" height="14" rx="5" fill="#6B3E1B" />
      <circle cx="60" cy="38" r="9" fill="#FFF0A8" stroke="#E69A00" strokeWidth="2" />
    </g>
  )
}

function IconParent() {
  const person = (x: number, y: number, s: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#14121C">
      <circle cx="0" cy="-16" r="13" />
      <path d="M-22,22 C-22,2 -12,-2 0,-2 C12,-2 22,2 22,22 Z" />
    </g>
  )
  return (
    <g>
      <rect x="8" y="16" width="104" height="92" rx="16" fill="#9A78E0" />
      <rect x="8" y="10" width="104" height="92" rx="16" fill="url(#gIconTile)" stroke="#fff" strokeWidth="3" />
      {person(36, 52, 1)}
      {person(84, 52, 1)}
      {person(60, 82, 0.85)}
    </g>
  )
}

const ICONS: ReactNode[] = [
  <IconWriting key="w" />,
  <IconEnglish key="e" />,
  <IconHindi key="h" />,
  <IconMaths key="m" />,
  <IconGames key="g" />,
  <IconShapes key="s" />,
  <IconGK key="k" />,
  <IconRewards key="r" />,
  <IconParent key="p" />
]

// ------------------------------------------------------------------ the buttons -----

interface Tile {
  id: string
  aria: string
  lines: string[]
  icon: number
  top: string
  bottom: string
  edge: string
  text: string
  chevron: string
  size: number
  widths: number[]
}

// To rename a button change its `lines`. To change its colour change top / bottom / edge.
const TILES: Tile[] = [
  { id: 'english', aria: 'English', lines: ['English'], icon: 1, top: '#2FC0FF', bottom: '#0670EE', edge: '#0A52B4', text: '#ffffff', chevron: '#0A7CF5', size: 52, widths: [174] },
  { id: 'hindi', aria: 'Hindi', lines: ['Hindi'], icon: 2, top: '#FFE04A', bottom: '#FFA600', edge: '#C98000', text: '#3A2800', chevron: '#F59A00', size: 58, widths: [139] },
  { id: 'maths', aria: 'Maths', lines: ['Maths'], icon: 3, top: '#6DEB48', bottom: '#2BBA17', edge: '#18861A', text: '#ffffff', chevron: '#2FB21C', size: 58, widths: [163] },
  { id: 'games', aria: 'Learning Games', lines: ['Learning', 'Games'], icon: 4, top: '#D36CFF', bottom: '#962AF2', edge: '#6A22BE', text: '#ffffff', chevron: '#9A2FF5', size: 46, widths: [185, 142] },
  { id: 'shapes', aria: 'Colors and Shapes', lines: ['Colors &', 'Shapes'], icon: 5, top: '#FFAA3A', bottom: '#FC600C', edge: '#C23F18', text: '#ffffff', chevron: '#FD6A14', size: 46, widths: [175, 152] },
  { id: 'gk', aria: 'General Knowledge', lines: ['GK'], icon: 6, top: '#2BE6FA', bottom: '#00B6DC', edge: '#0A88B2', text: '#ffffff', chevron: '#01B3D6', size: 62, widths: [79] },
  { id: 'rewards', aria: 'My Rewards', lines: ['My Rewards'], icon: 7, top: '#FFD92E', bottom: '#FFA20A', edge: '#C98200', text: '#4A2E00', chevron: '#F59F00', size: 38, widths: [210] },
  { id: 'parent', aria: 'Parent Area', lines: ['Parent Area'], icon: 8, top: '#C456FF', bottom: '#951BF5', edge: '#6612BA', text: '#ffffff', chevron: '#9A1FF7', size: 38, widths: [205] }
]

const COL_X = [38, 512]
const ROW_Y = [1175, 1370, 1565, 1760]
const PILL_W = 450
const PILL_H = 170

function Chevron({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy + 3} r={r} fill="rgba(0,0,0,0.18)" />
      <circle cx={cx} cy={cy} r={r} fill="#fff" />
      <path d={`M${cx - r * 0.2},${cy - r * 0.42} L${cx + r * 0.28},${cy} L${cx - r * 0.2},${cy + r * 0.42}`} stroke={color} strokeWidth={r * 0.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

function Tappable({
  id,
  label,
  pressed,
  setPressed,
  onClick,
  children
}: {
  id: string
  label: string
  pressed: string | null
  setPressed: (id: string | null) => void
  onClick: () => void
  children: ReactNode
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      style={{ cursor: 'pointer', outline: 'none' }}
      onPointerDown={() => setPressed(id)}
      onPointerUp={() => setPressed(null)}
      onPointerLeave={() => setPressed(null)}
      onPointerCancel={() => setPressed(null)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <g transform={pressed === id ? 'translate(0 7)' : undefined}>{children}</g>
    </g>
  )
}

// ------------------------------------------------------------------ the scene -------

export interface SceneProps {
  onOpenCard: (id: string) => void
  muted: boolean
  night: boolean
  onToggleSound: () => void
  onToggleNight: () => void
}

export function HomeScene({ onOpenCard, muted, night, onToggleSound, onToggleNight }: SceneProps) {
  const [pressed, setPressed] = useState<string | null>(null)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      role="group"
      aria-label="Chhota Scholar home screen"
    >
      <defs>
        <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#58C6FB" />
          <stop offset="0.18" stopColor="#8ED9FE" />
          <stop offset="0.42" stopColor="#CDEFFF" />
          <stop offset="0.7" stopColor="#F1FBFF" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="gCard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF6A8A" />
          <stop offset="1" stopColor="#F0224C" />
        </linearGradient>
        <linearGradient id="gGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gHillBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EE04A" />
          <stop offset="1" stopColor="#4CC02A" />
        </linearGradient>
        <linearGradient id="gHillFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#52C92C" />
          <stop offset="1" stopColor="#2E9A1A" />
        </linearGradient>
        <linearGradient id="gCap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A3BA8" />
          <stop offset="1" stopColor="#141F6B" />
        </linearGradient>
        <linearGradient id="gPillSub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE35C" />
          <stop offset="1" stopColor="#FFC21F" />
        </linearGradient>
        <linearGradient id="gIconOrange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFA43A" />
          <stop offset="1" stopColor="#F26A0A" />
        </linearGradient>
        <linearGradient id="gIconRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF5656" />
          <stop offset="1" stopColor="#DD1520" />
        </linearGradient>
        <linearGradient id="gIconDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A4E6A" />
          <stop offset="1" stopColor="#1B1E34" />
        </linearGradient>
        <radialGradient id="gIconGlobe" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#52B6FF" />
          <stop offset="1" stopColor="#0A56CF" />
        </radialGradient>
        <linearGradient id="gIconGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFE07A" />
          <stop offset="0.5" stopColor="#FFC21F" />
          <stop offset="1" stopColor="#F29A00" />
        </linearGradient>
        <linearGradient id="gIconTile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EADFFF" />
          <stop offset="1" stopColor="#C9B4F5" />
        </linearGradient>
        {TILES.map((t) => (
          <linearGradient key={t.id} id={`gTile-${t.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={t.top} />
            <stop offset="1" stopColor={t.bottom} />
          </linearGradient>
        ))}
        <filter id="fSoft" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* ---- sky ---- */}
      <rect width={W} height={H} fill="url(#gSky)" />
      <Cloud x={120} y={250} s={0.8} />
      <Cloud x={880} y={190} s={0.7} />
      <Cloud x={810} y={470} s={0.6} />
      <Cloud x={190} y={1010} s={0.7} />
      <Cloud x={840} y={1090} s={0.6} />

      {/* ---- green bushes behind the kids ---- */}
      <ellipse cx="-10" cy="800" rx="170" ry="190" fill="url(#gHillBack)" />
      <ellipse cx="1010" cy="800" rx="170" ry="190" fill="url(#gHillBack)" />
      <ellipse cx="40" cy="830" rx="110" ry="130" fill="#46B826" />
      <ellipse cx="960" cy="830" rx="110" ry="130" fill="#46B826" />

      {/* ---- rainbow ---- */}
      {['#FF4D4D', '#FF9A2E', '#FFD93A', '#5ED04A', '#36AEEF', '#4B5BEA', '#A55AF0'].map((c, i) => (
        <path key={c} d={`M${500 - (380 - i * 28)},820 A${380 - i * 28},${380 - i * 28} 0 0 1 ${500 + (380 - i * 28)},820`} stroke={c} strokeWidth="29" fill="none" />
      ))}
      <Cloud x={190} y={790} s={0.95} />
      <Cloud x={810} y={790} s={0.95} />

      <text x="520" y="708" textAnchor="middle" textLength="205" lengthAdjust="spacingAndGlyphs" fontFamily={FONT} fontWeight="700" fontSize="44" fill="#1B2D9C" transform="rotate(-5 520 708)">
        Let&apos;s learn
      </text>
      <text x="520" y="760" textAnchor="middle" textLength="128" lengthAdjust="spacingAndGlyphs" fontFamily={FONT} fontWeight="700" fontSize="44" fill="#1B2D9C" transform="rotate(-5 520 760)">
        today!
      </text>
      <path d="M452,786 Q512,804 580,778" stroke="#FFC21F" strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* ---- the kids ---- */}
      <g transform="translate(205 575)">
        <Boy />
      </g>
      <g transform="translate(772 575)">
        <Girl />
      </g>
      <Star x={70} y={470} r={30} rot={-10} />
      <Star x={150} y={395} r={20} rot={12} />
      <Star x={930} y={455} r={30} rot={10} />
      <Star x={860} y={385} r={18} rot={-8} />
      <Star x={955} y={560} r={14} rot={0} />

      {/* ---- title ---- */}
      <g filter="url(#fSoft)">
        <text x="500" y="255" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="104" textLength="720" lengthAdjust="spacingAndGlyphs" stroke="#fff" strokeWidth="22" strokeLinejoin="round" paintOrder="stroke" fill="#fff">
          Chhota Scholar
        </text>
      </g>
      <text x="500" y="255" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="104" textLength="720" lengthAdjust="spacingAndGlyphs">
        <tspan fill="#1B2D9C">Chhota </tspan>
        <tspan fill="#9327EA">Scholar</tspan>
      </text>
      {/* graduation cap */}
      <g transform="translate(548 122) rotate(-7)">
        <path d="M-62,10 L0,-22 L62,10 L0,42 Z" fill="url(#gCap)" stroke="#0E1654" strokeWidth="4" strokeLinejoin="round" />
        <path d="M-36,30 L-36,56 C-20,70 20,70 36,56 L36,30 L0,48 Z" fill="#141F6B" stroke="#0E1654" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0,10 L52,8 L52,52" stroke="#FFC21F" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="46" y="50" width="12" height="22" rx="5" fill="#FFC21F" />
      </g>
      {/* subtitle */}
      <g>
        <path d="M130,332 L230,332 M770,332 L870,332" stroke="#1B2D9C" strokeWidth="4" strokeLinecap="round" />
        <rect x="250" y="298" width="500" height="64" rx="32" fill="#E0A100" transform="translate(0 5)" />
        <rect x="250" y="298" width="500" height="64" rx="32" fill="url(#gPillSub)" stroke="#fff" strokeWidth="4" />
        <text x="500" y="342" textAnchor="middle" textLength="423" lengthAdjust="spacingAndGlyphs" fontFamily={FONT} fontWeight="700" fontSize="35" fill="#1B2D9C">
          Nursery · LKG · UKG · Class 1
        </text>
      </g>

      {/* ---- sound and night buttons ---- */}
      <Tappable id="sound" label={muted ? 'Unmute sound' : 'Mute sound'} pressed={pressed} setPressed={setPressed} onClick={onToggleSound}>
        <circle cx="85" cy="104" r="56" fill="rgba(0,0,0,0.16)" transform="translate(0 6)" />
        <circle cx="85" cy="104" r="56" fill="#fff" stroke="#DCEBFA" strokeWidth="3" />
        <g transform="translate(85 104)" fill="none" stroke="#1E40C8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-26,-12 L-12,-12 L8,-30 L8,30 L-12,12 L-26,12 Z" fill="#1E40C8" />
          {muted ? (
            <>
              <path d="M20,-14 L40,14" />
              <path d="M40,-14 L20,14" />
            </>
          ) : (
            <>
              <path d="M22,-14 C30,-6 30,6 22,14" />
              <path d="M32,-26 C46,-12 46,12 32,26" />
            </>
          )}
        </g>
      </Tappable>
      <Tappable id="night" label={night ? 'Turn off night mode' : 'Turn on night mode'} pressed={pressed} setPressed={setPressed} onClick={onToggleNight}>
        <circle cx="915" cy="104" r="56" fill="rgba(0,0,0,0.16)" transform="translate(0 6)" />
        <circle cx="915" cy="104" r="56" fill="#fff" stroke="#DCEBFA" strokeWidth="3" />
        {night ? (
          <g transform="translate(915 104)" stroke="#F5A300" strokeWidth="7" strokeLinecap="round">
            <circle r="17" fill="#FFD43B" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="0" y1="-28" x2="0" y2="-38" transform={`rotate(${a})`} />
            ))}
          </g>
        ) : (
          <path d="M930,126 C902,134 880,110 888,84 C892,70 902,62 914,60 C898,76 906,104 930,126 Z M934,128 C908,132 886,108 892,82 C894,72 900,64 908,58 C884,74 884,112 912,128 C920,132 928,132 934,128 Z" fill="#F5B301" stroke="#E39A00" strokeWidth="5" strokeLinejoin="round" />
        )}
      </Tappable>

      {/* ---- Writing Practice card ---- */}
      <Tappable id="writing" label="Writing Practice" pressed={pressed} setPressed={setPressed} onClick={() => onOpenCard('writing')}>
        <rect x="32" y="846" width="936" height="330" rx="72" fill="#000" opacity="0.12" />
        <rect x="38" y="828" width="924" height="330" rx="72" fill="#B31438" />
        <rect x="38" y="810" width="924" height="330" rx="72" fill="url(#gCard)" stroke="#fff" strokeWidth="9" />
        <rect x="80" y="826" width="840" height="110" rx="55" fill="url(#gGloss)" opacity="0.55" />
        {/* faint drawings */}
        <text x="120" y="920" fontFamily={FONT} fontWeight="800" fontSize="74" fill="#fff" opacity="0.24" transform="rotate(-14 120 920)">ABC</text>
        <Star x={850} y={880} r={30} fill="none" rot={8} />
        <circle cx="905" cy="940" r="9" fill="#fff" opacity="0.25" />
        <path d="M150,1078 L176,1042 L196,1056 L170,1092 L140,1098 Z" fill="none" stroke="#fff" strokeWidth="5" opacity="0.28" strokeLinejoin="round" />
        <g transform="translate(405 818) scale(1.55)">{ICONS[0]}</g>
        <text x="500" y="1050" textAnchor="middle" textLength="615" lengthAdjust="spacingAndGlyphs" fontFamily={FONT} fontWeight="800" fontSize="84" fill="#fff" stroke="#B31438" strokeWidth="9" strokeLinejoin="round" paintOrder="stroke">
          Writing Practice
        </text>
        <text x="500" y="1104" textAnchor="middle" textLength="546" lengthAdjust="spacingAndGlyphs" fontFamily={FONT} fontWeight="700" fontSize="40" fill="#fff">
          Start here – trace, write, learn!
        </text>
        <Chevron cx={900} cy={1076} r={42} color="#F0224C" />
      </Tappable>

      {/* ---- the 8 buttons ---- */}
      {TILES.map((t, i) => {
        const x = COL_X[i % 2]
        const y = ROW_Y[Math.floor(i / 2)]
        const two = t.lines.length === 2
        return (
          <Tappable key={t.id} id={t.id} label={t.aria} pressed={pressed} setPressed={setPressed} onClick={() => onOpenCard(t.id)}>
            <rect x={x - 4} y={y + 24} width={PILL_W + 8} height={PILL_H} rx={PILL_H / 2} fill="#000" opacity="0.12" />
            <rect x={x} y={y + 11} width={PILL_W} height={PILL_H} rx={PILL_H / 2} fill={t.edge} />
            <rect x={x} y={y} width={PILL_W} height={PILL_H} rx={PILL_H / 2} fill={`url(#gTile-${t.id})`} stroke="rgba(255,255,255,0.8)" strokeWidth="5" />
            <rect x={x + 34} y={y + 10} width={PILL_W - 68} height={PILL_H * 0.42} rx={PILL_H * 0.21} fill="url(#gGloss)" opacity="0.8" />
            <g transform={`translate(${x + 28} ${y + 24})`}>{ICONS[t.icon]}</g>
            {t.lines.map((line, li) => (
              <text
                key={line}
                x={x + 152}
                textLength={t.widths[li]}
                lengthAdjust="spacingAndGlyphs"
                y={two ? y + PILL_H / 2 + (li === 0 ? -6 : 42) : y + PILL_H / 2 + t.size * 0.34}
                fontFamily={FONT}
                fontWeight="800"
                fontSize={t.size}
                fill={t.text}
                stroke={t.text === '#ffffff' ? 'rgba(0,0,0,0.2)' : 'none'}
                strokeWidth="4"
                paintOrder="stroke"
              >
                {line}
              </text>
            ))}
            <Chevron cx={x + PILL_W - 52} cy={y + PILL_H / 2} r={29} color={t.chevron} />
          </Tappable>
        )
      })}

      {/* ---- grass, hills and flowers ---- */}
      <path d={`M0,1990 C160,1930 300,1950 470,1985 C640,2020 800,1940 1000,1975 L1000,${H} L0,${H} Z`} fill="url(#gHillBack)" />
      <path d={`M0,2018 C200,1975 380,2010 560,2030 C740,2048 880,2000 1000,2020 L1000,${H} L0,${H} Z`} fill="url(#gHillFront)" />
      <Tuft x={70} y={2030} s={0.7} />
      <Tuft x={430} y={2040} s={0.6} />
      <Tuft x={760} y={2036} s={0.7} />
      <Tuft x={940} y={2030} s={0.55} />
      <Daisy x={120} y={2012} s={0.9} />
      <Daisy x={190} y={2038} s={0.7} petal="#FFB3D1" />
      <Daisy x={330} y={1996} s={0.7} />
      <Daisy x={560} y={2022} s={0.85} petal="#FFE08A" centre="#F2872A" />
      <Daisy x={690} y={2044} s={0.65} />
      <Daisy x={850} y={2008} s={0.9} petal="#FFB3D1" />
      <Daisy x={930} y={2040} s={0.7} />
    </svg>
  )
}

// ------------------------------------------------------------------ the page --------

export default function HomePage({ onOpenCard }: Props) {
  const [muted, setMuted] = useState(isMuted())
  const [night, setNight] = useState(getNightMode())

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden" style={{ background: '#2E9A1A' }}>
      <h1 className="sr-only">Chhota Scholar</h1>

      <HomeScene
        onOpenCard={onOpenCard}
        muted={muted}
        night={night}
        onToggleSound={async () => {
          const next = await toggleMute()
          setMuted(next)
        }}
        onToggleNight={() => {
          const next = !night
          setNightMode(next)
          setNight(next)
        }}
      />

      <div className="px-4" style={{ background: '#2E9A1A' }}>
        <AdSlot placement="home" />
      </div>
    </div>
  )
}
