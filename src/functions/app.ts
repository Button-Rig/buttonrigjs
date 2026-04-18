import {
  DistributionTarget,
  type RxFilePick,
  type RxFilesPick,
  type RxFolderPick,
  type RxGetConfiguratorDefaultHeight,
  type RxGetConfiguratorHeight,
  type RxGetCurrentTarget,
  type RxTakeScreenshot,
} from "../types/rxPayload.js";
import {
  addAppEventListener,
  appPostMessage,
  appPostMessageAndListen,
} from "../utils.js";

/**
 * Takes a screenshot.
 * @returns the png byte array.
 */
export function takeScreenshot(): Promise<Uint8Array> {
  return new Promise((resolve) => {
    appPostMessageAndListen("takeScreenshot", "takeScreenshot", (rxPayload) => {
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
    appPostMessageAndListen(
      "getCurrentTarget",
      "getCurrentTarget",
      (rxPayload) => {
        let payload = rxPayload as RxGetCurrentTarget;
        resolve(payload.getCurrentTarget.target);
      },
    );
  });
}

/**
 * @returns the default configurator height you have provided for this configurator in the plugin manifest.
 */
export function getConfiguratorDefaultHeight(): Promise<number> {
  return new Promise((resolve) => {
    appPostMessageAndListen(
      "getConfiguratorDefaultHeight",
      "getConfiguratorDefaultHeight",
      (rxPayload) => {
        let payload = rxPayload as RxGetConfiguratorDefaultHeight;
        resolve(payload.getConfiguratorDefaultHeight.height);
      },
    );
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
    appPostMessageAndListen(
      "getConfiguratorHeight",
      "getConfiguratorHeight",
      (rxPayload) => {
        let payload = rxPayload as RxGetConfiguratorHeight;
        resolve(payload.getConfiguratorHeight.height);
      },
    );
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
    appPostMessageAndListen(
      {
        pickFile: {
          extensions,
        },
      },
      "filePick",
      (rxPayload) => {
        let payload = rxPayload as RxFilePick;
        resolve(payload.filePick.file);
      },
    );
  });
}

/**
 * @param extensions - Eg: ["png", "jpg"]
 * @returns an array of all the file paths picked.
 */
export function pickFiles(extensions: string[]): Promise<string[]> {
  return new Promise((resolve) => {
    appPostMessageAndListen(
      {
        pickFiles: {
          extensions,
        },
      },
      "filesPick",
      (rxPayload) => {
        let payload = rxPayload as RxFilesPick;
        resolve(payload.filesPick.files);
      },
    );
  });
}

/**
 * @returns folder path if a folder has been picked.
 */
export function pickFolder(): Promise<string | null> {
  return new Promise((resolve) => {
    appPostMessageAndListen("pickFolder", "folderPick", (payload) => {
      let folderPickPayload = payload as RxFolderPick;
      resolve(folderPickPayload.folderPick.folder);
    });
  });
}

/**
 * @returns a file path converted to a asset url.
 * /path/to/abc is turned to 
 * http://asset.localhost//path/to/abc in windows 
 * and
 * asset://asset.localhost//path/to/abc in linux 
 */
export function assetUrl(filePath: string): Promise<string> {
  return new Promise(async (resolve) => {
    let target = await getCurrentTarget();
    if (target == DistributionTarget.Windows_X86_64)  {
      resolve("http://asset.localhost/" + filePath);
    } else {
      resolve("asset://asset.localhost/" + filePath);
    }
  })
}