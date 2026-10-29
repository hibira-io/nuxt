// Server utils, auto-imported in server/ routes.
import Pusher from 'pusher';
import { useRuntimeConfig } from '#imports';

let client = null;
let signature = '';

/**
 * A `pusher` (Node) client for the app in runtimeConfig: trigger events,
 * authorize channels, read channel info. Needs NUXT_HIBIRA_APP_ID and
 * NUXT_HIBIRA_SECRET (and NUXT_PUBLIC_HIBIRA_KEY) at runtime.
 */
export function useHibiraServer(event) {
  const config = useRuntimeConfig(event);
  const pub = config.public.hibira || {};
  const priv = config.hibira || {};
  const tls = (priv.tls ?? pub.tls) !== false;
  const settings = {
    appId: String(priv.appId || ''),
    key: String(pub.key || ''),
    secret: String(priv.secret || ''),
    host: priv.host || pub.host || 'ws.hibira.io',
    port: String(priv.port || pub.port || (tls ? 443 : 80)),
    useTLS: tls,
  };
  if (!settings.appId || !settings.key || !settings.secret) {
    throw new Error('Hibira: set NUXT_HIBIRA_APP_ID, NUXT_HIBIRA_SECRET and NUXT_PUBLIC_HIBIRA_KEY');
  }
  const next = JSON.stringify(settings);
  if (!client || next !== signature) {
    client = new Pusher(settings);
    signature = next;
  }
  return client;
}
