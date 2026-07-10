export async function verifyProduct(payload) {
  const res = await fetch('/api/verify-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`verify-product failed: ${res.status}`)
  }

  return res.json()
}

export async function extractIngredients(imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)

  const res = await fetch('/api/extract-ingredients', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`extract-ingredients failed: ${res.status}`)
  }

  const data = await res.json()
  return data.ingredients
}

