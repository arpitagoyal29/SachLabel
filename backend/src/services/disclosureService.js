const { normalize } = require('../lib/normalize');

const VAGUE_TERMS = new Set([
  'fragrance',
  'parfum',
  'perfume',
  'proprietary blend',
  'cream base',
  'herbal extracts',
  'natural extracts',
  'essential oils',
  'flavor',
]);

function detectVagueDisclosure(ingredients) {
  const vague = ingredients.filter((name) => VAGUE_TERMS.has(normalize(name)));

  return {
    transparent: vague.length === 0,
    count: vague.length,
    vagueTerms: vague,
  };
}

module.exports = { detectVagueDisclosure };
