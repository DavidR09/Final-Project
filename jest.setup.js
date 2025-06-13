import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock para localStorage
const mockLocalStorage = {
  store: {},
  getItem: jest.fn(key => mockLocalStorage.store[key]),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.store[key] = value;
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  })
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para fetch
global.fetch = jest.fn();

// Configurar TextEncoder y TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder; 