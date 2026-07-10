import { useState } from 'react'
import { verifyProduct } from './lib/api'
import ProductForm from './components/ProductForm'
import LoadingSkeleton from './components/LoadingSkeleton'
import ErrorState from './components/ErrorState'
import VerdictResults from './components/VerdictResults'

function App() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [lastPayload, setLastPayload] = useState(null)

  async function handleSubmit(payload) {
    setLastPayload(payload)
    setStatus('loading')
    try {
      const data = await verifyProduct(payload)
      setResult(data)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

    return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
      <header className="px-6 py-4">
        <h1 className="text-lg font-bold text-[#1F3A5F]">SachLabel</h1>
      </header>
      <main className="flex flex-1 items-center justify-center">
        {status === 'idle' && <ProductForm onSubmit={handleSubmit} />}
        {status === 'loading' && <LoadingSkeleton />}
        {status === 'error' && (
          <ErrorState onRetry={() => handleSubmit(lastPayload)} />
        )}
        {status === 'success' && <VerdictResults result={result} />}
      </main>
    </div>
  )

}

export default App
