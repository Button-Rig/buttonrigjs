/**
 * Header the app's `/api` proxy requires on every HTTP request. It forces a CORS preflight
 * for cross-origin callers (which the proxy never answers), so other local web pages can't
 * use the proxy. `api` adds it for you.
 */
export const PLUGIN_HEADER = "X-Buttonrig-Plugin";

/** Path prefix under which the app proxies your plugin server's routes. */
export const API_PREFIX = "/api";

/** @returns `/api` + `path`, with exactly one `/` in between. */
export function apiPath(path: string): string {
  return API_PREFIX + (path.startsWith("/") ? path : "/" + path);
}

/**
 * `fetch` against your plugin server, through the app's proxy on the page's own origin.
 * The path is prefixed with `/api` (which the proxy strips again) and the `X-Buttonrig-Plugin`
 * header is added. The proxy adds the server's auth token.
 *
 * @param path - A route of your plugin server, e.g. `"/applications"` or `"/status?verbose=1"`.
 * @param init - Same as `fetch`'s second argument.
 *
 * Eg: `const apps = await (await api("/applications")).json();`
 *
 * Eg: `await api("/open-system-monitor", { method: "POST" });`
 */
export function api(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set(PLUGIN_HEADER, "1");
  return fetch(apiPath(path), { ...init, headers });
}

/**
 * Opens a WebSocket to your plugin server, through the app's proxy on the page's own origin
 * (`ws://<origin>/api<path>`). The proxy adds the server's auth token.
 *
 * @param path - A WebSocket route of your plugin server, e.g. `"/ws/metrics/cpu?interval=1000"`.
 * @param protocols - Optional subprotocols (`Sec-WebSocket-Protocol`), forwarded to your server.
 */
export function apiSocket(path: string, protocols?: string | string[]): WebSocket {
  const scheme = location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${scheme}//${location.host}${apiPath(path)}`;
  return protocols === undefined
    ? new WebSocket(url)
    : new WebSocket(url, protocols);
}
