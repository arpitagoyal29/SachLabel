import { useState } from 'react'

function ProductForm({ onSubmit }) {
  const [ingredientsText, setIngredientsText] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [websiteIngredientsText, setWebsiteIngredientsText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const ingredients = ingredientsText
      .split(/[,\n]+/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (ingredients.length === 0) return

    const websiteIngredients = websiteIngredientsText
      .split(/[,\n]+/)
      .map((line) => line.trim())
      .filter(Boolean)

    onSubmit({
      ingredients,
      sourceUrl: sourceUrl.trim() || undefined,
      websiteIngredients: websiteIngredients.length > 0 ? websiteIngredients : undefined,
    })
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
      <p className="mt-2 mb-8 font-mono text-[10.5px]" style={{ color: 'var(--ink-faint)' }}>
        Comma-separated or one per line — paste the label as-is
      </p>

      <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
        Step 2 — optional
      </p>
      <h2 className="mb-4 text-base font-semibold tracking-tight">Check against the product's listing</h2>

      <label htmlFor="sourceUrl" className="mb-1 block text-[12.5px] font-medium">
        Product URL
      </label>
      <input
        id="sourceUrl"
        type="url"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
        placeholder="https://www.example.com/product/..."
        className="w-full rounded-md border p-3 text-[13.5px]"
        style={{ background: 'var(--paper-sunk)', borderColor: 'var(--line)', color: 'var(--ink)' }}
      />
      <p className="mt-1.5 mb-4 font-mono text-[10.5px]" style={{ color: 'var(--ink-faint)' }}>
        Used to check the seller's verification status — not scraped automatically
      </p>

      <label htmlFor="websiteIngredients" className="mb-1 block text-[12.5px] font-medium">
        Ingredients listed on that page
      </label>
      <textarea
        id="websiteIngredients"
        value={websiteIngredientsText}
        onChange={(e) => setWebsiteIngredientsText(e.target.value)}
        placeholder="Paste the ingredient list from the product page, if different"
        rows={3}
        className="w-full rounded-md border p-3.5 text-[13.5px] leading-relaxed"
        style={{ background: 'var(--paper-sunk)', borderColor: 'var(--line)', color: 'var(--ink)' }}
      />
      <p className="mt-1.5 mb-6 font-mono text-[10.5px]" style={{ color: 'var(--ink-faint)' }}>
        Used to catch ingredients hidden or added between the label and the listing
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
