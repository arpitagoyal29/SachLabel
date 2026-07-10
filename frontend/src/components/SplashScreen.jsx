import { useEffect } from 'react'

const BOOT_LINES = [
  '> loading verification engine...',
  '> connecting to reference database...',
]

function SplashScreen({ onDone }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = setTimeout(onDone, reduced ? 50 : 1300)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5"
      style={{ background: 'var(--term-bg)' }}
    >
      <div className="font-mono text-3xl font-bold text-white">SachLabel</div>
      <div
        className="-mt-3 font-mono text-[10.5px] uppercase tracking-wider"
        style={{ color: 'var(--term-text-dim)' }}
      >
        Screening ingredients against regulatory data
      </div>
      <div className="w-64 text-left font-mono text-xs" style={{ color: 'var(--term-text)' }}>
        {BOOT_LINES.map((line, i) => (
          <div
            key={line}
            className="animate-term-in mb-1.5"
            style={{ animationDelay: `${0.15 + i * 0.35}s` }}
          >
            {line}
          </div>
        ))}
      </div>
      <div className="h-[5px] w-64 overflow-hidden rounded-full" style={{ background: 'var(--term-line)' }}>
        <div
          className="animate-splash-slide h-full w-2/5 rounded-full"
          style={{ background: 'repeating-linear-gradient(135deg, var(--term-text) 0 6px, transparent 6px 12px)' }}
        />
      </div>
    </div>
  )
}

export default SplashScreen
