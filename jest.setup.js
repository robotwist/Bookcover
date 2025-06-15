const { JSDOM } = require('jsdom');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

// Mock chrome API
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
  },
};

// Mock console methods
const mockConsole = {
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

global.console = {
  ...console,
  ...mockConsole
};

// Mock MutationObserver
class MockMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.observing = false;
  }

  observe(target, options) {
    this.observing = true;
    this.target = target;
    this.options = options;
  }

  disconnect() {
    this.observing = false;
  }

  simulateMutation(mutations) {
    if (this.observing && this.callback) {
      this.callback(mutations, this);
    }
  }
}

global.MutationObserver = MockMutationObserver;

// Mock DOM elements
document.body.innerHTML = `
  <div id="root">
    <div role="feed"></div>
    <div role="complementary"></div>
    <div role="navigation"></div>
  </div>
`;

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = `
    <div id="root">
      <div role="feed"></div>
      <div role="complementary"></div>
      <div role="navigation"></div>
    </div>
  `;
}); 