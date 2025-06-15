module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.globals.js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true,
  silent: false,
  testTimeout: 10000,
  // Ignore console errors in tests that are expected
  setupFilesAfterEnv: [
    './jest.setup.js',
    'jest-mock-console/dist/setupTestFramework.js'
  ]
}; 