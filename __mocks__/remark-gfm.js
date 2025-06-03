// Mock for remark-gfm
const remarkGfm = jest.fn(() => ({
  type: 'gfm-transformer',
  transform: jest.fn()
}));

module.exports = remarkGfm;
module.exports.default = remarkGfm;
