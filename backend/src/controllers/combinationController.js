const { checkCombinations } = require('../services/combinationService');

async function checkCombination(req,res) {
    const { ingredients } = req.body;
    const dangerousPairs = await checkCombinations(ingredients);

    res.json({
        safe: dangerousPairs.length === 0,
        count: dangerousPairs.length,
        dangerousCombinations: dangerousPairs,
    });
}

module.exports = { checkCombination };