import { useState } from 'react'
import { LAYER_ORDER, LAYER_LABELS, LAYER_DESCRIPTIONS, FINDING_SEVERITY } from '../lib/severity'

const STATUS_STYLE = {
  flagged: { text: 'Flagged', color: 'var(--flagged)' },
  clear: { text: 'Clear', color: 'var(--clear)' },
  unchecked: { text: 'Not checked', color: 'var(--ink-faint)' },
}

function layerStatus(layerNum, flaggedLayers, ranLayers) {
  if (flaggedLayers.has(layerNum)) return 'flagged'
  if (ranLayers.has(layerNum)) return 'clear'
  return 'unchecked'
}

function LayerTable({ flaggedLayers, ranLayers, findings }) {
  const [activeLayer, setActiveLayer] = useState(null)

  const activeFindings = activeLayer ? findings.filter((f) => f.layer === activeLayer) : []
  const activeStatus = activeLayer ? layerStatus(activeLayer, flaggedLayers, ranLayers) : null

  return (
    <section className="mt-9 border-b pb-5" style={{ borderColor: 'var(--line)' }}>
      <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
        Checks — click any to see what it looks for
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {LAYER_ORDER.map((layerNum) => {
          const status = layerStatus(layerNum, flaggedLayers, ranLayers)
          const style = STATUS_STYLE[status]
          const isActive = activeLayer === layerNum
          return (
            <button
              key={layerNum}
              type="button"
              onClick={() => setActiveLayer(isActive ? null : layerNum)}
              className={`rounded-md border px-3 py-2.5 text-left transition-colors hover:border-[var(--accent)] ${
                isActive ? 'border-[var(--accent)]' : 'border-[var(--line)]'
              }`}
              style={{ background: 'var(--paper-sunk)' }}
            >
              <p className="truncate text-[13px] font-medium">{LAYER_LABELS[layerNum]}</p>
              <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ color: style.color }}>
                {style.text}
              </p>
            </button>
          )
        })}
      </div>

      {activeLayer && (
        <div className="mt-3 rounded-md border p-4" style={{ borderColor: 'var(--line)', background: 'var(--paper-sunk)' }}>
          <p className="mb-1 text-[13px] font-semibold">{LAYER_LABELS[activeLayer]}</p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {LAYER_DESCRIPTIONS[activeLayer]}
          </p>

          {activeStatus === 'unchecked' && (
            <p className="mt-3 font-mono text-[11px]" style={{ color: 'var(--ink-faint)' }}>
              Skipped for this check — the input this layer needs wasn't provided.
            </p>
          )}
          {activeStatus === 'clear' && activeFindings.length === 0 && (
            <p className="mt-3 font-mono text-[11px]" style={{ color: 'var(--clear)' }}>
              Checked — no issues found.
            </p>
          )}
          {activeFindings.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {activeFindings.map((f, i) => (
                <div key={i} className="border-l-2 pl-3" style={{ borderColor: FINDING_SEVERITY[f.severity].textVar }}>
                  <p className="text-[12.5px] font-medium leading-snug">{f.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default LayerTable
