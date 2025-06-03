/**
 * Basic test setup for Node.js environment
 * This ensures Jest works without external dependencies
 */

// Mock fs module for Node.js functions
jest.mock('fs');
jest.mock('path');

// Mock Next.js modules
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock mermaid
jest.mock('mermaid', () => ({
  init: jest.fn(),
  render: jest.fn(() => Promise.resolve('<div>mocked diagram</div>')),
}));
