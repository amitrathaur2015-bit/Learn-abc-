interface Bar {
  label: string
  value: number
  color: string
}

/** Deliberately not a charting library - this is 3 bars, it doesn't need one.
 *  Keeps the admin bundle light. */
export default function MiniBarChart({ bars, title }: { bars: Bar[]; title: string }) {
  const max = Math.max(1, ...bars.map((b) => b.value))
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="mb-3 font-display text-sm font-extrabold text-ink">{title}</p>
      <div className="flex items-end gap-4" style={{ height: 100 }}>
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-bold text-ink/60">{b.value}</span>
            <div
              className="w-full rounded-t-lg transition-all"
              style={{ height: `${Math.max(4, (b.value / max) * 70)}px`, backgroundColor: b.color }}
            />
            <span className="text-[10px] font-semibold text-ink/40">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
