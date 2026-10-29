// Installs @hibira-io/vue in the browser. On the server nothing is
// installed, so the composables keep their empty values and nothing connects.
import { createHibira } from '@hibira-io/vue';
import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
import { pusherOptions } from './options.mjs';

export default defineNuxtPlugin({
  name: 'hibira',
  async setup(nuxtApp) {
    const config = useRuntimeConfig().public.hibira || {};
    const options = pusherOptions(config);
    // Last chance to change pusher-js options, e.g. a customHandler that
    // functions in nuxt.config cannot express.
    await nuxtApp.callHook('hibira:options', options);
    const hibira = createHibira({ appKey: config.key, options });
    nuxtApp.vueApp.use(hibira);
    return { provide: { hibira } };
  },
});
