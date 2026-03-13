import {
  newMessage,
  type RxPayload,
  type TxPayload,
  type RxLoadHandlerArgs,
  type RxFilePick,
  type RxFolderPick,
  type RxFilesPick,
  type RxCallHandler,
  type CallHandlerResponse,
  type RxGetPluginKeyValue,
  type RxGetInstanceKeyValue,
  DistributionTarget,
  type RxGetCurrentTarget,
} from "./types.js";

export function getPluginKeyValue<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    postMessage({
      getPluginKeyValue: {
        key,
      },
    });
    addEventListener("getPluginKeyValue", (rxPayload) => {
      let payload = rxPayload as RxGetPluginKeyValue;
      if (
        payload.getPluginKeyValue.value !== null &&
        payload.getPluginKeyValue.value !== undefined
      ) {
        resolve(JSON.parse(payload.getPluginKeyValue.value) as T);
      } else {
        resolve(null);
      }
    });
  });
}

export function savePluginKeyValue<T>(key: string, value: T) {
  postMessage({
    savePluginKeyValue: {
      key,
      value: JSON.stringify(value),
    },
  });
}

export function removePluginKeyValue(key: string) {
  postMessage({
    removePluginKeyValue: {
      key,
    },
  });
}

export function getInstanceKeyValue<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    postMessage({
      getInstanceKeyValue: {
        key,
      },
    });

    addEventListener("getInstanceKeyValue", (rxPayload) => {
      const payload = rxPayload as RxGetInstanceKeyValue;
      if (
        payload.getInstanceKeyValue.value !== null &&
        payload.getInstanceKeyValue.value !== undefined
      ) {
        resolve(JSON.parse(payload.getInstanceKeyValue.value) as T);
      } else {
        resolve(null);
      }
    });
  });
}

export function saveInstanceKeyValue<T>(key: string, value: T) {
  postMessage({
    saveInstanceKeyValue: {
      key,
      value: JSON.stringify(value),
    },
  });
}

export function removeInstanceKeyValue(key: string) {
  postMessage({
    removeInstanceKeyValue: {
      key,
    },
  });
}

export function callHandler(args: string[]): Promise<CallHandlerResponse> {
  return new Promise((resolve) => {
    postMessage({
      callHandler: {
        handlerArgs: args,
      },
    });
    addEventListener("callHandler", (rxPayload) => {
      let payload = rxPayload as RxCallHandler;
      resolve(payload.callHandler);
    });
  });
}

export function getCurrentTarget(): Promise<DistributionTarget | null> {
  return new Promise((resolve) => {
    postMessage("getCurrentTarget");
    addEventListener("getCurrentTarget", (rxPayload) => {
      let payload = rxPayload as RxGetCurrentTarget;
      resolve(payload.getCurrentTarget.target);
    });
  });
}

export function setConfiguratorHeight(height_in_px: number) {
  postMessage({
    setConfiguratorHeight: {
      height: height_in_px,
    },
  });
}

export function setError(error: string) {
  postMessage({
    error: {
      message: error,
    },
  });
}

export function saveHandlerArgs(args: string[]) {
  postMessage({
    saveHandlerArgs: {
      handlerArgs: args,
    },
  });
}

export function loadHandlerArgs(fn: (handlerArgs: string[]) => void) {
  addEventListener("loadHandlerArgs", (payload) => {
    let loadHandlerArgsPayload = payload as RxLoadHandlerArgs;
    fn(loadHandlerArgsPayload.loadHandlerArgs.handlerArgs);
  });
  postMessage("readyToReceive");
}

export function pickFile(extensions: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    postMessage({
      pickFile: {
        extensions,
      },
    });
    addEventListener("filePick", (rxPayload) => {
      let payload = rxPayload as RxFilePick;
      resolve(payload.filePick.file);
    });
  });
}

export function pickFiles(extensions: string[]): Promise<string[]> {
  return new Promise((resolve) => {
    postMessage({
      pickFiles: {
        extensions,
      },
    });
    addEventListener("filesPick", (rxPayload) => {
      let payload = rxPayload as RxFilesPick;
      resolve(payload.filesPick.files);
    });
  });
}

export function pickFolder(): Promise<string | null> {
  return new Promise((resolve) => {
    postMessage("pickFolder");
    addEventListener("folderPick", (payload) => {
      let folderPickPayload = payload as RxFolderPick;
      resolve(folderPickPayload.folderPick.folder);
    });
  });
}

function addEventListener(
  eventType: string,
  fn: (rxPayload: RxPayload) => void,
) {
  window.addEventListener("message", (event) => {
    if (
      !(
        event.data.event == eventType ||
        Object.keys(event.data.event)[0] == eventType
      )
    ) {
      return;
    }
    fn(event.data.event as RxPayload);
  });
}

function postMessage(txPayload: TxPayload) {
  let message = newMessage(txPayload);
  window.parent.postMessage(message, "*");
}
