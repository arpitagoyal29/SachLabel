import VerdictBanner from './VerdictBanner'

function VerdictResults({ result }) {
  const isPossibleFraud = result.findings.some((f) => f.layer === 3)

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <VerdictBanner
        verdict={result.verdict}
        findingCount={result.findingCount}
        isPossibleFraud={isPossibleFraud}
      />
    </div>
  )
}

export default VerdictResults
