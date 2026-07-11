/**
 * SachLabel — Ingredient reference data (curated starter set)
 *
 * ⚠️ VERIFY BEFORE PUBLIC/AUTHORITATIVE USE.
 * These entries are widely-documented regulatory facts, compiled as a starter
 * dataset. Before deploying publicly or presenting any verdict as authoritative,
 * verify each entry against the primary source:
 *   - CDSCO Schedule H  (Drugs & Cosmetics Rules, 1945 — Schedule H list)
 *   - CDSCO banned cosmetics (gazette notifications)
 *   - EU CosIng Annex II (prohibited substances) — downloadable CSV export
 *
 * STATUS MEANINGS
 *   SCHEDULE_H  Prescription-only drug in India; illegal in OTC cosmetics.
 *   BANNED      Prohibited in cosmetics.
 *   EU_BANNED   Prohibited in EU cosmetics (CosIng Annex II).
 *   RESTRICTED  Permitted only under concentration/use-condition limits.
 *   SAFE        No known regulatory prohibition. (NOT a certification of safety.)
 *
 * NOTE ON SYNONYMS: common synonyms (e.g. "Tretinoin" for "Retinoic Acid", "Aqua"
 * for "Water") are NOT duplicated as separate rows here — they're seeded once, as
 * a canonical entry below, and resolved via data/aliases.js + the IngredientAlias
 * table at query time. Only put a name here if it's a genuinely distinct substance.
 */

const CDSCO_H = 'CDSCO Schedule H (Drugs & Cosmetics Rules)';
const CDSCO_BAN = 'CDSCO — prohibited in cosmetics';
const EU_ANNEX_II = 'EU CosIng Annex II (prohibited substances)';
const EU_RESTRICTED = 'EU CosIng Annex III (restricted substances)';

