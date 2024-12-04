const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: '**/*.test.js',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  reporter: [
    ['html', { outputFolder: './.nyc_output/html-report' }],
    ['line']
  ],
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ],
});