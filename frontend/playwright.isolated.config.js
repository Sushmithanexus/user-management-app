import { defineConfig, devices } from '@playwright/test';

// Isolated config - Starts its own server on different port
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  use: {
    baseURL: 'http://localhost:5174', // Different port!
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev -- --port 5174', // Run on different port
    url: 'http://localhost:5174',
    reuseExistingServer: false, // Always start fresh
    timeout: 120000,
  },
});
