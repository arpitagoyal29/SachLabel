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
