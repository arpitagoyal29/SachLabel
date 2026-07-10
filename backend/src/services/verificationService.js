const { verifyIngredients } = require('./ingredientService');
const { checkCombinations } = require('./combinationService');
const { compareSources } = require('./mismatchService');
const { classifySource } = require('./sourceService');
const { detectDrugClaims } = require('./claimsService');
const { detectVagueDisclosure } = require('./disclosureService');
const { explainFlag } = require('./geminiService');

const SEVERITY_RANK = { SAFE: 0, LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

const SEVERITY_BY_STATUS = {
  BANNED: 'CRITICAL',
  SCHEDULE_H: 'CRITICAL',
  EU_BANNED: 'HIGH',
  RESTRICTED: 'LOW',
};

function overallVerdict(findings) {
  const maxRank = findings.reduce((max, f) => Math.max(max, SEVERITY_RANK[f.severity]), 0);
  if (maxRank >= 3) return 'HIGH_RISK';   // HIGH or CRITICAL
  if (maxRank >= 1) return 'CAUTION';     // LOW or MEDIUM
  return 'SAFE';
}

async function verifyProduct(product) {
  const { ingredients = [], marketingText, sourceUrl, websiteIngredients } = product;
  const findings = [];

  // Layer 1 — individual ingredient safety (one batch, case-insensitive query)
  const matched = await verifyIngredients(ingredients);
  for (const ing of matched) {
    const severity = SEVERITY_BY_STATUS[ing.status];
    if (!severity) continue;
    const detail =
      ing.status === 'RESTRICTED'
        ? `${ing.name}: permitted only within limits — ${ing.reason}. Concentration not disclosed on label.`
        : `${ing.name}: ${ing.reason}`;
        findings.push({ layer: 1, severity, detail, ingredientName: ing.name });
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
        for (const added of mismatch.onlyInB) {
      findings.push({ layer: 3, severity: 'MEDIUM', detail: `Listed on website but not on label: "${added}"` });
    }

  }

    const enrichedFindings = await Promise.all(
          findings.map((f) => explainFlag(f.detail).then((explanation) => ({ ...f, explanation })))

  );

  const explanationByIngredientName = new Map(
    enrichedFindings
      .filter((f) => f.layer === 1)
      .map((f) => [f.ingredientName, f.explanation])
  );

  const ingredientResults = matched.map((ing) => ({
    name: ing.name,
    status: ing.status,
    reason: ing.reason,
    source: ing.source,
    explanation: explanationByIngredientName.get(ing.name) ?? null,
  }));

  const findingsForResponse = enrichedFindings.map(({ ingredientName, ...rest }) => rest);

  return {
    verdict: overallVerdict(findings),
    findingCount: findings.length,
    findings: findingsForResponse,
    ingredientResults,
  };
}

module.exports = { verifyProduct, overallVerdict };


