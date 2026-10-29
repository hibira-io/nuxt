const Pusher = require('pusher');
module.exports = new Pusher({ appId: process.env.HIBIRA_APP_ID, key: process.env.HIBIRA_KEY, secret: process.env.HIBIRA_SECRET, host: '127.0.0.1', port: '8080', useTLS: false });
