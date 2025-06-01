// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  nitro: {
    plugins: [
      { src: '~/server/middleware/auth', route: '/api/auth' },
      { src: '~/server/middleware/auth', route: '/api/tasks' },
      { src: '~/server/middleware/auth', route: '/api/rewards' },
      { src: '~/server/middleware/auth', route: '/api/wishlist' }
    ]
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/ui'
  ]
})