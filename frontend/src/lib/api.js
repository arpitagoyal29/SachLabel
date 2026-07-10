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
