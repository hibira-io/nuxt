// Nuxt 2 module (Nuxt 2.16+ runs on Vue 2.7, which @hibira-io/vue supports):
// installs @hibira-io/vue in the browser. Import the composables from
// '@hibira-io/vue'; Nuxt 2 has no auto-imports.
const path = require('path');

const DEFAULTS = {
  key: '',
  host: 'ws.hibira.io',
  port: undefined,
  tls: true,
  authEndpoint: '/api/hibira/auth',
  userAuthEndpoint: '',
  options: {},
};

module.exports = function hibiraModule(moduleOptions) {
  const { appId, secret, ...pub } = { ...DEFAULTS, ...this.options.hibira, ...moduleOptions };

  // Public config reaches the browser; the app id and secret stay on the server.
  this.options.publicRuntimeConfig = this.options.publicRuntimeConfig || {};
  this.options.publicRuntimeConfig.hibira = { ...pub, ...(this.options.publicRuntimeConfig.hibira || {}) };
  this.options.privateRuntimeConfig = this.options.privateRuntimeConfig || {};
  this.options.privateRuntimeConfig.hibira = { appId: appId || '', secret: secret || '', ...(this.options.privateRuntimeConfig.hibira || {}) };

  // Webpack 4 cannot parse ?. and ??, so Babel compiles these.
  this.options.build.transpile.push('@hibira-io/vue', '@hibira-io/nuxt');

  this.addPlugin({ src: path.resolve(__dirname, 'plugin.client.js'), fileName: 'hibira.client.js', mode: 'client' });
};

module.exports.meta = require('../package.json');
