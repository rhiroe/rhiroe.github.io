/**
 * Basic test setup for Node.js environment
 * This ensures Jest works without external dependencies
 */

// Mock fs module for Node.js functions
const fs = require('fs');
jest.mock('fs');

// Enhanced path mock with proper join implementation
const path = require('path');
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn((...args) => {
    // Filter out undefined values and join with /
    const validArgs = args.filter(arg => arg !== undefined && arg !== null);
    if (validArgs.length === 0) return '';
    return validArgs.join('/').replace(/\/+/g, '/');
  }),
  resolve: jest.fn((...args) => {
    const validArgs = args.filter(arg => arg !== undefined && arg !== null);
    return '/' + validArgs.join('/').replace(/\/+/g, '/');
  }),
  basename: jest.fn((filepath) => {
    if (typeof filepath !== 'string') return '';
    return filepath.split('/').pop() || '';
  }),
  dirname: jest.fn((filepath) => {
    if (typeof filepath !== 'string') return '.';
    const parts = filepath.split('/');
    return parts.slice(0, -1).join('/') || '/';
  }),
  extname: jest.fn((filepath) => {
    if (typeof filepath !== 'string') return '';
    const match = filepath.match(/\.[^.]*$/);
    return match ? match[0] : '';
  })
}));

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
