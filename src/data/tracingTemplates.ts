import type { CharacterTemplate } from '../types/tracing'

// All strokes live on a shared 300x300 grid (matches the SVG viewBox used by
// TracingGuide and the canvas resolution used by WritingBoard, so a point
// drawn by the child lines up exactly with the guide path underneath it).
//
// To add a new character later (A-Z, Hindi swar/vyanjan, 1-100): add one more
// entry here. Nothing else in the tracing engine needs to change.

export const englishTemplates: CharacterTemplate[] = [
  {
    id: 'A',
    subject: 'english',
    label: 'A',
    difficulty: 1,
    strokes: [
      { id: 'A-1', d: 'M70,240 L150,60 L230,240', startPoint: { x: 70, y: 240 } },
      { id: 'A-2', d: 'M100,172 L200,172', startPoint: { x: 100, y: 172 } }
    ]
  },
  {
    id: 'B',
    subject: 'english',
    label: 'B',
    difficulty: 2,
    strokes: [
      { id: 'B-1', d: 'M95,60 L95,240', startPoint: { x: 95, y: 60 } },
      {
        id: 'B-2',
        d: 'M95,60 C160,52 180,72 180,102 C180,132 150,148 95,150',
        startPoint: { x: 95, y: 60 }
      },
      {
        id: 'B-3',
        d: 'M95,150 C165,150 190,172 190,198 C190,228 160,240 95,240',
        startPoint: { x: 95, y: 150 }
      }
    ]
  },
  {
    id: 'C',
    subject: 'english',
    label: 'C',
    difficulty: 1,
    strokes: [
      {
        id: 'C-1',
        d: 'M220,95 C210,55 175,38 140,38 C90,38 60,90 60,150 C60,210 90,262 140,262 C175,262 210,245 220,205',
        startPoint: { x: 220, y: 95 }
      }
    ]
  }
]

export const numberTemplates: CharacterTemplate[] = [
  {
    id: '1',
    subject: 'numbers',
    label: '1',
    difficulty: 1,
    strokes: [
      { id: '1-1', d: 'M115,100 L152,62 L152,238', startPoint: { x: 115, y: 100 } },
      { id: '1-2', d: 'M108,238 L196,238', startPoint: { x: 108, y: 238 } }
    ]
  },
  {
    id: '2',
    subject: 'numbers',
    label: '2',
    difficulty: 2,
    strokes: [
      {
        id: '2-1',
        d: 'M72,98 C72,55 112,38 150,38 C192,38 224,62 220,102 C217,140 165,172 92,238 L228,238',
        startPoint: { x: 72, y: 98 }
      }
    ]
  },
  {
    id: '3',
    subject: 'numbers',
    label: '3',
    difficulty: 3,
    strokes: [
      {
        id: '3-1',
        d: 'M78,72 C100,45 138,36 168,44 C202,54 212,88 190,110 C178,120 165,124 150,126',
        startPoint: { x: 78, y: 72 }
      },
      {
        id: '3-2',
        d: 'M150,126 C172,128 200,140 206,168 C214,200 196,232 158,240 C122,248 88,232 74,206',
        startPoint: { x: 150, y: 126 }
      }
    ]
  },
  {
    id: '4',
    subject: 'numbers',
    label: '4',
    difficulty: 2,
    strokes: [
      { id: '4-1', d: 'M175,40 L70,172 L226,172', startPoint: { x: 175, y: 40 } },
      { id: '4-2', d: 'M175,110 L175,240', startPoint: { x: 175, y: 110 } }
    ]
  },
  {
    id: '5',
    subject: 'numbers',
    label: '5',
    difficulty: 3,
    strokes: [
      { id: '5-1', d: 'M198,48 L92,48 L88,138', startPoint: { x: 198, y: 48 } },
      {
        id: '5-2',
        d: 'M88,138 C168,118 212,148 212,188 C212,228 172,246 132,240 C102,236 86,224 78,208',
        startPoint: { x: 88, y: 138 }
      }
    ]
  },
  {
    id: '6',
    subject: 'numbers',
    label: '6',
    difficulty: 3,
    strokes: [
      {
        id: '6-1',
        d: 'M188,50 C118,60 74,120 74,176 C74,220 104,246 144,246 C184,246 210,220 210,184 C210,150 184,130 150,132 C119,133 94,148 79,176',
        startPoint: { x: 188, y: 50 }
      }
    ]
  },
  {
    id: '7',
    subject: 'numbers',
    label: '7',
    difficulty: 2,
    strokes: [
      { id: '7-1', d: 'M74,50 L226,50', startPoint: { x: 74, y: 50 } },
      { id: '7-2', d: 'M226,50 L122,240', startPoint: { x: 226, y: 50 } }
    ]
  },
  {
    id: '8',
    subject: 'numbers',
    label: '8',
    difficulty: 3,
    strokes: [
      {
        id: '8-1',
        d: 'M150,48 C112,48 90,72 90,100 C90,126 114,140 150,142 C186,144 210,160 210,190 C210,220 186,244 150,244 C114,244 90,220 90,190 C90,160 114,144 150,142 C186,140 210,126 210,100 C210,72 188,48 150,48',
        startPoint: { x: 150, y: 48 }
      }
    ]
  },
  {
    id: '9',
    subject: 'numbers',
    label: '9',
    difficulty: 3,
    strokes: [
      {
        id: '9-1',
        d: 'M210,112 C210,76 184,50 148,50 C112,50 88,76 88,112 C88,146 112,168 148,168 C174,168 196,158 210,140 C210,180 200,222 160,242',
        startPoint: { x: 210, y: 112 }
      }
    ]
  }
]

export function getTemplates(subject: 'english' | 'numbers'): CharacterTemplate[] {
  return subject === 'english' ? englishTemplates : numberTemplates
}

export function findTemplate(subject: 'english' | 'numbers', id: string): CharacterTemplate | undefined {
  return getTemplates(subject).find((t) => t.id === id)
}
