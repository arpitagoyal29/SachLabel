import { VERDICT_META } from '../lib/severity'

function VerdictBanner({ verdict, findingCount, flaggedLayerCount, totalLayerCount }) {
  const meta = VERDICT_META[verdict]

  return (
    <div className="animate-rise-in rounded-md px-6 py-6" style={{ background: 'var(--term-bg)' }}>
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--term-text-dim)' }}>
        Verdict
      </p>
      <p className="mt-2.5 font-mono text-3xl font-bold tracking-tight" style={{ color: meta.colorVar }}>
        {meta.label.toUpperCase()}
      </p>
      <p className="mt-2.5 font-mono text-xs" style={{ color: 'var(--term-text)' }}>
        {flaggedLayerCount} / {totalLayerCount} checks flagged &middot; {findingCount} finding{findingCount === 1 ? '' : 's'} total
      </p>
      <p
        className="mt-3.5 border-t pt-3 font-mono text-[10px]"
        style={{ borderColor: 'var(--term-line)', color: 'var(--term-text-dim)' }}
      >
        Screens declared ingredients against known regulatory data — not a lab test
      </p>
    </div>
  )
}

export default VerdictBanner
