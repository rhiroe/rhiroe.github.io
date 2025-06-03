// Mock for remark
const mockProcessor = {
  use: jest.fn().mockReturnThis(),
  process: jest.fn().mockResolvedValue({
    toString: () => '<p>Mocked HTML output</p>'
  }),
  processSync: jest.fn().mockReturnValue({
    toString: () => '<p>Mocked HTML output</p>'
  })
};

const remarkFunction = jest.fn(() => mockProcessor);

// Export for destructuring { remark }
module.exports = {
  remark: remarkFunction
};

// Also export as default
module.exports.default = remarkFunction;
