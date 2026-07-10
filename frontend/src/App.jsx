import { useState } from 'react'
import { verifyProduct } from './lib/api'
import SplashScreen from './components/SplashScreen'
import ProductForm from './components/ProductForm'
import LoadingSkeleton from './components/LoadingSkeleton'
import ErrorState from './components/ErrorState'
import VerdictResults from './components/VerdictResults'
import AboutSection from './components/AboutSection'

function App() {
  const [status, setStatus] = useState('splash')
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
  function handleReset() {
  setStatus('idle')
}

  if (status === 'splash') {
    return <SplashScreen onDone={() => setStatus('idle')} />
  }

    return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <header
        className="flex items-center justify-between border-b px-5 py-5"
        style={{ borderColor: 'var(--line)' }}
      >
        <button type="button" onClick={handleReset} className="cursor-pointer text-sm font-bold">
         SachLabel
        </button>
        <span className="font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
          ingredient check
        </span>
      </header>
      <main className="mx-auto w-full max-w-6xl min-h-screen flex-1 px-5">
        {status === 'idle' && <ProductForm onSubmit={handleSubmit} />}
        {status === 'loading' && <LoadingSkeleton payload={lastPayload} />}
        {status === 'error' && <ErrorState onRetry={() => handleSubmit(lastPayload)} />}
        {status === 'success' && (
          <VerdictResults result={result} onReset={handleReset} />
        )}
      </main>
      <AboutSection />
    </div>
  )

}

export default App
