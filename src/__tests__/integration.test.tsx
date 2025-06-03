/**
 * Integration tests
 * Running in Node.js environment without DOM
 */

describe('Integration Tests', () => {
  it('components can be imported together without conflicts', () => {
    expect(() => {
      require('../components/common/Button');
      require('../components/common/Typography');
      require('../theme/theme');
    }).not.toThrow();
  });

  it('theme and components work together', () => {
    const themeModule = require('../theme/theme');
    const { Button } = require('../components/common/Button');
    
    expect(themeModule).toBeDefined();
    expect(Button).toBeDefined();
    expect(typeof Button).toBe('function');
  });

  it('lib functions are available', () => {
    expect(() => {
      require('../lib/getContentIndex');
      require('../lib/markdownToHtml');
    }).not.toThrow();
  });

  it('all modules export expected types', () => {
    const getContentModule = require('../lib/getContentIndex');
    const markdownModule = require('../lib/markdownToHtml');
    
    expect(typeof getContentModule.getPostSlugs).toBe('function');
    expect(typeof markdownModule.default).toBe('function');
  });
});