const ingredients = [
  // ─────────────────────────────────────────────────────────────
  // SCHEDULE_H — prescription-only drugs, illegal in OTC cosmetics
  // ─────────────────────────────────────────────────────────────
  { name: 'Retinoic Acid', status: 'SCHEDULE_H', reason: 'Prescription-only drug; illegal to sell OTC in cosmetics', source: CDSCO_H },
  { name: 'Isotretinoin', status: 'SCHEDULE_H', reason: 'Prescription-only retinoid; teratogenic; illegal in cosmetics', source: CDSCO_H },
  { name: 'Adapalene', status: 'SCHEDULE_H', reason: 'Prescription-only retinoid in India; not permitted in OTC cosmetics', source: CDSCO_H },
  { name: 'Hydroquinone', status: 'SCHEDULE_H', reason: 'Skin-lightening agent; prescription-only above 2% in India. Also prohibited in EU skin-lightening cosmetics', source: CDSCO_H },

  // Corticosteroids — common illegal adulterant in "fairness" creams
  { name: 'Betamethasone', status: 'SCHEDULE_H', reason: 'Potent corticosteroid; prescription-only. Causes skin thinning and dependence', source: CDSCO_H },
  { name: 'Betamethasone Valerate', status: 'SCHEDULE_H', reason: 'Potent corticosteroid; prescription-only. Common illegal adulterant in fairness creams', source: CDSCO_H },
  { name: 'Clobetasol', status: 'SCHEDULE_H', reason: 'Super-potent corticosteroid; prescription-only. Severe skin damage with unsupervised use', source: CDSCO_H },
  { name: 'Clobetasol Propionate', status: 'SCHEDULE_H', reason: 'Super-potent corticosteroid; prescription-only. Frequently found illegally in OTC creams', source: CDSCO_H },
  { name: 'Mometasone Furoate', status: 'SCHEDULE_H', reason: 'Corticosteroid; prescription-only; illegal in cosmetics', source: CDSCO_H },
  { name: 'Hydrocortisone', status: 'SCHEDULE_H', reason: 'Corticosteroid; prescription-only in India; illegal in cosmetics', source: CDSCO_H },
  { name: 'Triamcinolone Acetonide', status: 'SCHEDULE_H', reason: 'Corticosteroid; prescription-only; illegal in cosmetics', source: CDSCO_H },
  { name: 'Fluocinolone Acetonide', status: 'SCHEDULE_H', reason: 'Corticosteroid; prescription-only; illegal in cosmetics', source: CDSCO_H },

  // Antibiotics / antifungals
  { name: 'Clindamycin', status: 'SCHEDULE_H', reason: 'Prescription-only antibiotic; unsupervised use drives antimicrobial resistance', source: CDSCO_H },
  { name: 'Erythromycin', status: 'SCHEDULE_H', reason: 'Prescription-only antibiotic; illegal in OTC cosmetics', source: CDSCO_H },
  { name: 'Ketoconazole', status: 'SCHEDULE_H', reason: 'Prescription-only antifungal; illegal in OTC cosmetics', source: CDSCO_H },
  { name: 'Metronidazole', status: 'SCHEDULE_H', reason: 'Prescription-only antimicrobial; illegal in OTC cosmetics', source: CDSCO_H },
  { name: 'Minoxidil', status: 'SCHEDULE_H', reason: 'Prescription-only in India; cardiovascular effects; not a cosmetic ingredient', source: CDSCO_H },

  // ─────────────────────────────────────────────────────────────
  // BANNED — prohibited in cosmetics
  // ─────────────────────────────────────────────────────────────
  { name: 'Mercury', status: 'BANNED', reason: 'Toxic heavy metal; banned in cosmetics. Causes kidney and neurological damage', source: CDSCO_BAN },
  { name: 'Mercuric Chloride', status: 'BANNED', reason: 'Mercury compound; toxic; banned in cosmetics', source: CDSCO_BAN },
  { name: 'Lead', status: 'BANNED', reason: 'Toxic heavy metal; banned in cosmetics. Cumulative neurotoxin', source: CDSCO_BAN },
  { name: 'Lead Acetate', status: 'BANNED', reason: 'Lead compound; toxic; prohibited in cosmetics', source: CDSCO_BAN },
  { name: 'Arsenic', status: 'BANNED', reason: 'Toxic heavy metal; carcinogen; banned in cosmetics', source: CDSCO_BAN },
  { name: 'Hexachlorophene', status: 'BANNED', reason: 'Neurotoxic antibacterial; prohibited in cosmetics', source: CDSCO_BAN },
  { name: 'Chloroform', status: 'BANNED', reason: 'Carcinogenic solvent; prohibited in cosmetics', source: EU_ANNEX_II },
  { name: 'Benzene', status: 'BANNED', reason: 'Known human carcinogen; prohibited in cosmetics', source: EU_ANNEX_II },
  { name: 'Vinyl Chloride', status: 'BANNED', reason: 'Carcinogen; prohibited as a cosmetic ingredient and propellant', source: EU_ANNEX_II },

  // ─────────────────────────────────────────────────────────────
  // EU_BANNED — prohibited in EU cosmetics (CosIng Annex II)
  // ─────────────────────────────────────────────────────────────
  { name: 'Methyldibromo Glutaronitrile', status: 'EU_BANNED', reason: 'Preservative; strong contact allergen; prohibited in EU cosmetics', source: EU_ANNEX_II },
  { name: 'Zinc Pyrithione', status: 'EU_BANNED', reason: 'Prohibited in EU cosmetics (reprotoxic classification)', source: EU_ANNEX_II },
  { name: 'Butylphenyl Methylpropional', status: 'EU_BANNED', reason: 'Fragrance ingredient (Lilial); reprotoxic; prohibited in EU cosmetics', source: EU_ANNEX_II },
  { name: 'Diethylene Glycol', status: 'EU_BANNED', reason: 'Toxic solvent; prohibited in cosmetics', source: EU_ANNEX_II },
  { name: 'Isopropylparaben', status: 'EU_BANNED', reason: 'Paraben preservative; prohibited in EU cosmetics', source: EU_ANNEX_II },
  { name: 'Isobutylparaben', status: 'EU_BANNED', reason: 'Paraben preservative; prohibited in EU cosmetics', source: EU_ANNEX_II },
  { name: 'Phenylparaben', status: 'EU_BANNED', reason: 'Paraben preservative; prohibited in EU cosmetics', source: EU_ANNEX_II },
  { name: 'Benzylparaben', status: 'EU_BANNED', reason: 'Paraben preservative; prohibited in EU cosmetics', source: EU_ANNEX_II },
  { name: 'Pentylparaben', status: 'EU_BANNED', reason: 'Paraben preservative; prohibited in EU cosmetics', source: EU_ANNEX_II },

  // ─────────────────────────────────────────────────────────────
  // RESTRICTED — allowed only under limits / use conditions
  // ─────────────────────────────────────────────────────────────
  { name: 'Methylisothiazolinone', status: 'RESTRICTED', reason: 'Preservative and contact allergen; banned in leave-on products, allowed only in rinse-off within limits', source: EU_RESTRICTED },
  { name: 'Methylchloroisothiazolinone', status: 'RESTRICTED', reason: 'Preservative and contact allergen; rinse-off only, within concentration limits', source: EU_RESTRICTED },
  { name: 'Formaldehyde', status: 'RESTRICTED', reason: 'Carcinogen; permitted only at strictly limited concentrations, with labelling', source: EU_RESTRICTED },
  { name: 'DMDM Hydantoin', status: 'RESTRICTED', reason: 'Formaldehyde-releasing preservative; concentration-limited and requires labelling', source: EU_RESTRICTED },
  { name: 'Triclosan', status: 'RESTRICTED', reason: 'Antibacterial; concentration-limited by product type; resistance concerns', source: EU_RESTRICTED },
  { name: 'Salicylic Acid', status: 'RESTRICTED', reason: 'BHA exfoliant; concentration-limited in cosmetics (typically up to 2%)', source: EU_RESTRICTED },
  { name: 'Kojic Acid', status: 'RESTRICTED', reason: 'Skin-lightening agent; concentration-limited; sensitisation concerns', source: EU_RESTRICTED },
  { name: 'Retinol', status: 'RESTRICTED', reason: 'Cosmetic retinoid; concentration-limited; irritation and photosensitivity', source: EU_RESTRICTED },
  { name: 'Glycolic Acid', status: 'RESTRICTED', reason: 'AHA exfoliant; concentration and pH limited in cosmetics', source: EU_RESTRICTED },
  { name: 'Benzoyl Peroxide', status: 'RESTRICTED', reason: 'Acne agent; concentration-limited; irritant and bleaches fabric', source: EU_RESTRICTED },
  { name: 'Hydrogen Peroxide', status: 'RESTRICTED', reason: 'Oxidising agent; strictly concentration-limited by product type', source: EU_RESTRICTED },
  { name: 'Resorcinol', status: 'RESTRICTED', reason: 'Hair-dye and antiseptic agent; concentration-limited; sensitiser', source: EU_RESTRICTED },
  { name: 'Thioglycolic Acid', status: 'RESTRICTED', reason: 'Hair-straightening/depilatory agent; strictly concentration-limited', source: EU_RESTRICTED },

  // ─────────────────────────────────────────────────────────────
  // SAFE — no known regulatory prohibition (NOT a safety certification)
  // ─────────────────────────────────────────────────────────────
  { name: 'Water', status: 'SAFE', reason: null, source: null },
  { name: 'Glycerin', status: 'SAFE', reason: null, source: null },
  { name: 'Niacinamide', status: 'SAFE', reason: null, source: null },
  { name: 'Hyaluronic Acid', status: 'SAFE', reason: null, source: null },
  { name: 'Sodium Hyaluronate', status: 'SAFE', reason: null, source: null },
  { name: 'Squalane', status: 'SAFE', reason: null, source: null },
  { name: 'Dimethicone', status: 'SAFE', reason: null, source: null },
  { name: 'Cetearyl Alcohol', status: 'SAFE', reason: null, source: null },
  { name: 'Panthenol', status: 'SAFE', reason: null, source: null },
  { name: 'Tocopherol', status: 'SAFE', reason: null, source: null },
  { name: 'Ascorbic Acid', status: 'SAFE', reason: null, source: null },
  { name: 'Allantoin', status: 'SAFE', reason: null, source: null },
  { name: 'Zinc Oxide', status: 'SAFE', reason: null, source: null },
  { name: 'Titanium Dioxide', status: 'SAFE', reason: null, source: null },
  { name: 'Shea Butter', status: 'SAFE', reason: null, source: null },
  { name: 'Jojoba Oil', status: 'SAFE', reason: null, source: null },
  { name: 'Aloe Barbadensis Leaf Juice', status: 'SAFE', reason: null, source: null },
  { name: 'Ceramide NP', status: 'SAFE', reason: null, source: null },
  { name: 'Urea', status: 'SAFE', reason: null, source: null },
  { name: 'Lactic Acid', status: 'SAFE', reason: null, source: null },
  { name: 'Glutathione', status: 'SAFE', reason: null, source: null },
  { name: 'Alpha Arbutin', status: 'SAFE', reason: null, source: null },
  { name: 'Lycopene', status: 'SAFE', reason: null, source: null },
  { name: 'Cocamidopropyl Betaine', status: 'SAFE', reason: null, source: null },
  { name: 'Sodium Lauroyl Sarcosinate', status: 'SAFE', reason: null, source: null },
  { name: 'Xanthan Gum', status: 'SAFE', reason: null, source: null },
  { name: 'Citric Acid', status: 'SAFE', reason: null, source: null },
  { name: 'Benzyl Alcohol', status: 'SAFE', reason: null, source: null },
];

module.exports = { ingredients };