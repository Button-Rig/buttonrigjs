import type {
  DistributionTarget,
  RxFilePick,
  RxFilesPick,
  RxFolderPick,
  RxGetConfiguratorDefaultHeight,
  RxGetConfiguratorHeight,
  RxGetCurrentTarget,
  RxTakeScreenshot,
} from "../types/rxPayload.js";
import { addAppEventListener, appPostMessage } from "../utils.js";

/**
 * Takes a screenshot, saves it to app data dir and returns the asset url.
 * @returns The image url.
 */
export function takeScreenshot(): Promise<Uint8Array> {
  return new Promise((resolve) => {
    appPostMessage("takeScreenshot");
    addAppEventListener("takeScreenshot", (rxPayload) => {
      let payload = rxPayload as RxTakeScreenshot;
      resolve(payload.takeScreenshot.image);
    });
  });
}

/**
 * @returns the current DistributionTarget the app is running on.
 */
export function getCurrentTarget(): Promise<DistributionTarget> {
  return new Promise((resolve) => {
    appPostMessage("getCurrentTarget");
    addAppEventListener("getCurrentTarget", (rxPayload) => {
      let payload = rxPayload as RxGetCurrentTarget;
      resolve(payload.getCurrentTarget.target);
    });
  });
}

/**
 * @returns the default configurator height you have provided for this configurator in the plugin manifest.
 */
export function getConfiguratorDefaultHeight(): Promise<number> {
  return new Promise((resolve) => {
    appPostMessage("getConfiguratorDefaultHeight");
    addAppEventListener("getConfiguratorDefaultHeight", (rxPayload) => {
      let payload = rxPayload as RxGetConfiguratorDefaultHeight;
      resolve(payload.getConfiguratorDefaultHeight.height);
    });
  });
}

/**
 * Sets a custom configurator height.
 */
export function setConfiguratorHeight(height_in_px: number) {
  appPostMessage({
    setConfiguratorHeight: {
      height: height_in_px,
    },
  });
}

/**
 * Resets the configurator height to the value provided in the plugin manifest.
 */
export function resetConfiguratorHeight() {
  appPostMessage("resetConfiguratorHeight");
}

/**
 * @returns the current configurator height.
 */
export function getConfiguratorHeight(): Promise<number> {
  return new Promise((resolve) => {
    appPostMessage("getConfiguratorHeight");
    addAppEventListener("getConfiguratorHeight", (rxPayload) => {
      let payload = rxPayload as RxGetConfiguratorHeight;
      resolve(payload.getConfiguratorHeight.height);
    });
  });
}

/**
 * Sets and error message at the footer of the configurator.
 */
export function setError(error: string) {
  appPostMessage({
    error: {
      message: error,
    },
  });
}

/**
 * @param extensions - Eg: ["png", "jpg"]
 * @returns file path if a file is picked.
 */
export function pickFile(extensions: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    appPostMessage({
      pickFile: {
        extensions,
      },
    });
    addAppEventListener("filePick", (rxPayload) => {
      let payload = rxPayload as RxFilePick;
      resolve(payload.filePick.file);
    });
  });
}

/**
 * @param extensions - Eg: ["png", "jpg"]
 * @returns an array of all the file paths picked.
 */
export function pickFiles(extensions: string[]): Promise<string[]> {
  return new Promise((resolve) => {
    appPostMessage({
      pickFiles: {
        extensions,
      },
    });
    addAppEventListener("filesPick", (rxPayload) => {
      let payload = rxPayload as RxFilesPick;
      resolve(payload.filesPick.files);
    });
  });
}

/**
 * @returns folder path if a folder has been picked.
 */
export function pickFolder(): Promise<string | null> {
  return new Promise((resolve) => {
    appPostMessage("pickFolder");
    addAppEventListener("folderPick", (payload) => {
      let folderPickPayload = payload as RxFolderPick;
      resolve(folderPickPayload.folderPick.folder);
    });
  });
}
