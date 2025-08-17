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
  // Nuxt 4 specific configurations
  experimental: {
    // Enable granular cached data (default in Nuxt 4)
    granularCachedData: true,
    // Enable purge cached data (default in Nuxt 4)
    purgeCachedData: true,
    // Enable shared prerender data (default in Nuxt 4)
    sharedPrerenderData: true,
    // Enable pending when idle (default in Nuxt 4)
    pendingWhenIdle: false,
    // Enable shallow function reactivity (default in Nuxt 4)
    defaults: {
      useAsyncData: {
        deep: true
      }
    }
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
        { name: 'msapplication-TileColor', media: '(prefers-color-scheme: light)', content: '#ffffff'},
        { name: 'msapplication-TileColor', media: '(prefers-color-scheme: dark)', content: '#061b2b'},
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff'},
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#061b2b'},
      ],
    },
    pageTransition: { name: 'page', mode: 'in-out' },
    // SPA loading template location (Nuxt 4 default)
    spaLoaderTag: 'div',
    spaLoaderAttrs: {
      id: '__nuxt'
    }
  },
  css: ['~/assets/css/main.css'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  features: {
    // Enable inline styles for better performance
    inlineStyles: false
  }
})