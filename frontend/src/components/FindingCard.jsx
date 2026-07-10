import { FINDING_SEVERITY, LAYER_LABELS } from '../lib/severity'

function FindingCard({ finding, index }) {
  const style = FINDING_SEVERITY[finding.severity]

  return (
    <div
      className="animate-rise-in grid grid-cols-[56px_1fr] gap-3 rounded-md border p-3.5"
      style={{ animationDelay: `${0.15 + index * 0.1}s`, borderColor: 'var(--line)' }}
    >
      <span className="pt-px font-mono text-[10px] font-bold uppercase tracking-wide" style={{ color: style.textVar }}>
        {style.label}
      </span>
      <div className="min-w-0">
        <span className="text-[13.5px] font-semibold leading-snug">{finding.detail}</span>{' '}
        <span className="font-mono text-[10px] uppercase" style={{ color: 'var(--ink-faint)' }}>
          · {LAYER_LABELS[finding.layer]}
        </span>
        {finding.explanation && finding.explanation !== finding.detail && (
          <p className="mt-0.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {finding.explanation}
          </p>
        )}
      </div>
    </div>
  )
}

export default FindingCard
