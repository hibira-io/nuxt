// Example auth endpoint; a real app checks the signed-in user here.
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const name = getCookie(event, 'user') || 'alice';
  const pusher = useHibiraServer(event);
  const presence = String(body.channel_name).startsWith('presence-') ? { user_id: name, user_info: { name } } : undefined;
  return pusher.authorizeChannel(body.socket_id, body.channel_name, presence);
});
