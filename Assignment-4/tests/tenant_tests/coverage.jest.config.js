const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: ['<rootDir>/../../apps/frontend/static/js/tenants.js'],
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules'],
  rootDir: __dirname,
  roots: [__dirname],
  verbose: true
};