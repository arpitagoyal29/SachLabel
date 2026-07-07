function normalize(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, ' ');
}

function compareSources(listA, listB) {
    const setA = new Set(listA.map(normalize));
    const setB = new Set(listB.map(normalize));

    const onlyInA = [...setA].filter((name) => !setB.has(name));
    const onlyInB = [...setB].filter((name) => !setA.has(name));

    return {
        match: onlyInA.length === 0 && onlyInB.length === 0,
        onlyInA,
        onlyInB,
    };
}

module.exports = { normalize, compareSources };