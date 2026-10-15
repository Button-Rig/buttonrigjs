import type { RxConfigChanged, RxLoadConfig } from "../types/rxPayload.js";
import {
  addAppEventListener,
  appPostMessage,
  appPostMessageAndListen,
  isHosted,
} from "../utils.js";

/**
 * Converts a config into plain JSON data, the way it is stored by the app.
 *
 * Placeholder classes (`PluginKey`, `InstanceKey`, `PluginFileName`, `InstanceFileName`)
 * become their placeholder strings, wherever they are in the object. Everything else follows
 * `JSON.stringify` rules: `undefined` and functions are dropped, `Date`s become ISO strings,
 * objects with `toJSON` use it. Throws on circular references and `BigInt`s.
 */
export function serializeConfig<T>(config: T): unknown {
  const json = JSON.stringify(config);
  return json === undefined ? null : JSON.parse(json);
}

/**
 * Saves the config of this action instance. The app stores it and, when the button runs,
 * sends it to your plugin server as the `config` of `POST /actions/{urlPath}`, after replacing
 * placeholders in its string values.
 *
 * @param config - Any JSON-serializable value, usually an object. Placeholder classes can be
 * used anywhere in it.
 *
 * Eg: `saveConfig({ x: 234, y: 234 })`
 *
 * Eg: `saveConfig({ image: new InstanceFileName("crop.png"), token: new PluginKey("token") })`
 */
export function saveConfig<T>(config: T) {
  appPostMessage({
    saveConfig: {
      config: serializeConfig(config),
    },
  });
}

/**
 * Loads the config previously saved with `saveConfig` for this instance.
 *
 * @returns the saved config, or `null` for a new instance (and when the page is not running
 * inside the app). Placeholders come back as plain strings; use `parsePlaceholder` or the
 * classes' `from` functions to turn them back into objects.
 *
 * A button saved before manifest v2 returns `{ legacyArgs: string[] }` (its old handler args).
 * Convert it to your new config shape, so the next `saveConfig` upgrades the button.
 */
export function loadConfig<T>(): Promise<T | null> {
  if (!isHosted()) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    appPostMessageAndListen("loadConfig", "loadConfig", (rxPayload) => {
      const payload = rxPayload as RxLoadConfig<T>;
      resolve(payload.loadConfig.config ?? null);
    });
  });
}

/**
 * Calls `fn` whenever the app pushes a new config for this instance, e.g. to a widget
 * preview while its configurator is being edited.
 *
 * @returns a function that stops listening.
 */
export function onConfigChange<T>(fn: (config: T | null) => void): () => void {
  if (!isHosted()) {
    return () => {};
  }
  return addAppEventListener<T>(null, "configChanged", (rxPayload) => {
    const payload = rxPayload as RxConfigChanged<T>;
    fn(payload.configChanged.config ?? null);
  });
}
