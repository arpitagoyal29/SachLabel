import VerdictBanner from './VerdictBanner'
import LayerTable from './LayerTable'
import FindingCard from './FindingCard'
import CombinationGraph from './CombinationGraph'
import { FINDING_SEVERITY } from '../lib/severity'

function VerdictResults({ result, onReset }) {
  const sortedFindings = [...result.findings].sort(
    (a, b) => FINDING_SEVERITY[b.severity].rank - FINDING_SEVERITY[a.severity].rank
  )

  const flaggedLayers = new Set(result.findings.map((f) => f.layer))
  const layersRan = new Set(result.checkedLayers)
  const comboFindings = sortedFindings.filter((f) => f.layer === 2 && f.ingredientA && f.ingredientB)

  return (
  <div className="pb-16">
      <VerdictBanner
        verdict={result.verdict}
        findingCount={result.findingCount}
        flaggedLayerCount={flaggedLayers.size}
        totalLayerCount={layersRan.size}
      />

      {comboFindings.length > 0 && (
        <div className="mt-6">
          <p className="mb-1 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
            Dangerous combination{comboFindings.length > 1 ? 's' : ''} detected
          </p>
          <CombinationGraph findings={comboFindings} />
        </div>
      )}

      <LayerTable flaggedLayers={flaggedLayers} ranLayers={layersRan} />

      {sortedFindings.length > 0 && (
        <>
          <p className="mt-5 mb-1 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
            Findings — sorted by severity
          </p>
         <div className="flex flex-wrap gap-3">
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
