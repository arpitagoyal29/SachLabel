import { useState } from 'react'

function ProductForm({ onSubmit }) {
  const [ingredientsText, setIngredientsText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const ingredients = ingredientsText
      .split(/[,\n]+/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (ingredients.length === 0) return

    onSubmit({ ingredients })
  }

    return (
    <form onSubmit={handleSubmit} className="py-2 pb-10">
      <p className="mt-7 mb-1.5 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
        Step 1
      </p>
      <h1 className="mb-5 text-xl font-bold tracking-tight">What's in your product?</h1>
      <textarea
        autoFocus
        value={ingredientsText}
        onChange={(e) => setIngredientsText(e.target.value)}
        placeholder="Paste the ingredient list — comma-separated or one per line"
        rows={6}
        className="w-full rounded-md border p-3.5 text-[13.5px] leading-relaxed"
        style={{ background: 'var(--paper-sunk)', borderColor: 'var(--line)', color: 'var(--ink)' }}
      />
      <p className="mt-2 mb-5 font-mono text-[10.5px]" style={{ color: 'var(--ink-faint)' }}>
        Comma-separated or one per line — paste the label as-is
      </p>
      <button
        type="submit"
        className="rounded-md px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wide"
        style={{ background: 'var(--ink)', color: 'var(--paper)' }}
      >
        Run verification
      </button>
    </form>
  )
}

export default ProductForm
