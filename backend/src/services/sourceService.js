const VERIFIED_PLATFORMS = new Set([
    'nykaa.com',
    'amazon.in',
    'flipkart.com',
    'myntra.com',
    'tira.com',
    'blinkit.com',
    'zeptonow.com',
]);

function extractDOMAIN(url){
    try{
        const host = new URL(url).hostname;
        return host.replace(/^www\./,'');
    } catch {
        return null;
    }
}

function classifySource(url) {
    const domain = extractDOMAIN(url);

    if(!domain) {
        return { tier: 'UNKNOWN', verified: false, reason: 'Invalid or unparseable URL'};
    }

    const verified = VERIFIED_PLATFORMS.has(domain);

    return{
        tier: verified ? 'VERIFIED' : 'UNVERIFIED',
        verified,
        domain,
        reason: verified
            ? 'Sold on a verified platform with seller accountability'
            : 'Sold through an unverified channel - no accountability guarantee',
    };
}

module.exports = { classifySource, extractDOMAIN };