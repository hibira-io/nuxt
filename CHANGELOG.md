# Changelog

## 0.2.0

- Encrypted channels: `encrypted: true` loads the pusher-js build that can
  decrypt `private-encrypted-` channels (only then, as a separate chunk),
  and `NUXT_HIBIRA_ENCRYPTION_MASTER_KEY` makes `useHibiraServer()`
  encrypt and authorize them. Nuxt 3, 4 and 2.
- Needs @hibira-io/vue 0.3.0.

## 0.1.2

- README: cover image and screenshots.

## 0.1.1

The package homepage on npm now links to https://hibira.io. No code changes.

## 0.1.0

First release: a Nuxt 3 and 4 module (auto-imported @hibira-io/vue
composables, client-only plugin, `useHibiraServer()` and `streamToChannel()`
in server routes, `hibira:options` hook) and a Nuxt 2 module.
