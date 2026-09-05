import { useEffect, useState } from 'react'
import {
  listLessons,
  saveLesson,
  deleteLesson,
  listQuizzes,
  createQuiz,
  listQuizQuestions,
  saveQuizQuestion,
  deleteQuizQuestion,
  listWritingTemplates,
  saveWritingTemplate,
  deleteWritingTemplate,
  listTracingPaths,
  saveTracingPath,
  deleteTracingPath,
  listGames,
  saveGame,
  deleteGame,
  type AdminLesson,
  type AdminQuizQuestion,
  type AdminWritingTemplate,
  type AdminTracingPath,
  type AdminGame
} from '../../services/adminDataService'

const SUBJECTS = ['english', 'hindi', 'maths', 'gk', 'colors-shapes']

export default function AdminContent() {
  const [section, setSection] = useState<'lessons' | 'quizzes' | 'writing' | 'games'>('lessons')
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSection('lessons')}
          className={`rounded-full px-4 py-1.5 text-sm font-bold ${section === 'lessons' ? 'bg-coral text-white' : 'bg-white text-ink'}`}
        >
          Lessons
        </button>
        <button
          onClick={() => setSection('quizzes')}
          className={`rounded-full px-4 py-1.5 text-sm font-bold ${section === 'quizzes' ? 'bg-coral text-white' : 'bg-white text-ink'}`}
        >
          Quiz Questions
        </button>
        <button
          onClick={() => setSection('writing')}
          className={`rounded-full px-4 py-1.5 text-sm font-bold ${section === 'writing' ? 'bg-coral text-white' : 'bg-white text-ink'}`}
        >
          Writing Templates
        </button>
        <button
          onClick={() => setSection('games')}
          className={`rounded-full px-4 py-1.5 text-sm font-bold ${section === 'games' ? 'bg-coral text-white' : 'bg-white text-ink'}`}
        >
          Games
        </button>
      </div>
      {section === 'lessons' && <LessonsManager />}
      {section === 'quizzes' && <QuizManager />}
      {section === 'writing' && <WritingTemplatesManager />}
      {section === 'games' && <GamesManager />}
      <p className="mt-6 text-center text-xs text-ink/40">
        Note: these forms save real, RLS-protected rows in Supabase. The child-facing screens still read the built-in
        English/Hindi/Maths/GK content and games (src/data/*.ts) rather than these tables yet - wiring that read is the next
        step so new content shows up live. See the README for details.
      </p>
    </div>
  )
}

function LessonsManager() {
  const [lessons, setLessons] = useState<AdminLesson[]>([])
  const [form, setForm] = useState<Partial<AdminLesson>>({ title: '', subject_id: 'english', is_published: false, is_premium: false })

  const refresh = () => listLessons().then(setLessons)
  useEffect(() => {
    refresh()
  }, [])

  const submit = async () => {
    if (!form.title) return
    await saveLesson(form as AdminLesson & { title: string })
    setForm({ title: '', subject_id: 'english', is_published: false, is_premium: false })
    refresh()
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-white p-3">
        <input
          placeholder="Lesson title"
          value={form.title ?? ''}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-xl bg-chalk px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-xl bg-chalk px-3 py-2"
        />
        <div className="flex gap-2">
          <select
            value={form.subject_id ?? 'english'}
            onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
            className="flex-1 rounded-xl bg-chalk px-3 py-2"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={!!form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} />
            Premium
          </label>
        </div>
        <button onClick={submit} className="rounded-xl bg-leaf py-2 font-display font-bold text-white">
          {form.id ? 'Update Lesson' : 'Add Lesson'}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {lessons.map((l) => (
          <div key={l.id} className="flex items-center justify-between rounded-2xl bg-white p-3">
            <div>
              <p className="font-display font-bold text-ink">{l.title}</p>
              <p className="text-xs text-ink/40">
                {l.subject_id} · {l.is_published ? 'Published' : 'Draft'} {l.is_premium && '· Premium'}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(l)} className="text-sm font-bold text-sky">
                Edit
              </button>
              <button
                onClick={async () => {
                  await deleteLesson(l.id)
                  refresh()
                }}
                className="text-sm font-bold text-coral"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuizManager() {
  const [quizzes, setQuizzes] = useState<{ id: string; title: string }[]>([])
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>([])
  const [newQuizTitle, setNewQuizTitle] = useState('')
  const [form, setForm] = useState<{ prompt: string; a: string; b: string; c: string; correct: 'a' | 'b' | 'c' }>({
    prompt: '',
    a: '',
    b: '',
    c: '',
    correct: 'a'
  })

  useEffect(() => {
    listQuizzes().then(setQuizzes)
  }, [])

  useEffect(() => {
    if (activeQuiz) listQuizQuestions(activeQuiz).then(setQuestions)
  }, [activeQuiz])

  const addQuiz = async () => {
    if (!newQuizTitle.trim()) return
    const q = await createQuiz(newQuizTitle.trim())
    if (q) {
      setQuizzes((prev) => [...prev, { id: q.id, title: newQuizTitle }])
      setActiveQuiz(q.id)
      setNewQuizTitle('')
    }
  }

  const addQuestion = async () => {
    if (!activeQuiz || !form.prompt) return
    await saveQuizQuestion({
      quiz_id: activeQuiz,
      prompt: form.prompt,
      options: [
        { id: 'a', label: form.a },
        { id: 'b', label: form.b },
        { id: 'c', label: form.c }
      ],
      correct_option_id: form.correct
    })
    setForm({ prompt: '', a: '', b: '', c: '', correct: 'a' })
    listQuizQuestions(activeQuiz).then(setQuestions)
  }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          placeholder="New quiz title"
          value={newQuizTitle}
          onChange={(e) => setNewQuizTitle(e.target.value)}
          className="flex-1 rounded-2xl bg-white px-3 py-2 shadow-inner"
        />
        <button onClick={addQuiz} className="rounded-2xl bg-leaf px-4 py-2 font-display font-bold text-white">
          Add
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {quizzes.map((q) => (
          <button
            key={q.id}
            onClick={() => setActiveQuiz(q.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${activeQuiz === q.id ? 'bg-coral text-white' : 'bg-white text-ink'}`}
          >
            {q.title}
          </button>
        ))}
      </div>

      {activeQuiz && (
        <>
          <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-white p-3">
            <input
              placeholder="Question prompt"
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              className="rounded-xl bg-chalk px-3 py-2"
            />
            <input
              placeholder="Option A"
              value={form.a}
              onChange={(e) => setForm({ ...form, a: e.target.value })}
              className="rounded-xl bg-chalk px-3 py-2"
            />
            <input
              placeholder="Option B"
              value={form.b}
              onChange={(e) => setForm({ ...form, b: e.target.value })}
              className="rounded-xl bg-chalk px-3 py-2"
            />
            <input
              placeholder="Option C"
              value={form.c}
              onChange={(e) => setForm({ ...form, c: e.target.value })}
              className="rounded-xl bg-chalk px-3 py-2"
            />
            <select
              value={form.correct}
              onChange={(e) => setForm({ ...form, correct: e.target.value as 'a' | 'b' | 'c' })}
              className="rounded-xl bg-chalk px-3 py-2"
            >
              <option value="a">Correct: A</option>
              <option value="b">Correct: B</option>
              <option value="c">Correct: C</option>
            </select>
            <button onClick={addQuestion} className="rounded-xl bg-leaf py-2 font-display font-bold text-white">
              Add Question
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {questions.map((q) => (
              <div key={q.id} className="flex items-center justify-between rounded-2xl bg-white p-3">
                <p className="font-semibold text-ink">{q.prompt}</p>
                <button
                  onClick={async () => {
                    await deleteQuizQuestion(q.id)
                    listQuizQuestions(activeQuiz).then(setQuestions)
                  }}
                  className="text-sm font-bold text-coral"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function WritingTemplatesManager() {
  const [templates, setTemplates] = useState<AdminWritingTemplate[]>([])
  const [form, setForm] = useState<AdminWritingTemplate>({ id: '', subject: 'english', label: '', difficulty: 1, is_published: true })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [paths, setPaths] = useState<AdminTracingPath[]>([])
  const [pathForm, setPathForm] = useState({ path_d: '', start_x: 100, start_y: 100 })

  const refresh = () => listWritingTemplates().then(setTemplates)
  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (activeId) listTracingPaths(activeId).then(setPaths)
  }, [activeId])

  const submit = async () => {
    if (!form.id || !form.label) return
    await saveWritingTemplate(form)
    setForm({ id: '', subject: 'english', label: '', difficulty: 1, is_published: true })
    refresh()
  }

  const addPath = async () => {
    if (!activeId || !pathForm.path_d) return
    await saveTracingPath({
      template_id: activeId,
      stroke_order: paths.length,
      path_d: pathForm.path_d,
      start_x: pathForm.start_x,
      start_y: pathForm.start_y
    })
    setPathForm({ path_d: '', start_x: 100, start_y: 100 })
    listTracingPaths(activeId).then(setPaths)
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-white p-3">
        <p className="text-xs font-bold text-ink/40">New / Edit Template</p>
        <div className="flex gap-2">
          <input
            placeholder="ID (e.g. D, 10, अ)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-24 rounded-xl bg-chalk px-3 py-2"
          />
          <input
            placeholder="Label shown to child"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="flex-1 rounded-xl bg-chalk px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value as AdminWritingTemplate['subject'] })}
            className="flex-1 rounded-xl bg-chalk px-3 py-2"
          >
            <option value="english">english</option>
            <option value="hindi">hindi</option>
            <option value="numbers">numbers</option>
          </select>
          <input
            type="number"
            min={1}
            max={5}
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) })}
            className="w-20 rounded-xl bg-chalk px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Published
        </label>
        <button onClick={submit} className="rounded-xl bg-leaf py-2 font-display font-bold text-white">
          Save Template
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {templates.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-ink">
                  {t.label} <span className="text-xs font-normal text-ink/40">({t.subject})</span>
                </p>
                <p className="text-xs text-ink/40">{t.is_published ? 'Published' : 'Draft'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setForm(t)} className="text-sm font-bold text-sky">
                  Edit
                </button>
                <button onClick={() => setActiveId(activeId === t.id ? null : t.id)} className="text-sm font-bold text-grape">
                  {activeId === t.id ? 'Hide Strokes' : 'Strokes'}
                </button>
                <button
                  onClick={async () => {
                    await deleteWritingTemplate(t.id)
                    refresh()
                  }}
                  className="text-sm font-bold text-coral"
                >
                  Delete
                </button>
              </div>
            </div>

            {activeId === t.id && (
              <div className="mt-3 border-t border-ink/10 pt-3">
                {paths.map((p) => (
                  <div key={p.id} className="mb-1 flex items-center justify-between text-xs">
                    <code className="truncate text-ink/50">
                      #{p.stroke_order} {p.path_d.slice(0, 40)}...
                    </code>
                    <button
                      onClick={async () => {
                        await deleteTracingPath(p.id)
                        listTracingPaths(t.id).then(setPaths)
                      }}
                      className="font-bold text-coral"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <textarea
                  placeholder="SVG path 'd' string, e.g. M70,240 L150,60 L230,240"
                  value={pathForm.path_d}
                  onChange={(e) => setPathForm({ ...pathForm, path_d: e.target.value })}
                  className="mt-2 w-full rounded-xl bg-chalk px-3 py-2 text-xs"
                />
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    placeholder="start x"
                    value={pathForm.start_x}
                    onChange={(e) => setPathForm({ ...pathForm, start_x: Number(e.target.value) })}
                    className="w-24 rounded-xl bg-chalk px-3 py-2 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="start y"
                    value={pathForm.start_y}
                    onChange={(e) => setPathForm({ ...pathForm, start_y: Number(e.target.value) })}
                    className="w-24 rounded-xl bg-chalk px-3 py-2 text-xs"
                  />
                  <button onClick={addPath} className="flex-1 rounded-xl bg-leaf text-xs font-display font-bold text-white">
                    Add Stroke
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-ink/40">All strokes share a 300x300 grid, same as the built-in letters.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function GamesManager() {
  const [games, setGames] = useState<AdminGame[]>([])
  const [form, setForm] = useState<AdminGame>({
    id: '',
    title: '',
    emoji: '🎮',
    engine: 'quiz',
    description: '',
    is_premium: false,
    is_published: true
  })

  const refresh = () => listGames().then(setGames)
  useEffect(() => {
    refresh()
  }, [])

  const submit = async () => {
    if (!form.id || !form.title) return
    await saveGame(form)
    setForm({ id: '', title: '', emoji: '🎮', engine: 'quiz', description: '', is_premium: false, is_published: true })
    refresh()
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-white p-3">
        <div className="flex gap-2">
          <input
            placeholder="ID (e.g. word-match-2)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="flex-1 rounded-xl bg-chalk px-3 py-2"
          />
          <input
            placeholder="🎮"
            value={form.emoji ?? ''}
            onChange={(e) => setForm({ ...form, emoji: e.target.value })}
            className="w-16 rounded-xl bg-chalk px-3 py-2 text-center"
          />
        </div>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-xl bg-chalk px-3 py-2"
        />
        <input
          placeholder="Description"
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-xl bg-chalk px-3 py-2"
        />
        <select
          value={form.engine}
          onChange={(e) => setForm({ ...form, engine: e.target.value })}
          className="rounded-xl bg-chalk px-3 py-2"
        >
          <option value="quiz">quiz</option>
          <option value="match">match</option>
          <option value="memory">memory</option>
          <option value="missing-number">missing-number</option>
          <option value="counting">counting</option>
        </select>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Published
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} />
            Premium
          </label>
        </div>
        <button onClick={submit} className="rounded-xl bg-leaf py-2 font-display font-bold text-white">
          Save Game
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {games.map((g) => (
          <div key={g.id} className="flex items-center justify-between rounded-2xl bg-white p-3">
            <div>
              <p className="font-display font-bold text-ink">
                {g.emoji} {g.title}
              </p>
              <p className="text-xs text-ink/40">
                {g.engine} · {g.is_published ? 'Published' : 'Draft'} {g.is_premium && '· Premium'}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(g)} className="text-sm font-bold text-sky">
                Edit
              </button>
              <button
                onClick={async () => {
                  await deleteGame(g.id)
                  refresh()
                }}
                className="text-sm font-bold text-coral"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-ink/40">
        Note: the child-facing Games hub currently reads from the built-in game list (src/features/games/GamesHub.tsx). Games saved
        here are stored and RLS-protected, ready for that screen to read from Supabase instead in a later pass.
      </p>
    </div>
  )
}
