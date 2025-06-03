/**
 * Typography component tests
 * Running in Node.js environment without DOM
 */

describe('Typography', () => {
  it('can be imported without errors', () => {
    expect(() => {
      require('../Typography');
    }).not.toThrow();
  });

  it('exports a default Typography component', () => {
    const TypographyModule = require('../Typography');
    expect(TypographyModule.Typography).toBeDefined();
    expect(typeof TypographyModule.Typography).toBe('function');
  });

  it('has proper component structure', () => {
    const { Typography } = require('../Typography');
    
    expect(typeof Typography).toBe('function');
    expect(Typography.displayName || Typography.name).toBeTruthy();
  });
});
