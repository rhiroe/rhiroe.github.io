// Mock for remark-html
const remarkHtml = jest.fn(() => ({
  type: 'html-transformer',
  transform: jest.fn()
}));

module.exports = remarkHtml;
module.exports.default = remarkHtml;
