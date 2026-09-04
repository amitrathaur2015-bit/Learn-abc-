// Thin data-access layer. Every function returns a Promise even though the
// data is static right now, so screens already treat content as "fetched".
// Swapping this file's internals for real Supabase queries later should not
// require touching any component.

export interface HomeCard {
  id: string
  title: string
  emoji: string
  color: 'sun' | 'sky' | 'coral' | 'leaf' | 'grape'
  ready: boolean
}

const HOME_CARDS: HomeCard[] = [
  { id: 'writing', title: 'Writing Practice', emoji: '✍️', color: 'coral', ready: true },
  { id: 'english', title: 'English', emoji: '🔤', color: 'sky', ready: true },
  { id: 'hindi', title: 'Hindi', emoji: '🅰️', color: 'sun', ready: true },
  { id: 'maths', title: 'Maths', emoji: '🔢', color: 'leaf', ready: true },
  { id: 'games', title: 'Learning Games', emoji: '🎮', color: 'grape', ready: true },
  { id: 'shapes', title: 'Colors & Shapes', emoji: '🎨', color: 'coral', ready: true },
  { id: 'gk', title: 'GK', emoji: '🌍', color: 'sky', ready: true },
  { id: 'rewards', title: 'My Rewards', emoji: '🏆', color: 'sun', ready: true },
  { id: 'parent', title: 'Parent Area', emoji: '👨\u200d👩\u200d👦', color: 'grape', ready: true }
]

export async function fetchHomeCards(): Promise<HomeCard[]> {
  return HOME_CARDS
}

export interface WritingSubjectCard {
  id: 'english' | 'hindi' | 'numbers'
  title: string
  emoji: string
  color: 'sun' | 'sky' | 'coral' | 'leaf' | 'grape'
  ready: boolean
}

const WRITING_SUBJECTS: WritingSubjectCard[] = [
  { id: 'english', title: 'English A-Z', emoji: '🔤', color: 'sky', ready: true },
  { id: 'hindi', title: 'Swar & Vyanjan', emoji: '🅰️', color: 'sun', ready: false },
  { id: 'numbers', title: 'Numbers', emoji: '🔢', color: 'leaf', ready: true }
]

export async function fetchWritingSubjects(): Promise<WritingSubjectCard[]> {
  return WRITING_SUBJECTS
}
