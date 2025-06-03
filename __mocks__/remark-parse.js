// Mock for remark-parse
const remarkParse = jest.fn(() => ({
  type: 'parse-transformer',
  transform: jest.fn()
}));

module.exports = remarkParse;
module.exports.default = remarkParse;
