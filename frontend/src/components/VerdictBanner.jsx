import { VERDICT_STYLES, FRAUD_SIGNAL_TEXT } from '../lib/severity'

function VerdictBanner({ verdict, findingCount, isPossibleFraud }) {
  const style = VERDICT_STYLES[verdict]
  const summary =
    verdict === 'SAFE'
      ? 'No violations detected in the ingredients provided.'
      : `${findingCount} potential issue${findingCount === 1 ? '' : 's'} found — see details below.`

      return (
    <div className={`${style.bg} rounded-2xl px-6 py-10 text-center`}>
      {isPossibleFraud && (
        <p className={`${FRAUD_SIGNAL_TEXT} mb-2 text-sm font-semibold`}>
          Possible source mismatch detected
        </p>
      )}
      <h2 className={`${style.text} text-4xl font-bold`}>{style.label}</h2>
      <p className="mt-3 text-base text-[#333333]">{summary}</p>
    </div>
  )
  
}

export default VerdictBanner
