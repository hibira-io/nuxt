import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pusherOptions } from '../runtime/options.mjs';

test('defaults point at Hibira', () => {
  assert.deepEqual(pusherOptions({ authEndpoint: '/api/hibira/auth' }), {
    wsHost: 'ws.hibira.io',
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    channelAuthorization: { endpoint: '/api/hibira/auth', transport: 'ajax' },
  });
});

test('a local server, user auth and extra options', () => {
  const o = pusherOptions({ host: '127.0.0.1', port: '8080', tls: false, authEndpoint: '', userAuthEndpoint: '/signin', options: { activityTimeout: 5000 } });
  assert.equal(o.wsHost, '127.0.0.1');
  assert.equal(o.wsPort, 8080);
  assert.equal(o.wssPort, 8080);
  assert.equal(o.forceTLS, false);
  assert.equal(o.channelAuthorization, undefined);
  assert.deepEqual(o.userAuthentication, { endpoint: '/signin', transport: 'ajax' });
  assert.equal(o.activityTimeout, 5000);
});

test('the Nuxt 2 module fills runtime config and adds the plugin', async () => {
  const { default: mod } = await import('../nuxt2/module.cjs');
  const plugins = [];
  const ctx = {
    options: { hibira: { key: 'k', appId: 'a', secret: 's' }, publicRuntimeConfig: { hibira: { host: 'h' } }, build: { transpile: [] } },
    addPlugin: (p) => plugins.push(p),
  };
  mod.call(ctx, { tls: false });
  assert.equal(ctx.options.publicRuntimeConfig.hibira.key, 'k');
  assert.equal(ctx.options.publicRuntimeConfig.hibira.host, 'h');
  assert.equal(ctx.options.publicRuntimeConfig.hibira.tls, false);
  assert.equal(ctx.options.publicRuntimeConfig.hibira.secret, undefined, 'secret stays private');
  assert.deepEqual(ctx.options.privateRuntimeConfig.hibira, { appId: 'a', secret: 's' });
  assert.equal(plugins[0].mode, 'client');
  assert.ok(ctx.options.build.transpile.includes('@hibira-io/vue'));
  assert.equal(mod.meta.name, '@hibira-io/nuxt');
});
