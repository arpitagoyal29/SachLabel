import { useState } from 'react'
import { extractIngredients } from '../lib/api'

function ProductForm({ onSubmit, mode }) {
  const [ingredientsText, setIngredientsText] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [websiteIngredientsText, setWebsiteIngredientsText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState(null)

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

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    setIsExtracting(true)
    setExtractError(null)
    try {
      const ingredients = await extractIngredients(file)
      if (ingredients.length === 0) {
        setExtractError("Couldn't read this one — try again, or type the ingredients in below")
      } else {
        setIngredientsText(ingredients.join('\n'))
      }
    } catch (err) {
      setExtractError(err.message || 'Could not read the photo — try again or type the ingredients manually')
    } finally {
      setIsExtracting(false)
      e.target.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="py-2 pb-10">
      {mode === 'owned' && (
        <p className="mt-7 mb-1.5 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
          Step 1
        </p>
      )}
      <h1 className={`mb-5 text-xl font-bold tracking-tight ${mode === 'checking' ? 'mt-7' : ''}`}>
        {mode === 'owned' ? "What's in your product?" : 'What ingredients do you want to check?'}
      </h1>
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
        Comma-separated or one per line
      </p>

      {mode === 'owned' && (
        <>
          <input
            id="photoUpload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isExtracting}
            className="hidden"
          />
          <label
            htmlFor="photoUpload"
            className="mb-8 inline-block cursor-pointer rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-wide"
            style={{ borderColor: 'var(--line)', color: 'var(--accent)' }}
          >
            {isExtracting ? 'Reading label...' : 'Upload a photo instead'}
          </label>
          {extractError && (
            <p className="mt-1.5 mb-8 font-mono text-[10.5px]" style={{ color: 'var(--flagged)' }}>
              {extractError}
            </p>
          )}

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
        </>
      )}

        <button
        type="submit"
        className="rounded-md bg-[var(--ink)] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[var(--accent)]"
        style={{ color: 'var(--paper)' }}
      >
        Run verification
      </button>
    </form>
  )
}

export default ProductForm
