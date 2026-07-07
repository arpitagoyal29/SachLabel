const cheerio = require('cheerio');

function extractIngredients(html) {
    const $ = cheerio.load(html);
    const text = $('#ingredients').text();

    return text
         .split(',')
         .map((item) => item.trim())
         .filter((item) => item.length > 0);
}

async function scrapeIngredients(url) {
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    return extractIngredients(html)
}

module.exports = { extractIngredients, scrapeIngredients };