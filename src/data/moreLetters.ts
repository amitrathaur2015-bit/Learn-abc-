import type { CharacterTemplate } from '../types/tracing'

// English capital letters D to Z, on the same 300x300 grid as A, B and C
// (top line y=60, bottom line y=240). Each stroke is one finger movement.

export const moreEnglishTemplates: CharacterTemplate[] = [
  {
    id: 'D',
    subject: 'english',
    label: 'D',
    difficulty: 2,
    strokes: [
      { id: 'D-1', d: 'M95,60 L95,240', startPoint: { x: 95, y: 60 } },
      { id: 'D-2', d: 'M95,60 C190,60 215,100 215,150 C215,200 190,240 95,240', startPoint: { x: 95, y: 60 } }
    ]
  },
  {
    id: 'E',
    subject: 'english',
    label: 'E',
    difficulty: 1,
    strokes: [
      { id: 'E-1', d: 'M100,60 L100,240', startPoint: { x: 100, y: 60 } },
      { id: 'E-2', d: 'M100,60 L215,60', startPoint: { x: 100, y: 60 } },
      { id: 'E-3', d: 'M100,150 L195,150', startPoint: { x: 100, y: 150 } },
      { id: 'E-4', d: 'M100,240 L215,240', startPoint: { x: 100, y: 240 } }
    ]
  },
  {
    id: 'F',
    subject: 'english',
    label: 'F',
    difficulty: 1,
    strokes: [
      { id: 'F-1', d: 'M100,60 L100,240', startPoint: { x: 100, y: 60 } },
      { id: 'F-2', d: 'M100,60 L215,60', startPoint: { x: 100, y: 60 } },
      { id: 'F-3', d: 'M100,150 L195,150', startPoint: { x: 100, y: 150 } }
    ]
  },
  {
    id: 'G',
    subject: 'english',
    label: 'G',
    difficulty: 3,
    strokes: [
      { id: 'G-1', d: 'M218,92 C205,58 178,48 150,48 C100,48 70,90 70,150 C70,210 100,252 150,252 C195,252 220,225 220,165', startPoint: { x: 218, y: 92 } },
      { id: 'G-2', d: 'M150,165 L220,165', startPoint: { x: 150, y: 165 } }
    ]
  },
  {
    id: 'H',
    subject: 'english',
    label: 'H',
    difficulty: 1,
    strokes: [
      { id: 'H-1', d: 'M90,60 L90,240', startPoint: { x: 90, y: 60 } },
      { id: 'H-2', d: 'M210,60 L210,240', startPoint: { x: 210, y: 60 } },
      { id: 'H-3', d: 'M90,150 L210,150', startPoint: { x: 90, y: 150 } }
    ]
  },
  {
    id: 'I',
    subject: 'english',
    label: 'I',
    difficulty: 1,
    strokes: [
      { id: 'I-1', d: 'M110,60 L190,60', startPoint: { x: 110, y: 60 } },
      { id: 'I-2', d: 'M150,60 L150,240', startPoint: { x: 150, y: 60 } },
      { id: 'I-3', d: 'M110,240 L190,240', startPoint: { x: 110, y: 240 } }
    ]
  },
  {
    id: 'J',
    subject: 'english',
    label: 'J',
    difficulty: 2,
    strokes: [
      { id: 'J-1', d: 'M170,60 L170,185 C170,225 150,245 120,245 C95,245 80,230 78,205', startPoint: { x: 170, y: 60 } }
    ]
  },
  {
    id: 'K',
    subject: 'english',
    label: 'K',
    difficulty: 2,
    strokes: [
      { id: 'K-1', d: 'M95,60 L95,240', startPoint: { x: 95, y: 60 } },
      { id: 'K-2', d: 'M210,60 L95,155', startPoint: { x: 210, y: 60 } },
      { id: 'K-3', d: 'M125,130 L215,240', startPoint: { x: 125, y: 130 } }
    ]
  },
  {
    id: 'L',
    subject: 'english',
    label: 'L',
    difficulty: 1,
    strokes: [
      { id: 'L-1', d: 'M100,60 L100,240', startPoint: { x: 100, y: 60 } },
      { id: 'L-2', d: 'M100,240 L215,240', startPoint: { x: 100, y: 240 } }
    ]
  },
  {
    id: 'M',
    subject: 'english',
    label: 'M',
    difficulty: 3,
    strokes: [
      { id: 'M-1', d: 'M75,240 L75,60 L150,180 L225,60 L225,240', startPoint: { x: 75, y: 240 } }
    ]
  },
  {
    id: 'N',
    subject: 'english',
    label: 'N',
    difficulty: 2,
    strokes: [
      { id: 'N-1', d: 'M85,240 L85,60 L215,240 L215,60', startPoint: { x: 85, y: 240 } }
    ]
  },
  {
    id: 'O',
    subject: 'english',
    label: 'O',
    difficulty: 1,
    strokes: [
      { id: 'O-1', d: 'M150,50 C102,50 72,92 72,150 C72,208 102,250 150,250 C198,250 228,208 228,150 C228,92 198,50 150,50', startPoint: { x: 150, y: 50 } }
    ]
  },
  {
    id: 'P',
    subject: 'english',
    label: 'P',
    difficulty: 2,
    strokes: [
      { id: 'P-1', d: 'M100,60 L100,240', startPoint: { x: 100, y: 60 } },
      { id: 'P-2', d: 'M100,60 C175,52 205,78 205,112 C205,146 175,166 100,160', startPoint: { x: 100, y: 60 } }
    ]
  },
  {
    id: 'Q',
    subject: 'english',
    label: 'Q',
    difficulty: 3,
    strokes: [
      { id: 'Q-1', d: 'M150,50 C102,50 72,92 72,150 C72,208 102,250 150,250 C198,250 228,208 228,150 C228,92 198,50 150,50', startPoint: { x: 150, y: 50 } },
      { id: 'Q-2', d: 'M160,190 L225,255', startPoint: { x: 160, y: 190 } }
    ]
  },
  {
    id: 'R',
    subject: 'english',
    label: 'R',
    difficulty: 3,
    strokes: [
      { id: 'R-1', d: 'M100,60 L100,240', startPoint: { x: 100, y: 60 } },
      { id: 'R-2', d: 'M100,60 C175,52 205,78 205,112 C205,146 175,166 100,160', startPoint: { x: 100, y: 60 } },
      { id: 'R-3', d: 'M140,164 L215,240', startPoint: { x: 140, y: 164 } }
    ]
  },
  {
    id: 'S',
    subject: 'english',
    label: 'S',
    difficulty: 3,
    strokes: [
      { id: 'S-1', d: 'M205,92 C195,62 170,52 145,52 C108,52 90,76 92,102 C94,130 125,142 150,150 C180,158 210,172 210,200 C210,232 185,248 150,248 C118,248 92,235 85,205', startPoint: { x: 205, y: 92 } }
    ]
  },
  {
    id: 'T',
    subject: 'english',
    label: 'T',
    difficulty: 1,
    strokes: [
      { id: 'T-1', d: 'M80,60 L220,60', startPoint: { x: 80, y: 60 } },
      { id: 'T-2', d: 'M150,60 L150,240', startPoint: { x: 150, y: 60 } }
    ]
  },
  {
    id: 'U',
    subject: 'english',
    label: 'U',
    difficulty: 1,
    strokes: [
      { id: 'U-1', d: 'M90,60 L90,170 C90,220 115,245 150,245 C185,245 210,220 210,170 L210,60', startPoint: { x: 90, y: 60 } }
    ]
  },
  {
    id: 'V',
    subject: 'english',
    label: 'V',
    difficulty: 1,
    strokes: [
      { id: 'V-1', d: 'M75,60 L150,240 L225,60', startPoint: { x: 75, y: 60 } }
    ]
  },
  {
    id: 'W',
    subject: 'english',
    label: 'W',
    difficulty: 3,
    strokes: [
      { id: 'W-1', d: 'M55,60 L100,240 L150,110 L200,240 L245,60', startPoint: { x: 55, y: 60 } }
    ]
  },
  {
    id: 'X',
    subject: 'english',
    label: 'X',
    difficulty: 1,
    strokes: [
      { id: 'X-1', d: 'M80,60 L220,240', startPoint: { x: 80, y: 60 } },
      { id: 'X-2', d: 'M220,60 L80,240', startPoint: { x: 220, y: 60 } }
    ]
  },
  {
    id: 'Y',
    subject: 'english',
    label: 'Y',
    difficulty: 2,
    strokes: [
      { id: 'Y-1', d: 'M80,60 L150,150 L150,240', startPoint: { x: 80, y: 60 } },
      { id: 'Y-2', d: 'M220,60 L150,150', startPoint: { x: 220, y: 60 } }
    ]
  },
  {
    id: 'Z',
    subject: 'english',
    label: 'Z',
    difficulty: 1,
    strokes: [
      { id: 'Z-1', d: 'M80,60 L220,60 L80,240 L220,240', startPoint: { x: 80, y: 60 } }
    ]
  }
]
