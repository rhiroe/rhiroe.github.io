// Mock for mermaid
const mermaid = {
  initialize: jest.fn(),
  render: jest.fn().mockResolvedValue({
    svg: '<svg>Mocked Mermaid</svg>',
    bindFunctions: jest.fn()
  }),
  mermaidAPI: {
    initialize: jest.fn(),
    render: jest.fn()
  }
};

module.exports = mermaid;
module.exports.default = mermaid;
