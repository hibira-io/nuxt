const pusher = require('./pusher');
module.exports = (req, res) => {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    const body = Object.fromEntries(new URLSearchParams(raw));
    const name = (/user=(\w+)/.exec(req.headers.cookie || '') || [])[1] || 'alice';
    const presence = body.channel_name.startsWith('presence-') ? { user_id: name, user_info: { name } } : undefined;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(pusher.authorizeChannel(body.socket_id, body.channel_name, presence)));
  });
};
