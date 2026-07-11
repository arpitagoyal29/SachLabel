import { useState, useEffect } from 'react'

function buildLines(payload) {
  const hasUrl = Boolean(payload?.sourceUrl)
  const hasWebsiteIngredients = Boolean(payload?.websiteIngredients?.length)
  const hasMarketingText = Boolean(payload?.marketingText)

  return [
    { text: 'Initializing verification engine', delay: 0.1, cursor: true },
    { text: 'Checking ingredient safety...', delay: 0.5 },
    { text: 'Checking dangerous combinations...', delay: 0.95 },
    hasWebsiteIngredients
      ? { text: 'Checking source mismatch...', delay: 1.35 }
      : { text: 'Checking source mismatch... skipped — no website ingredients provided', delay: 1.35, dim: true },
    hasUrl
      ? { text: 'Checking seller verification...', delay: 1.7 }
      : { text: 'Checking seller verification... skipped — no URL provided', delay: 1.7, dim: true },
    hasMarketingText
      ? { text: 'Checking marketing claims...', delay: 2.05 }
      : { text: 'Checking marketing claims... skipped — no marketing text provided', delay: 2.05, dim: true },
    { text: 'Checking ingredient disclosure...', delay: 2.5 },
    { text: 'Compiling verdict...', delay: 2.95 },
  ]
}

const FUN_FACTS = [
  'Lipstick used to contain crushed fish scales for shimmer — literally ground fish skin.',
  'Carmine (E120), a common red pigment in cosmetics, comes from crushed cochineal insects — same trick ancient Egypt used.',
  "The FDA doesn't require cosmetic companies to prove a product is safe before it goes on sale — that's on the brand, not a regulator.",
  "Waterproof mascara often uses waxes borrowed from car-polish formulas — that's why it survives everything except makeup remover.",
  '"Fragrance" on a label can legally hide dozens of individual chemicals without listing a single one.',
]

function FunFact() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % FUN_FACTS.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mt-16 max-w-md text-center">
      <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
        While you wait
      </p>
      <p key={index} className="animate-term-in text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {FUN_FACTS[index]}
      </p>
    </div>
  )
}

function LoadingSkeleton({ payload }) {
  const lines = buildLines(payload)

  return (
    <div className="flex flex-col items-center py-10" role="status" aria-label="Running verification">
      <div className="w-full rounded-md p-5 font-mono text-[12.5px] leading-loose" style={{ background: 'var(--term-bg)' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            className="animate-term-in"
            style={{
              color: line.dim ? 'var(--term-text-dim)' : 'var(--term-text)',
              animationDelay: `${line.delay}s`,
            }}
          >
            &gt; {line.text}
            {line.cursor && (
              <span
                className="animate-blink ml-0.5 inline-block h-3.5 w-1.5 align-middle"
                style={{ background: 'var(--term-text)' }}
              />
            )}
          </div>
        ))}
      </div>
      <FunFact />
    </div>
  )
}

export default LoadingSkeleton
