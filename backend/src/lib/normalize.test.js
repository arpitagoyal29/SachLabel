const { normalize } = require('./normalize')

describe('normalize', () => {
    test('lowercase and trims', () => {
        expect(normalize('   Retinoic Acid  ')).toBe('retinoic acid');
    });

     test('replaces hyphens with a space (not delete)', () => {
    expect(normalize('Retinoic-Acid')).toBe('retinoic acid');
   });

  test('collapses multiple separators into one space', () => {
    expect(normalize('Retinoic   -  Acid')).toBe('retinoic acid');
   });

  test('equivalent inputs normalize identically', () => {
    expect(normalize('  RETINOIC-ACID  ')).toBe(normalize('Retinoic Acid'));
  });

});