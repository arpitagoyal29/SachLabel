const { classifySource } = require('./sourceService');

describe('classifySource', () => {
  test('recognizes a verified platform', () => {
    const result = classifySource('https://www.nykaa.com/product/123');
    expect(result.tier).toBe('VERIFIED');
    expect(result.verified).toBe(true);
  });

  test('flags an unverified channel', () => {
    const result = classifySource('https://shady-brand.myshopify.com/p');
    expect(result.tier).toBe('UNVERIFIED');
    expect(result.verified).toBe(false);
  });

  test('strips www. when matching', () => {
    expect(classifySource('https://nykaa.com/x').tier).toBe('VERIFIED');
  });

  test('handles a malformed URL without throwing', () => {
    const result = classifySource('not a url');
    expect(result.tier).toBe('UNKNOWN');
  });
});
