/**
 * Represents a plugin key.
 *
 * This is a simple wrapper which evaluates to `{{PLUGIN_KEY_VALUE_yourKey}}`
 * The evaluated value will be replaced by the actual value when the args are passed to the handler.
 */
export class PluginKey {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  into(): string {
    return "{{PLUGIN_KEY_VALUE_" + this.key + "}}";
  }

  static from(arg: string): PluginKey | string {
    const match = arg.match(/^{{PLUGIN_KEY_VALUE_(.*)}}$/);
    let key = match ? (match[1] ? match[1] : null) : null;
    return key ? new PluginKey(key) : arg;
  }
}

/**
 * Represents an instance key.
 *
 * This is a simple wrapper which evaluates to `{{INSTANCE_KEY_VALUE_yourKey}}`
 * The evaluated value will be replaced by the actual value when the args are passed to the handler.
 */
export class InstanceKey {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  into(): string {
    return "{{INSTANCE_KEY_VALUE_" + this.key + "}}";
  }

  static from(arg: string): InstanceKey | string {
    const match = arg.match(/^{{INSTANCE_KEY_VALUE_(.*)}}$/);
    let key = match ? (match[1] ? match[1] : null) : null;
    return key ? new InstanceKey(key) : arg;
  }
}

/**
 * Represents a plugin file name.
 *
 * This is a simple wrapper which evaluates to `{{PLUGIN_FILE_NAME_your_file_name}}`
 * The evaluated value will be replaced by the complete file path when the args are passed to the handler.
 */
export class PluginFileName {
  fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  into(): string {
    return "{{PLUGIN_FILE_NAME_" + this.fileName + "}}";
  }

  static from(arg: string): PluginKey | string {
    const match = arg.match(/^{{PLUGIN_FILE_NAME_(.*)}}$/);
    let key = match ? (match[1] ? match[1] : null) : null;
    return key ? new PluginKey(key) : arg;
  }
}

/**
 * Represents an Instance file name.
 *
 * This is a simple wrapper which evaluates to `{{INSTANCE_FILE_NAME_your_file_name}}`
 * The evaluated value will be replaced by the complete file path when the args are passed to the handler.
 */
export class InstanceFileName {
  fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  into(): string {
    return "{{INSTANCE_FILE_NAME_" + this.fileName + "}}";
  }

  static from(arg: string): PluginKey | string {
    const match = arg.match(/^{{INSTANCE_FILE_NAME_(.*)}}$/);
    let key = match ? (match[1] ? match[1] : null) : null;
    return key ? new PluginKey(key) : arg;
  }
}
