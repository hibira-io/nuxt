# @hibira-io/nuxt

[![npm](https://img.shields.io/npm/v/@hibira-io/nuxt)](https://www.npmjs.com/package/@hibira-io/nuxt)
[![ci](https://github.com/hibira-io/nuxt/actions/workflows/ci.yml/badge.svg)](https://github.com/hibira-io/nuxt/actions/workflows/ci.yml)

[Hibira](https://hibira.io) realtime for **Nuxt 4, 3 and 2**, built on
[@hibira-io/vue](https://github.com/hibira-io/vue): one WebSocket connection
for the app, channels shared between components, events, presence members,
client events, connection state, and LLM output streamed to every tab with
`streamToChannel()` and `useStream()`. Works with any Pusher-compatible
server.

- Nuxt 3 and 4: composables are auto-imported, and server routes get
  `useHibiraServer()` and `streamToChannel()`.
- Nuxt 2.16+ (Vue 2.7): the same composables, imported from `@hibira-io/vue`.
- Server rendering safe: the connection opens in the browser only, and
  nothing renders differently during hydration.

## Nuxt 3 and 4

```sh
npx nuxi module add @hibira-io/nuxt
# or: npm install @hibira-io/nuxt, then add it to modules
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@hibira-io/nuxt'],
  hibira: {
    // all optional; these are the defaults
    host: 'ws.hibira.io',
    authEndpoint: '/api/hibira/auth',
  },
});
```

Set the app's credentials from the Hibira portal at runtime (`.env` in
development). Only the key reaches the browser.

```sh
NUXT_PUBLIC_HIBIRA_KEY=your-app-key
NUXT_HIBIRA_APP_ID=your-app-id
NUXT_HIBIRA_SECRET=your-app-secret
```

Use the composables in any component, no imports needed:

```vue
<script setup>
const props = defineProps({ roomId: String });
const room = () => `presence-room-${props.roomId}`;

const { members, count } = usePresence(room);
const trigger = useTrigger(room);
useEvent(room, 'client-typing', (data, { user_id }) => showTyping(user_id));

const orders = ref([]);
useEvent('orders', 'order.created', (order) => orders.value.unshift(order));

const state = useConnectionState();
</script>

<template>
  <span :class="state" /> {{ count }} here
  <input @input="trigger('client-typing', {})" />
</template>
```

Auto-imported: `useHibira`, `usePusher`, `useChannel`, `useEvent`,
`usePresence`, `useTrigger`, `useConnectionState`, `useStream`. See the
[@hibira-io/vue README](https://github.com/hibira-io/vue#composables) for
what each returns.

### Server routes

`useHibiraServer(event)` returns a [`pusher`](https://github.com/pusher/pusher-http-node)
client for your app. Private and presence channels need an auth route at
`authEndpoint`; check who is signed in, then sign the subscription:

```ts
// server/api/hibira/auth.post.ts
export default defineEventHandler(async (event) => {
  const user = await requireUser(event); // your session check
  const { socket_id, channel_name } = await readBody(event);
  if (!mayJoin(user, channel_name)) throw createError({ statusCode: 403 });
  const presence = channel_name.startsWith('presence-')
    ? { user_id: String(user.id), user_info: { name: user.name } }
    : undefined;
  return useHibiraServer(event).authorizeChannel(socket_id, channel_name, presence);
});
```

Send events from anywhere on the server:

```ts
await useHibiraServer(event).trigger('orders', 'order.created', order);
```

### Streaming LLM output

```ts
// server/api/ask.post.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export default defineEventHandler(async (event) => {
  const { conversationId, question } = await readBody(event);
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-5-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: question }],
  });
  const id = crypto.randomUUID();
  // Answer now; keep streaming to the channel in the background.
  event.waitUntil(
    streamToChannel(useHibiraServer(event), `private-conversation-${conversationId}`, stream, { id })
      .catch((err) => console.error('stream failed', err)),
  );
  return { id };
});
```

```vue
<script setup>
const props = defineProps({ conversationId: String });
const { text, done, error } = useStream(() => `private-conversation-${props.conversationId}`);
</script>

<template>
  <p :aria-busy="!done">{{ text }}<em v-if="error"> (stopped: {{ error }})</em></p>
</template>
```

`streamToChannel()` takes the Anthropic, OpenAI, Gemini and Vercel AI SDK
streams as they are, batches tokens into about ten events per second, and keeps
each event under the plan's message size. Everyone subscribed sees the
answer as it is written, and late joiners still get the whole text. Options
are in the [@hibira-io/vue README](https://github.com/hibira-io/vue#streaming-llm-output).

### Options

| Option | Default | |
| --- | --- | --- |
| `key` | `''` | app key; better set as `NUXT_PUBLIC_HIBIRA_KEY` |
| `host` | `'ws.hibira.io'` | the host on your app page; also used by `useHibiraServer()` |
| `port` | | for a local server |
| `tls` | `true` | `false` for a local server |
| `authEndpoint` | `'/api/hibira/auth'` | channel auth for private and presence channels |
| `userAuthEndpoint` | | user authentication (`pusher.signin()`) |
| `options` | `{}` | more [pusher-js options](https://github.com/pusher/pusher-js#configuration) (JSON) |

For options that need functions, such as a custom auth handler, use the
`hibira:options` hook in a client plugin that runs first:

```ts
// plugins/hibira.client.ts
export default defineNuxtPlugin({
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.hook('hibira:options', (options) => {
      options.channelAuthorization = { customHandler: myHandler };
    });
  },
});
```

## Nuxt 2

Nuxt 2.16 and later run on Vue 2.7, which `@hibira-io/vue` supports.

```sh
npm install @hibira-io/nuxt
```

```js
// nuxt.config.js
export default {
  modules: ['@hibira-io/nuxt/nuxt2'],
  hibira: { authEndpoint: '/api/hibira/auth' },
  publicRuntimeConfig: {
    hibira: { key: process.env.HIBIRA_KEY },
  },
};
```

Nuxt 2 has no auto-imports, so import the composables:

```vue
<script>
import { usePresence, useStream } from '@hibira-io/vue';

export default {
  props: { roomId: String },
  setup(props) {
    const { members, count } = usePresence(() => `presence-room-${props.roomId}`);
    const { text, done } = useStream(() => `private-ai-${props.roomId}`);
    return { members, count, text, done };
  },
};
</script>
```

For the auth endpoint and streaming, use the `pusher` package and
`streamToChannel` from `@hibira-io/vue/server` in your server middleware or
API backend. On Node 17 and later, Nuxt 2's webpack 4 needs
`NODE_OPTIONS=--openssl-legacy-provider`.

## Development

`npm test` runs the unit tests. `./test/fixtures.sh` packs the module and
builds the Nuxt 4, 3 and 2 apps in `test/fixtures`; its header says how to
run them in a browser against a local server.

## Licence

MIT
