const DRUG_CLAIM_PATTERNS = [
  { pattern: /\b(cure|cures|curing)\b/i,            category: 'Disease treatment claim' },
  { pattern: /\b(treat|treats|treatment)\b/i,       category: 'Disease treatment claim' },
  { pattern: /\b(heal|heals|healing)\b/i,           category: 'Disease treatment claim' },
  { pattern: /\b(anti[-\s]?(bacterial|fungal|viral))\b/i, category: 'Antimicrobial drug claim' },
  { pattern: /\b(clinically|dermatologically)\s+(proven|tested)\b/i, category: 'Unsubstantiated proof claim' },
  { pattern: /\b(miracle|instant|permanent|permanently)\b/i, category: 'Misleading superlative claim' },
];

function detectDrugClaims(text) {
    const found = [];

    for (const { pattern, category } of DRUG_CLAIM_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
            found.push({ claim: match[0], category });
        }
    }

    return {
        hasIllegalClaims: found.length > 0,
        count: found.length,
        claims: found,
    };
}

module.exports = { detectDrugClaims };