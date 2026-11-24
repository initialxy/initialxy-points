import { randomBytes } from 'node:crypto'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

// nuxt-auth-utils >= 0.6 seals sessions with a secret derived from
// `appSecret`. The e2e test server is a production build (which does not
// generate a development secret), so provide one here. A value from the
// environment (e.g. .env.test) takes precedence when present.
process.env.NUXT_APP_SECRET ??= randomBytes(32).toString('hex')

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/{e2e,unit}/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
