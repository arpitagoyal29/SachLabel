function ModeSelect({ onSelect }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
        Before we start
      </p>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Do you already have the product?</h1>
      <p className="mb-10 max-w-md text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Choose how you want to check — both run the same six-layer verification underneath.
      </p>

      <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => onSelect('owned')}
          className="group flex-1 rounded-lg border border-[var(--line)] p-6 text-left transition-colors hover:border-[var(--accent)]"
          style={{ background: 'var(--paper-sunk)' }}
        >
          <span className="mb-3 block font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
            I have the product
          </span>
          <span className="block text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Check the physical label — type or photograph it — and optionally compare it against what the seller lists online.
          </span>
          <span className="mt-4 block h-px w-8 transition-all group-hover:w-16" style={{ background: 'var(--accent)' }} />
        </button>

        <button
          type="button"
          onClick={() => onSelect('checking')}
          className="group flex-1 rounded-lg border border-[var(--line)] p-6 text-left transition-colors hover:border-[var(--accent)]"
          style={{ background: 'var(--paper-sunk)' }}
        >
          <span className="mb-3 block font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
            Just checking ingredients
          </span>
          <span className="block text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Paste an ingredient list you found anywhere — check it for known dangers and dangerous combinations. No product needed.
          </span>
          <span className="mt-4 block h-px w-8 transition-all group-hover:w-16" style={{ background: 'var(--accent)' }} />
        </button>
      </div>
    </div>
  )
}

export default ModeSelect
