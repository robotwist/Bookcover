module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.globals.js'],
  setupFilesAfterEnv: [
    './jest.setup.js',
    'jest-mock-console/dist/setupTestFramework.js'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
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
  // CI-specific configuration
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  // Ensure we're not running in watch mode in CI
  watchAll: false,
  // Ensure we're not running in interactive mode in CI
  interactive: false
}; 