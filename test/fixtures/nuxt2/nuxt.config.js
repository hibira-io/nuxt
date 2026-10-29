export default {
  modules: ['@hibira-io/nuxt/nuxt2'],
  hibira: { host: '127.0.0.1', port: 8080, tls: false },
  publicRuntimeConfig: { hibira: { key: process.env.HIBIRA_KEY } },
  serverMiddleware: [
    { path: '/api/hibira/auth', handler: '~/api/auth.js' },
    { path: '/api/ask', handler: '~/api/ask.js' },
  ],
};
