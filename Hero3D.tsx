/** A lightweight "3D-feeling" hero built with layered shapes + CSS transforms
 *  and perspective, instead of a WebGL/Three.js scene. Chosen deliberately for
 *  this first prototype so the home screen stays fast on low-end Android
 *  phones; a real React Three Fiber classroom scene can slot in later behind
 *  the same spot without touching the rest of the page. */
export default function Hero3D() {
  return (
    <div className="scene-3d relative mx-auto mt-2 h-44 w-full max-w-sm">
      <div className="scene-3d-tilt relative h-full w-full">
        {/* rainbow arc, tucked behind everything */}
        <svg
          className="absolute left-1/2 top-2 -translate-x-1/2 opacity-70"
          width="220"
          height="70"
          viewBox="0 0 220 70"
          aria-hidden="true"
        >
          <path d="M10 70 A100 100 0 0 1 210 70" fill="none" stroke="#FF8FB3" strokeWidth="7" strokeLinecap="round" />
          <path d="M24 70 A86 86 0 0 1 196 70" fill="none" stroke="#FFC93C" strokeWidth="7" strokeLinecap="round" />
          <path d="M38 70 A72 72 0 0 1 182 70" fill="none" stroke="#4EC5F1" strokeWidth="7" strokeLinecap="round" />
          <path d="M52 70 A58 58 0 0 1 168 70" fill="none" stroke="#6BCB77" strokeWidth="7" strokeLinecap="round" />
        </svg>

        {/* sun */}
        <div className="absolute right-1 top-0 text-4xl animate-floaty" aria-hidden="true">
          ☀️
        </div>

        {/* sky blobs */}
        <div className="absolute -left-2 top-10 h-16 w-16 rounded-blob bg-sky/70 animate-floaty" />
        <div
          className="absolute right-4 top-16 h-12 w-12 rounded-blob bg-sun/80 animate-floaty"
          style={{ animationDelay: '0.6s' }}
        />
        <div
          className="absolute bottom-0 left-10 h-10 w-10 rounded-blob bg-leaf/70 animate-floaty"
          style={{ animationDelay: '1.1s' }}
        />

        {/* balloons */}
        <div className="absolute left-2 bottom-2 text-3xl animate-floaty" style={{ animationDelay: '0.4s' }} aria-hidden="true">
          🎈
        </div>
        <div className="absolute right-8 bottom-8 text-2xl animate-floaty" style={{ animationDelay: '1.3s' }} aria-hidden="true">
          🎈
        </div>

        {/* mascot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-floaty text-center">
          <div className="text-6xl drop-shadow-md">✏️</div>
          <div className="mt-1 font-display text-sm font-extrabold text-ink/70">Let&apos;s learn today!</div>
        </div>

        <div
          className="absolute right-6 top-1/3 text-3xl animate-floaty"
          style={{ animationDelay: '0.3s' }}
          aria-hidden="true"
        >
          ⭐
        </div>
        <div
          className="absolute left-4 bottom-2 text-2xl animate-floaty"
          style={{ animationDelay: '0.9s' }}
          aria-hidden="true"
        >
          📚
        </div>
      </div>
    </div>
  )
}
