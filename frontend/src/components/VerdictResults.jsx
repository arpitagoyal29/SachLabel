import VerdictBanner from './VerdictBanner'
import LayerTable from './LayerTable'
import FindingCard from './FindingCard'
import { FINDING_SEVERITY } from '../lib/severity'

function VerdictResults({ result, onReset }) {
  const sortedFindings = [...result.findings].sort(
    (a, b) => FINDING_SEVERITY[b.severity].rank - FINDING_SEVERITY[a.severity].rank
  )

  const flaggedLayers = new Set(result.findings.map((f) => f.layer))

  return (
  <div className="pb-16">
      <VerdictBanner
        verdict={result.verdict}
        findingCount={result.findingCount}
        flaggedLayerCount={flaggedLayers.size}
        totalLayerCount={6}
      />

      <LayerTable flaggedLayers={flaggedLayers} />

      {sortedFindings.length > 0 && (
        <>
          <p className="mt-5 mb-1 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
            Findings — sorted by severity
          </p>
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedFindings.map((finding, i) => (
              <FindingCard key={`${finding.layer}-${i}`} finding={finding} index={i} />
            ))}
          </div>
        </>
      )}

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border px-4 py-2 font-mono text-[11.5px] uppercase tracking-wide"
          style={{ borderColor: 'var(--line)', color: 'var(--accent)' }}
        >
          Check another product
        </button>
      </div>
    </div>
  )
}

export default VerdictResults
