const { overallVerdict } = require('./verificationService');

describe('overallVerdict', () => {
  test('no findings → SAFE', () => {
    expect(overallVerdict([])).toBe('SAFE');
  });

  test('a single LOW finding → CAUTION', () => {
    expect(overallVerdict([{ severity: 'LOW' }])).toBe('CAUTION');
  });

  test('a single CRITICAL finding → HIGH_RISK', () => {
    expect(overallVerdict([{ severity: 'CRITICAL' }])).toBe('HIGH_RISK');
  });

  test('CRITICAL is never diluted by many LOW/SAFE findings — worst case wins', () => {
    const findings = [
      { severity: 'LOW' },
      { severity: 'LOW' },
      { severity: 'MEDIUM' },
      { severity: 'CRITICAL' },  // one bad ingredient among many minor issues
      { severity: 'LOW' },
    ];
    expect(overallVerdict(findings)).toBe('HIGH_RISK');
  });
});
