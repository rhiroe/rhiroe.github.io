/**
 * Pagination component tests
 * Running in Node.js environment without DOM
 */

describe('Pagination', () => {
  it('can be imported without errors', () => {
    expect(() => {
      require('../Pagination');
    }).not.toThrow();
  });

  it('exports a Pagination component', () => {
    const PaginationModule = require('../Pagination');
    expect(PaginationModule.Pagination || PaginationModule.default).toBeDefined();
  });

  it('has proper component structure', () => {
    const PaginationModule = require('../Pagination');
    const Pagination = PaginationModule.Pagination || PaginationModule.default;
    
    expect(typeof Pagination).toBe('function');
    expect(Pagination.displayName || Pagination.name).toBeTruthy();
  });
});
