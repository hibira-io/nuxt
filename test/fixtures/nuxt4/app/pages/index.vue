<script setup lang="ts">
const route = useRoute();
const user = String(route.query.user || 'alice');
const state = useConnectionState();
const { count, members } = usePresence('presence-fx');
const { text, done } = useStream('private-fx-ai');
const pings = ref(0);
const timeout = ref(0);
onMounted(() => (timeout.value = usePusher()?.config.activityTimeout ?? 0));
useEvent('fx-public', 'ping', () => pings.value++);
async function ask() {
  await $fetch('/api/ask', { method: 'POST' });
}
</script>

<template>
  <main>
    <p id="state">{{ state }}</p>
    <p id="count">{{ count }}</p>
    <p id="names">{{ members.map((m) => m.info?.name).join(',') }}</p>
    <p id="timeout">{{ timeout }}</p>
    <p id="pings">{{ pings }}</p>
    <p id="text">{{ text }}</p>
    <p id="done">{{ done }}</p>
    <button id="ask" @click="ask">ask {{ user }}</button>
  </main>
</template>
