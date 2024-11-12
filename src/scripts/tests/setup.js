// src/scripts/tests/setup.js
import "@testing-library/jest-dom";

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    this.callback([
      {
        isIntersecting: true,
        target: element,
        intersectionRatio: 1,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now(),
      },
    ]);
  }

  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Mock window.requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = jest.fn();

// Mock window.localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: Object.keys(store).length,
    key: (index) => Object.keys(store)[index],
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock console methods for testing
const originalConsole = { ...console };
beforeAll(() => {
  global.console = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    ...console,
  };
});

afterAll(() => {
  global.console = originalConsole;
});

// Custom test environment setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Reset local storage
  localStorage.clear();

  // Reset document body
  document.body.innerHTML = "";

  // Reset window location
  delete window.location;
  window.location = new URL("http://localhost");
});
