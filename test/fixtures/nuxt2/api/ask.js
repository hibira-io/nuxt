const pusher = require('./pusher');
module.exports = async (req, res) => {
  const { streamToChannel } = await import('@hibira-io/vue/server');
  async function* llm() {
    for (let i = 0; i < 50; i++) {
      await new Promise((r) => setTimeout(r, 5));
      yield { choices: [{ delta: { content: `t${i} ` } }] };
    }
  }
  const r = await streamToChannel(pusher, 'private-fx-ai', llm());
  await pusher.trigger('fx-public', 'ping', {});
  res.end(JSON.stringify({ events: r.events }));
};
