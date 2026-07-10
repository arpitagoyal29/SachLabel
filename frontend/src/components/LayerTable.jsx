import { LAYER_ORDER, LAYER_LABELS } from '../lib/severity'

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

function LayerTable({ flaggedLayers, ranLayers }) {
  return (
    <section className="mt-9 border-b pb-5" style={{ borderColor: 'var(--line)' }}>
      <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
        Checks
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {LAYER_ORDER.map((layerNum) => {
          const status = layerStatus(layerNum, flaggedLayers, ranLayers)
          const style = STATUS_STYLE[status]
          return (
            <div
              key={layerNum}
              className="rounded-md border px-3 py-2.5"
              style={{ borderColor: 'var(--line)', background: 'var(--paper-sunk)' }}
            >
              <p className="truncate text-[13px] font-medium">{LAYER_LABELS[layerNum]}</p>
              <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ color: style.color }}>
                {style.text}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default LayerTable
