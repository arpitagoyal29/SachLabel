const { verifyIngredient } = require('./ingredientService');
const { checkCombinations } = require('./combinationService');
const { compareSources } = require('./mismatchService');
const { classifySource } = require('./sourceService');
const { detectDrugClaims } = require('./claimsService');
const { detectVagueDisclosure } = require('./disclosureService');
const { explainFlag } = require('./geminiService');

const SEVERITY_RANK = { SAFE: 0, LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

function overallVerdict(findings) {
  const maxRank = findings.reduce((max, f) => Math.max(max, SEVERITY_RANK[f.severity]), 0);
  if (maxRank >= 3) return 'HIGH_RISK';   // HIGH or CRITICAL
  if (maxRank >= 1) return 'CAUTION';     // LOW or MEDIUM
  return 'SAFE';
}

async function verifyProduct(product) {
  const { ingredients = [], marketingText, sourceUrl, websiteIngredients } = product;
  const findings = [];

  // Layer 1 — individual ingredient safety
  for (const name of ingredients) {
    const result = await verifyIngredient(name);
    if (result.status === 'BANNED' || result.status === 'SCHEDULE_H') {
      findings.push({ layer: 1, severity: 'CRITICAL', detail: `${result.name}: ${result.reason}` });
    } else if (result.status === 'EU_BANNED') {
      findings.push({ layer: 1, severity: 'HIGH', detail: `${result.name}: ${result.reason}` });
    }
  }

  // Layer 2 — dangerous combinations
  const combos = await checkCombinations(ingredients);
  for (const c of combos) {
    findings.push({ layer: 2, severity: c.severity, detail: `${c.ingredientA} + ${c.ingredientB}: ${c.reason}` });
  }

  // Layer 6 — vague disclosure
  const vague = detectVagueDisclosure(ingredients);
  for (const term of vague.vagueTerms) {
    findings.push({ layer: 6, severity: 'LOW', detail: `Vague disclosure: "${term}"` });
  }
    // Layer 5 — illegal drug claims (only if marketing text provided)
  if (marketingText) {
    const claims = detectDrugClaims(marketingText);
    for (const c of claims.claims) {
      findings.push({ layer: 5, severity: 'HIGH', detail: `Illegal claim (${c.category}): "${c.claim}"` });
    }
  }

  // Layer 4 — source accountability (only if source URL provided)
  if (sourceUrl) {
    const source = classifySource(sourceUrl);
    if (source.tier === 'UNVERIFIED') {
      findings.push({ layer: 4, severity: 'MEDIUM', detail: source.reason });
    }
  }

  // Layer 3 — label vs website mismatch (only if website ingredients provided)
  if (websiteIngredients) {
    const mismatch = compareSources(ingredients, websiteIngredients);
    for (const hidden of mismatch.onlyInA) {
      findings.push({ layer: 3, severity: 'HIGH', detail: `On label but hidden from website: "${hidden}"` });
    }
  }

    const enrichedFindings = await Promise.all(
          findings.map((f) => explainFlag(f.detail).then((explanation) => ({ ...f, explanation })))

  );

  return {
    verdict: overallVerdict(findings),
    findingCount: findings.length,
    findings: enrichedFindings,
  };
}

module.exports = { verifyProduct, overallVerdict };


