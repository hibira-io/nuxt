// Nuxt 3 and 4 module: installs @hibira-io/vue in the browser, auto-imports
// its composables, and gives server routes useHibiraServer() and
// streamToChannel(). Nuxt 2 uses ./nuxt2/module.cjs instead.
import { addImports, addPlugin, addServerImports, createResolver, defineNuxtModule } from '@nuxt/kit';

const COMPOSABLES = ['useHibira', 'usePusher', 'useChannel', 'useEvent', 'usePresence', 'useTrigger', 'useConnectionState', 'useStream'];

export default defineNuxtModule({
  meta: {
    name: '@hibira-io/nuxt',
    configKey: 'hibira',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {
    key: '',
    host: 'ws.hibira.io',
    port: undefined,
    tls: true,
    authEndpoint: '/api/hibira/auth',
    userAuthEndpoint: '',
    options: {},
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const { appId, secret, ...pub } = options;

    // Public config reaches the browser (NUXT_PUBLIC_HIBIRA_KEY...); the app
    // id and secret stay on the server (NUXT_HIBIRA_APP_ID, NUXT_HIBIRA_SECRET).
    const rc = nuxt.options.runtimeConfig;
    rc.public.hibira = { ...pub, ...(rc.public.hibira || {}) };
    rc.hibira = { appId: appId || '', secret: secret || '', ...(rc.hibira || {}) };

    nuxt.options.build.transpile.push(resolve('./runtime'));

    addPlugin({ src: resolve('./runtime/plugin.client.mjs'), mode: 'client' });
    addImports(COMPOSABLES.map((name) => ({ name, from: '@hibira-io/vue' })));
    addServerImports([
      { name: 'useHibiraServer', from: resolve('./runtime/server/utils.mjs') },
      { name: 'streamToChannel', from: '@hibira-io/vue/server' },
    ]);
  },
});
