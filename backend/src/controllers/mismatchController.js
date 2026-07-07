const { compareSources } = require('../services/mismatchService');

async function checkMismatch(req, res) {
  const { sourceA, sourceB } = req.body;
  const result = compareSources(sourceA, sourceB);

  res.json({
    match: result.match,
    hiddenFromSourceB: result.onlyInA,
    extraInSourceB: result.onlyInB,
  });
}

module.exports = { checkMismatch };
