// pusher-js options from the module's public config. Shared by the Nuxt 3/4
// plugin and the Nuxt 2 plugin.
export function pusherOptions(config = {}) {
  const tls = config.tls !== false;
  const options = {
    wsHost: config.host || 'ws.hibira.io',
    forceTLS: tls,
    enabledTransports: ['ws', 'wss'],
  };
  if (config.port) {
    options.wsPort = Number(config.port);
    options.wssPort = Number(config.port);
  }
  if (config.authEndpoint) options.channelAuthorization = { endpoint: config.authEndpoint, transport: 'ajax' };
  if (config.userAuthEndpoint) options.userAuthentication = { endpoint: config.userAuthEndpoint, transport: 'ajax' };
  return { ...options, ...(config.options || {}) };
}
