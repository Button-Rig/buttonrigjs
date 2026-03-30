import type {
  RxGetInstanceFile,
  RxGetInstanceFilePath,
  RxGetPluginFile,
  RxGetPluginFilePath,
} from "../main.js";
import { addAppEventListener, appPostMessage } from "../utils.js";

/**
 * The files fetched using this function belongs to the action configurator instance.
 * Files outside the action configurator cannot be accessed by this function.
 * @param fileName - Eg: "crop.png"
 * @returns the binary data of the file.
 */
export function getInstanceFile(fileName: string): Promise<Uint8Array> {
  return new Promise((resolve) => {
    appPostMessage({
      getInstanceFile: {
        fileName,
      },
    });

    addAppEventListener("getInstanceFile", (rxPayload) => {
      let payload = rxPayload as RxGetInstanceFile;
      if (payload.getInstanceFile.fileName == fileName) {
        resolve(payload.getInstanceFile.content);
      }
    });
  });
}

/**
 * The files fetched using this function belongs to the plugin.
 * The files accessed using this function are shared by all instances of this plugin.
 * @param fileName - Eg: "crop.png"
 * @returns the binary data of the file.
 */
export function getPluginFile(fileName: string): Promise<Uint8Array> {
  return new Promise((resolve) => {
    appPostMessage({
      getPluginFile: {
        fileName,
      },
    });

    addAppEventListener("getPluginFile", (rxPayload) => {
      let payload = rxPayload as RxGetPluginFile;
      if (payload.getPluginFile.fileName == fileName) {
        resolve(payload.getPluginFile.content);
      }
    });
  });
}

/**
 * The file paths fetched using this function belongs to the action configurator instance.
 * File paths outside the action configurator cannot be accessed by this function.
 * @param fileName - Eg: "Database.db"
 * @returns the complete file path. Eg: "/home/MyUser/.local/share/com.buttonrig.app/plugins/data/MyAuthor/MyPlugin_instances/Database.db"
 */
export function getInstanceFilePath(fileName: string): Promise<string> {
  return new Promise((resolve) => {
    appPostMessage({
      getInstanceFilePath: {
        fileName,
      },
    });

    addAppEventListener("getInstanceFilePath", (rxPayload) => {
      let payload = rxPayload as RxGetInstanceFilePath;
      if (payload.getInstanceFilePath.fileName == fileName) {
        resolve(payload.getInstanceFilePath.filePath);
      }
    });
  });
}

/**
 * The file paths fetched using this function belongs to the plugin.
 * The file paths accessed using this function are shared by all instances of this plugin.
 * @param fileName - Eg: "Database.db"
 * @returns the complete file path. Eg: "/home/MyUser/.local/share/com.buttonrig.app/plugins/data/MyAuthor/MyPlugin/Database.db"
 */
export function getPluginFilePath(fileName: string): Promise<string> {
  return new Promise((resolve) => {
    appPostMessage({
      getPluginFilePath: {
        fileName,
      },
    });

    addAppEventListener("getPluginFilePath", (rxPayload) => {
      let payload = rxPayload as RxGetPluginFilePath;
      if (payload.getPluginFilePath.fileName == fileName) {
        resolve(payload.getPluginFilePath.filePath);
      }
    });
  });
}

/**
 * Deletes a file that belongs to this instance.
 * @param fileName - Eg: "Database.db"
 */
export function deleteInstanceFile(fileName: string) {
  appPostMessage({
    deleteInstanceFile: {
      fileName,
    },
  });
}

/**
 * Deletes a file that belongs to this plugin.
 * @param fileName - Eg: "Database.db"
 */
export function deletePluginFile(fileName: string) {
  appPostMessage({
    deletePluginFile: {
      fileName,
    },
  });
}

/**
 * The file saved using this function belongs to the action configurator instance.
 * This file cannot be accessed from outside this action configurator.
 * @param fileName - Eg: "crop.png"
 * @param content - Binary data of your file.
 */
export function saveInstanceFile(fileName: string, content: Uint8Array) {
  appPostMessage({
    saveInstanceFile: {
      fileName,
      content,
    },
  });
}

/**
 * The file saved using this function belongs to this plugin alone.
 * This file can be accessed from all instances of this plugin.
 * @param fileName - Eg: "crop.png"
 * @param content - Binary data of your file.
 */
export function savePluginFile(fileName: string, content: Uint8Array) {
  appPostMessage({
    savePluginFile: {
      fileName,
      content,
    },
  });
}
