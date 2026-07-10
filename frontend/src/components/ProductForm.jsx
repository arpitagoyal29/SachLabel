import { useState } from 'react'

function ProductForm({ onSubmit }) {
  const [ingredientsText, setIngredientsText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const ingredients = ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (ingredients.length === 0) return

    onSubmit({ ingredients })
  }

    return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center"
    >
      <p className="text-2xl font-bold text-[#1F3A5F]">
        Know what's really in it, before you buy.
      </p>
      <textarea
        autoFocus
        value={ingredientsText}
        onChange={(e) => setIngredientsText(e.target.value)}
        placeholder="Paste the ingredient list, one per line"
        rows={6}
        className="mt-6 w-full rounded-2xl border border-gray-300 p-4 text-base"
      />
      <button
        type="submit"
        className="mt-4 rounded-full bg-[#1F3A5F] px-8 py-3 font-semibold text-white"
      >
        Check ingredients
      </button>
    </form>
  )
}

export default ProductForm
