// Installs @hibira-io/vue in the browser (Nuxt 2).
import Vue from 'vue';
import { createHibira } from '@hibira-io/vue';
import { pusherOptions } from '@hibira-io/nuxt/runtime/options.mjs';

export default function ({ $config, app }) {
  const config = ($config && $config.hibira) || {};
  const hibira = createHibira({ appKey: config.key, options: pusherOptions(config) });
  Vue.use(hibira);
  app.$hibira = hibira;
}
