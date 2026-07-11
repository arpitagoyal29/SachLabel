export const FINDING_SEVERITY = {
  CRITICAL: { rank: 4, label: 'Critical', textVar: 'var(--flagged)' },
  HIGH: { rank: 3, label: 'High', textVar: 'var(--flagged)' },
  MEDIUM: { rank: 2, label: 'Medium', textVar: 'var(--caution)' },
  LOW: { rank: 1, label: 'Low', textVar: 'var(--ink-faint)' },
}

export const LAYER_LABELS = {
  1: 'Ingredient Safety',
  2: 'Dangerous Combinations',
  3: 'Source Mismatch',
  4: 'Seller Verification',
  5: 'Marketing Claims',
  6: 'Ingredient Disclosure',
}

export const LAYER_DESCRIPTIONS = {
  1: 'Checks every declared ingredient against known regulatory blocklists — CDSCO banned substances, Schedule H prescription drugs, and EU-prohibited ingredients.',
  2: 'Checks whether any two ingredients, used together, are known to cause irritation, instability, or barrier damage — even if each is safe on its own.',
  3: 'Compares the ingredients on the physical label against what the seller lists online, to catch anything hidden or added between the two.',
  4: "Checks whether the seller is on a recognized, accountable platform — not a judgment on the product itself, just who's selling it.",
  5: 'Scans marketing text for language that makes an illegal drug-style claim (e.g. "cures," "clinically proven") a cosmetic legally cannot make.',
  6: 'Flags vague ingredient terms like "Fragrance" or "Proprietary Blend" that can legally hide undisclosed chemicals.',
}

export const LAYER_ORDER = [1, 2, 3, 4, 5, 6]

export const ALWAYS_RUN_LAYERS = [1, 2, 6] // only need `ingredients`, which is always submitted

export const VERDICT_META = {
  SAFE: { label: 'No Violations', colorVar: 'var(--term-verdict-safe)' },
  CAUTION: { label: 'Caution', colorVar: 'var(--term-verdict-caution)' },
  HIGH_RISK: { label: 'High Risk', colorVar: 'var(--term-verdict)' },
}

export function ranLayers(payload) {
  const ran = new Set(ALWAYS_RUN_LAYERS)
  if (payload?.sourceUrl) ran.add(4)
  if (payload?.websiteIngredients?.length) ran.add(3)
  if (payload?.marketingText) ran.add(5)
  return ran
}
