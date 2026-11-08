// Installs @hibira-io/vue in the browser (Nuxt 2).
import Vue from 'vue';
import { createHibira } from '@hibira-io/vue';
import { pusherOptions } from '@hibira-io/nuxt/runtime/options.mjs';

export default async function ({ $config, app }) {
  const config = ($config && $config.hibira) || {};
  // The pusher-js build with NaCl, loaded only when encrypted channels are on.
  const Pusher = config.encrypted ? (await import('pusher-js/with-encryption')).default : undefined;
  const hibira = createHibira({ appKey: config.key, options: pusherOptions(config), Pusher });
  Vue.use(hibira);
  app.$hibira = hibira;
}
