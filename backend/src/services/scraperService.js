const cheerio = require('cheerio');
const { getOrSet } = require('../lib/cache');

function extractIngredients(html) {
    const $ = cheerio.load(html);
    const text = $('#ingredients').text();

    return text
         .split(',')
         .map((item) => item.trim())
         .filter((item) => item.length > 0);
}

async function scrapeIngredients(url) {
    return getOrSet(`scrape:${url}`, 60 * 60 * 24, async () =>{
         const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

         if(!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    
    const html = await response.text();
    return extractIngredients(html)
  });
}

module.exports = { extractIngredients, scrapeIngredients };