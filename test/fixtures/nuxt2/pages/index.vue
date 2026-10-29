<script>
import { ref } from 'vue';
import { useConnectionState, useEvent, usePresence, useStream } from '@hibira-io/vue';

export default {
  setup() {
    const state = useConnectionState();
    const { count, members } = usePresence('presence-fx');
    const { text, done } = useStream('private-fx-ai');
    const pings = ref(0);
    useEvent('fx-public', 'ping', () => pings.value++);
    const ask = () => fetch('/api/ask', { method: 'POST' });
    return { state, count, members, text, done, pings, ask, user: 'x' };
  },
};
</script>

<template>
  <main>
    <p id="state">{{ state }}</p>
    <p id="count">{{ count }}</p>
    <p id="names">{{ members.map((m) => m.info && m.info.name).join(',') }}</p>
    <p id="pings">{{ pings }}</p>
    <p id="text">{{ text }}</p>
    <p id="done">{{ done }}</p>
    <button id="ask" @click="ask">ask</button>
  </main>
</template>
