import { LAYER_ORDER, LAYER_LABELS } from '../lib/severity'

const LAYER_DESCRIPTIONS = {
  1: 'Checks ingredients against CDSCO and EU regulatory blocklists — banned, Schedule H, and restricted substances.',
  2: 'Flags ingredient pairs known to cause irritation, instability, or barrier damage when combined.',
  3: 'Compares the label against other listed sources to catch ingredients hidden or added inconsistently.',
  4: 'Flags products sold through unverified channels with no seller accountability.',
  5: 'Detects illegal drug or medical claims in product marketing copy.',
  6: 'Flags vague terms like "Fragrance" that legally hide undisclosed ingredients.',
}

function AboutSection() {
  return (
    <section className="border-t px-5 py-14" style={{ borderColor: 'var(--line)', background: 'var(--paper-sunk)' }}>
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
          About
        </p>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight">Why SachLabel exists</h2>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          My mother used a face cream containing Retinoic Acid — a Schedule H prescription drug in
          India — sold legally-looking but illegally over the counter by an influencer-run brand.
          There was no easy way for her, or anyone, to check what was actually safe to use.
          SachLabel exists to close that gap.
        </p>

        <p className="mt-10 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>
          What it checks
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LAYER_ORDER.map((layerNum) => (
            <div key={layerNum}>
              <p className="text-[13.5px] font-semibold">{LAYER_LABELS[layerNum]}</p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {LAYER_DESCRIPTIONS[layerNum]}
              </p>
            </div>
          ))}
        </div>

        <p
          className="mt-10 max-w-2xl border-t pt-4 font-mono text-[10.5px] leading-relaxed"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-faint)' }}
        >
          SachLabel screens declared ingredients against known regulatory data. It is not a lab
          test and cannot detect undeclared ingredients — always consult a dermatologist or
          pharmacist for medical concerns.
        </p>
      </div>
    </section>
  )
}

export default AboutSection
