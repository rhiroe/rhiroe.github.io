/**
 * Button component tests
 * Running in Node.js environment without DOM
 */

describe('Button', () => {
  it('can be imported without errors', () => {
    // Test that the Button component can be imported
    expect(() => {
      require('../Button');
    }).not.toThrow();
  });

  it('exports a default Button component', () => {
    const ButtonModule = require('../Button');
    expect(ButtonModule.Button).toBeDefined();
    expect(typeof ButtonModule.Button).toBe('function');
  });

  it('has proper component structure', () => {
    const { Button } = require('../Button');
    
    // Test that it's a React component (function or class)
    expect(typeof Button).toBe('function');
    
    // Components should have displayName or name
    expect(Button.displayName || Button.name).toBeTruthy();
  });
});
