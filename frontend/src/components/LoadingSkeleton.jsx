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

function LoadingSkeleton({ payload }) {
  const lines = buildLines(payload)

 return (
    <div className="py-10" role="status" aria-label="Running verification">
      <div className="rounded-md p-5 font-mono text-[12.5px] leading-loose" style={{ background: 'var(--term-bg)' }}>
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
    </div>
  )
}

export default LoadingSkeleton
