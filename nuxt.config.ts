// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      title: 'Points!',
      htmlAttrs: {
        lang: 'en',
      },
      viewport: 'width=device-width,initial-scale=1.0,user-scalable=no',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon-152x152.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
      meta: [
        { name: 'mobile-web-app-capable', content: 'yes'},
        { name: 'apple-touch-fullscreen', content: 'yes'},
        { name: 'apple-mobile-web-app-capable', content: 'yes'},
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
        { name: 'application-name', content: 'initialxy-points'},
        { name: 'apple-mobile-web-app-title', content: 'Points!'},
        { name: 'msapplication-starturl', content: '/'},
        { name: 'msapplication-TileImage', content: '/mstile-144x144.png'},
        { name: 'msapplication-square310x310logo', content: '/mstile-310x310.png'},
        { name: 'msapplication-TileColor', content: '#0f172b'},
        { name: 'theme-color', content: '#0f172b'},
      ],
    },
    pageTransition: { name: 'page', mode: 'in-out' }
  },
  css: ['~/assets/css/main.css'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
})