// Runs before the module's plugin (enforce: 'pre'), so the hook is in place.
export default defineNuxtPlugin({
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.hook('hibira:options', (options) => {
      options.activityTimeout = 12345;
    });
  },
});
