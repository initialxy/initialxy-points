import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'
import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { isCI } from 'std-env'

const devicesToTest = [
  'Desktop Chrome',
  // Test against other common browser engines.
  // 'Desktop Firefox',
  // 'Desktop Safari',
  // Test against mobile viewports.
  // 'Pixel 5',
  // 'iPhone 12',
  // Test against branded browsers.
  // { ...devices['Desktop Edge'], channel: 'msedge' },
  // { ...devices['Desktop Chrome'], channel: 'chrome' },
] satisfies Array<string | typeof devices[string]>

// nuxt-auth-utils >= 0.6 seals sessions with a secret derived from
// `appSecret`. The test server is a production build (which does not
// generate a development secret), so provide one here. A value from the
// test environment (e.g. .env.test) takes precedence when present.
const testAppSecret =
  process.env.NUXT_APP_SECRET ?? randomBytes(32).toString('hex')

/* See https://playwright.dev/docs/test-configuration. */
export default defineConfig<ConfigOptions>({
  testDir: './test/playwright',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  workers: 1,
  timeout: 30000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Nuxt configuration options */
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
      env: { NUXT_APP_SECRET: testAppSecret },
    },
  },
  projects: devicesToTest.map(p => typeof p === 'string' ? ({ name: p, use: devices[p] }) : p),
})