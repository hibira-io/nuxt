export default defineEventHandler(async (event) => {
  async function* llm() {
    for (let i = 0; i < 50; i++) {
      await new Promise((r) => setTimeout(r, 5));
      yield { type: 'content_block_delta', delta: { type: 'text_delta', text: `t${i} ` } };
    }
  }
  const res = await streamToChannel(useHibiraServer(event), 'private-fx-ai', llm(), { meta: { model: 'fx' } });
  await useHibiraServer(event).trigger('fx-public', 'ping', {});
  return { id: res.id, events: res.events };
});
