/**
 * Index page tests
 * Running in Node.js environment without DOM
 */

describe('Index Page', () => {
  it('can be imported without errors', () => {
    expect(() => {
      require('../../pages/index');
    }).not.toThrow();
  });

  it('exports a default component', () => {
    const IndexModule = require('../../pages/index');
    expect(IndexModule.default).toBeDefined();
    expect(typeof IndexModule.default).toBe('function');
  });

  it('has proper page component structure', () => {
    const Home = require('../../pages/index').default;
    
    expect(typeof Home).toBe('function');
    expect(Home.displayName || Home.name).toBeTruthy();
  });
});
