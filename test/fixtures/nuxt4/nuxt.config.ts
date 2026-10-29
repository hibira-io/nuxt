export default defineNuxtConfig({
  modules: ['@hibira-io/nuxt'],
  hibira: { host: '127.0.0.1', port: 8080, tls: false },
  compatibilityDate: '2026-10-01',
});
