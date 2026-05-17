// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      BASE_URL: process.env.BASE_URL,
      GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
    }
  },
  routeRules: {
    '/app/**': { ssr: false },
  }
})