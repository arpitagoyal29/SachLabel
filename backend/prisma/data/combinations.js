/**
 * SachLabel — Dangerous ingredient combination rules (the graph edges)
 *
 * ⚠️ NOTE ON SOURCE TYPE: unlike the ingredient blocklist (which comes from
 * regulatory prohibited-lists), these are DERMATOLOGICAL / FORMULATION guidance —
 * well-documented interaction risks, not legal prohibitions. Severity reflects
 * irritation / barrier-damage / instability risk, not illegality.
 *
 * Every `a` and `b` must exist by name in data/ingredients.js — the seed resolves
 * names to database ids at runtime and stores each edge canonically (smaller id
 * first), so order here does not matter.
 *
 * Because synonyms are seeded as separate rows (no alias table yet), key rules are
 * duplicated for common synonyms (e.g. Retinoic Acid and Tretinoin).
 */

const DERM = 'Dermatological guidance — interaction risk';

const combinations = [
  // Retinoids + AHAs/BHAs — irritation and skin-barrier damage
  { a: 'Retinoic Acid', b: 'Lactic Acid', severity: 'HIGH', reason: 'Retinoid + AHA: high irritation and skin-barrier damage', source: DERM },
  { a: 'Retinoic Acid', b: 'Glycolic Acid', severity: 'HIGH', reason: 'Retinoid + AHA: high irritation and skin-barrier damage', source: DERM },
  { a: 'Retinoic Acid', b: 'Salicylic Acid', severity: 'HIGH', reason: 'Retinoid + BHA: compounded exfoliation, irritation and peeling', source: DERM },
  { a: 'Retinol', b: 'Glycolic Acid', severity: 'HIGH', reason: 'Retinoid + AHA: irritation and barrier disruption', source: DERM },
  { a: 'Retinol', b: 'Lactic Acid', severity: 'HIGH', reason: 'Retinoid + AHA: irritation and barrier disruption', source: DERM },
  { a: 'Retinol', b: 'Salicylic Acid', severity: 'MEDIUM', reason: 'Retinoid + BHA: over-exfoliation and sensitivity', source: DERM },
  { a: 'Tretinoin', b: 'Glycolic Acid', severity: 'HIGH', reason: 'Retinoid + AHA: high irritation and skin-barrier damage', source: DERM },
  { a: 'Tretinoin', b: 'Salicylic Acid', severity: 'HIGH', reason: 'Retinoid + BHA: compounded exfoliation and irritation', source: DERM },

  // Retinoids + benzoyl peroxide — degradation and irritation
  { a: 'Retinoic Acid', b: 'Benzoyl Peroxide', severity: 'HIGH', reason: 'Benzoyl peroxide oxidises and deactivates the retinoid; combined irritation', source: DERM },
  { a: 'Tretinoin', b: 'Benzoyl Peroxide', severity: 'HIGH', reason: 'Benzoyl peroxide oxidises and deactivates tretinoin; combined irritation', source: DERM },
  { a: 'Retinol', b: 'Benzoyl Peroxide', severity: 'MEDIUM', reason: 'Benzoyl peroxide can degrade retinol; combined dryness and irritation', source: DERM },

  // Retinoids + brightening agents
  { a: 'Retinoic Acid', b: 'Kojic Acid', severity: 'MEDIUM', reason: 'Retinoid + Kojic acid: over-exfoliation and sensitivity', source: DERM },
  { a: 'Retinoic Acid', b: 'Vitamin C', severity: 'MEDIUM', reason: 'Retinoid + Vitamin C: instability and irritation at differing pH', source: DERM },
  { a: 'Retinoic Acid', b: 'Ascorbic Acid', severity: 'MEDIUM', reason: 'Retinoid + Vitamin C: instability and irritation at differing pH', source: DERM },
  { a: 'Retinol', b: 'Vitamin C', severity: 'MEDIUM', reason: 'Retinoid + Vitamin C: instability and irritation at differing pH', source: DERM },
  { a: 'Retinol', b: 'Kojic Acid', severity: 'MEDIUM', reason: 'Retinoid + Kojic acid: over-exfoliation and sensitivity', source: DERM },

  // Acid stacking — cumulative over-exfoliation
  { a: 'Glycolic Acid', b: 'Salicylic Acid', severity: 'MEDIUM', reason: 'AHA + BHA stacking: cumulative over-exfoliation and barrier damage', source: DERM },
  { a: 'Lactic Acid', b: 'Glycolic Acid', severity: 'MEDIUM', reason: 'Two AHAs: cumulative over-exfoliation and irritation', source: DERM },
  { a: 'Lactic Acid', b: 'Salicylic Acid', severity: 'MEDIUM', reason: 'AHA + BHA stacking: cumulative over-exfoliation', source: DERM },

  // Hydroquinone interactions
  { a: 'Hydroquinone', b: 'Benzoyl Peroxide', severity: 'MEDIUM', reason: 'Can cause temporary skin staining/discolouration', source: DERM },
  { a: 'Hydroquinone', b: 'Retinoic Acid', severity: 'MEDIUM', reason: 'Potent prescription-only combination; unsupervised use risks irritation and ochronosis', source: DERM },
];

module.exports = { combinations };