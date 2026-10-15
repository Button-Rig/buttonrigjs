/**
 * Placeholders are strings like `{{PLUGIN_KEY_VALUE_token}}` that the app replaces with the
 * real value right before it sends an action's config to the plugin server.
 *
 * The app walks every JSON string value of the config (at any depth):
 * - a string that is exactly one placeholder becomes the value,
 * - a placeholder inside a longer string is replaced in place.
 *
 * The classes below build these strings. They serialize into JSON string values, so they
 * can be put anywhere in the object passed to `saveConfig`:
 *
 * ```ts
 * saveConfig({ token: new PluginKey("token"), image: new InstanceFileName("crop.png") });
 * // stored as { "token": "{{PLUGIN_KEY_VALUE_token}}", "image": "{{INSTANCE_FILE_NAME_crop.png}}" }
 * saveConfig({ url: `https://example.com/?q=${new InstanceKey("query")}` });
 * // stored as { "url": "https://example.com/?q={{INSTANCE_KEY_VALUE_query}}" }
 * ```
 *
 * `loadConfig` returns these values as plain strings; turn them back with the static `from`
 * functions (or `parsePlaceholder`).
 */
abstract class Placeholder {
  /** @returns the placeholder string, e.g. `{{PLUGIN_KEY_VALUE_token}}`. */
  abstract into(): string;

  /** Same as `into()`, so the placeholder works inside template strings. */
  toString(): string {
    return this.into();
  }

  /** Same as `into()`, so `JSON.stringify` and `saveConfig` store the placeholder string. */
  toJSON(): string {
    return this.into();
  }
}

/** @returns the name inside `{{<prefix><name>}}` if `arg` is exactly one such placeholder. */
function matchPlaceholder(arg: unknown, prefix: string): string | null {
  if (typeof arg !== "string") {
    return null;
  }
  const start = "{{" + prefix;
  if (!arg.startsWith(start) || !arg.endsWith("}}")) {
    return null;
  }
  const name = arg.slice(start.length, -2);
  if (name.length === 0 || name.includes("{{") || name.includes("}}")) {
    return null;
  }
  return name;
}

const PLUGIN_KEY_VALUE = "PLUGIN_KEY_VALUE_";
const INSTANCE_KEY_VALUE = "INSTANCE_KEY_VALUE_";
const PLUGIN_FILE_NAME = "PLUGIN_FILE_NAME_";
const INSTANCE_FILE_NAME = "INSTANCE_FILE_NAME_";

/**
 * Represents a plugin key.
 *
 * Serializes to `{{PLUGIN_KEY_VALUE_yourKey}}`, which the app replaces with the plugin key value
 * when the action runs.
 */
export class PluginKey extends Placeholder {
  key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }

  into(): string {
    return "{{" + PLUGIN_KEY_VALUE + this.key + "}}";
  }

  /** @returns a `PluginKey` if `arg` is exactly a plugin key placeholder, otherwise `arg` unchanged. */
  static from<T>(arg: T): PluginKey | T {
    const key = matchPlaceholder(arg, PLUGIN_KEY_VALUE);
    return key !== null ? new PluginKey(key) : arg;
  }
}

/**
 * Represents an instance key.
 *
 * Serializes to `{{INSTANCE_KEY_VALUE_yourKey}}`, which the app replaces with the instance key
 * value when the action runs.
 */
export class InstanceKey extends Placeholder {
  key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }

  into(): string {
    return "{{" + INSTANCE_KEY_VALUE + this.key + "}}";
  }

  /** @returns an `InstanceKey` if `arg` is exactly an instance key placeholder, otherwise `arg` unchanged. */
  static from<T>(arg: T): InstanceKey | T {
    const key = matchPlaceholder(arg, INSTANCE_KEY_VALUE);
    return key !== null ? new InstanceKey(key) : arg;
  }
}

/**
 * Represents a plugin file name.
 *
 * Serializes to `{{PLUGIN_FILE_NAME_your_file_name}}`, which the app replaces with the complete
 * file path when the action runs.
 */
export class PluginFileName extends Placeholder {
  fileName: string;

  constructor(fileName: string) {
    super();
    this.fileName = fileName;
  }

  into(): string {
    return "{{" + PLUGIN_FILE_NAME + this.fileName + "}}";
  }

  /** @returns a `PluginFileName` if `arg` is exactly a plugin file placeholder, otherwise `arg` unchanged. */
  static from<T>(arg: T): PluginFileName | T {
    const fileName = matchPlaceholder(arg, PLUGIN_FILE_NAME);
    return fileName !== null ? new PluginFileName(fileName) : arg;
  }
}

/**
 * Represents an instance file name.
 *
 * Serializes to `{{INSTANCE_FILE_NAME_your_file_name}}`, which the app replaces with the complete
 * file path when the action runs.
 */
export class InstanceFileName extends Placeholder {
  fileName: string;

  constructor(fileName: string) {
    super();
    this.fileName = fileName;
  }

  into(): string {
    return "{{" + INSTANCE_FILE_NAME + this.fileName + "}}";
  }

  /** @returns an `InstanceFileName` if `arg` is exactly an instance file placeholder, otherwise `arg` unchanged. */
  static from<T>(arg: T): InstanceFileName | T {
    const fileName = matchPlaceholder(arg, INSTANCE_FILE_NAME);
    return fileName !== null ? new InstanceFileName(fileName) : arg;
  }
}

/** Any of the placeholder classes. */
export type AnyPlaceholder =
  | PluginKey
  | InstanceKey
  | PluginFileName
  | InstanceFileName;

/**
 * @returns the matching placeholder class if `arg` is exactly one placeholder string
 * (e.g. a value read with `loadConfig`), otherwise `arg` unchanged.
 */
export function parsePlaceholder<T>(arg: T): AnyPlaceholder | T {
  const parsers: Array<(x: T) => AnyPlaceholder | T> = [
    PluginKey.from,
    InstanceKey.from,
    PluginFileName.from,
    InstanceFileName.from,
  ];
  for (const parse of parsers) {
    const parsed = parse(arg);
    if (parsed !== arg) {
      return parsed;
    }
  }
  return arg;
}
