import type {
  RxGetInstanceKeyValue,
  RxGetPluginKeyValue,
} from "../types/rxPayload.js";
import { addAppEventListener, appPostMessage } from "../utils.js";

/**
 * This function can be used to get the plugin level key value that is available to all the instances of this plugin.
 * @param key - The key to the plugin key value.
 * @returns the value.
 */
export function getPluginKeyValue<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    appPostMessage({
      getPluginKeyValue: {
        key,
      },
    });
    addAppEventListener("getPluginKeyValue", (rxPayload) => {
      let payload = rxPayload as RxGetPluginKeyValue;
      if (payload.getPluginKeyValue.key == key) {
        if (
          payload.getPluginKeyValue.value !== null &&
          payload.getPluginKeyValue.value !== undefined
        ) {
          resolve(JSON.parse(payload.getPluginKeyValue.value) as T);
        } else {
          resolve(null);
        }
      }
    });
  });
}

/**
 * This function can be used to save plugin level key value which can be accessed by all instances of this plugin.
 * @param key - The key to the plugin key value.
 * @param value - The value to the plugin key value. The value can be any type.
 */
export function savePluginKeyValue<T>(key: string, value: T) {
  appPostMessage({
    savePluginKeyValue: {
      key,
      value: JSON.stringify(value),
    },
  });
}

/**
 * This function can be used to remove the plugin level key value.
 * @param key - The key to the plugin key value.
 */
export function removePluginKeyValue(key: string) {
  appPostMessage({
    removePluginKeyValue: {
      key,
    },
  });
}

/**
 * This function can be used to get the instance level key value that is available to only this instance.
 * @param key - The key to the plugin key value.
 * @returns the value.
 */
export function getInstanceKeyValue<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    appPostMessage({
      getInstanceKeyValue: {
        key,
      },
    });

    addAppEventListener("getInstanceKeyValue", (rxPayload) => {
      const payload = rxPayload as RxGetInstanceKeyValue;
      if (payload.getInstanceKeyValue.key == key) {
        if (
          payload.getInstanceKeyValue.value !== null &&
          payload.getInstanceKeyValue.value !== undefined
        ) {
          resolve(JSON.parse(payload.getInstanceKeyValue.value) as T);
        } else {
          resolve(null);
        }
      }
    });
  });
}

/**
 * This function can be used to save instance level key value which can only be accessed by a single instance.
 * @param key - The key to the plugin key value.
 * @param value - The value to the plugin key value. The value can be any type.
 */
export function saveInstanceKeyValue<T>(key: string, value: T) {
  appPostMessage({
    saveInstanceKeyValue: {
      key,
      value: JSON.stringify(value),
    },
  });
}

/**
 * This function can be used to remove the instance level key value.
 * @param key - The key to the plugin key value.
 */
export function removeInstanceKeyValue(key: string) {
  appPostMessage({
    removeInstanceKeyValue: {
      key,
    },
  });
}
