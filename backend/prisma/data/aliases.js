/**
 * SachLabel — Ingredient synonym / alias pairs
 *
 * Maps a common alternate name to the ONE canonical ingredient it should
 * resolve to (see data/ingredients.js). The canonical name must exist there —
 * the alias itself must NOT also exist as its own ingredient row.
 *
 * Adding a new alias here is now a one-line fix for the class of bug found
 * 2026-07-11 (Gemini OCR read "Pyrithione Zinc", seed data only had
 * "Zinc Pyrithione" — a real EU-banned ingredient was silently missed).
 */

const aliases = [
  { alias: 'Tretinoin', canonical: 'Retinoic Acid' },
  { alias: 'Aqua', canonical: 'Water' },
  { alias: 'Pyrithione Zinc', canonical: 'Zinc Pyrithione' },
  { alias: 'Vitamin C', canonical: 'Ascorbic Acid' },
];

module.exports = { aliases };
