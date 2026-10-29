import type { NuxtModule } from '@nuxt/schema';
import type { Options } from 'pusher-js';
import type Pusher from 'pusher';

export interface ModuleOptions {
  /** App key from the Hibira portal (public). Runtime: NUXT_PUBLIC_HIBIRA_KEY. */
  key?: string;
  /** WebSocket and HTTP API host, default "ws.hibira.io". Runtime: NUXT_PUBLIC_HIBIRA_HOST. */
  host?: string;
  /** Port, for a local server. */
  port?: number;
  /** TLS, default true. */
  tls?: boolean;
  /** Channel auth endpoint for private and presence channels, default "/api/hibira/auth". */
  authEndpoint?: string;
  /** User authentication endpoint (pusher.signin()), off by default. */
  userAuthEndpoint?: string;
  /** More pusher-js options (JSON only; use the hibira:options hook for functions). */
  options?: Partial<Options>;
  /** Server only. Better set at runtime: NUXT_HIBIRA_APP_ID. */
  appId?: string;
  /** Server only. Set at runtime: NUXT_HIBIRA_SECRET. Never commit it. */
  secret?: string;
}

declare const module: NuxtModule<ModuleOptions>;
export default module;

declare module '#app' {
  interface RuntimeNuxtHooks {
    /** Change pusher-js options before the connection is created (in the browser). */
    'hibira:options': (options: Partial<Options>) => void | Promise<void>;
  }
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    hibira?: ModuleOptions;
  }
  interface PublicRuntimeConfig {
    hibira: Omit<ModuleOptions, 'appId' | 'secret'>;
  }
  interface RuntimeConfig {
    hibira: { appId: string; secret: string; host?: string; port?: number; tls?: boolean };
  }
}

export type HibiraServer = Pusher;
