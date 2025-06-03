// Mock for unified
const mockProcessor = {
  use: jest.fn().mockReturnThis(),
  process: jest.fn().mockResolvedValue({
    toString: () => '<p>Mocked unified output</p>'
  }),
  processSync: jest.fn().mockReturnValue({
    toString: () => '<p>Mocked unified output</p>'
  })
};

const unified = jest.fn(() => mockProcessor);

module.exports = unified;
module.exports.default = unified;
