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
  PluginKey,
  InstanceKey,
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

export function callHandler<T>(
  args: Array<string | PluginKey | InstanceKey>,
): Promise<CallHandlerResponse<T>> {
  return new Promise((resolve) => {
    postMessage({
      callHandler: {
        handlerArgs: args.map((x) => {
          if (x instanceof InstanceKey) {
            return x.into();
          } else if (x instanceof PluginKey) {
            return x.into();
          } else {
            return x;
          }
        }),
      },
    });
    addEventListener("callHandler", (rxPayload) => {
      let payload = rxPayload as RxCallHandler<T>;
      resolve(payload.callHandler);
    });
  });
}

export function getCurrentTarget(): Promise<DistributionTarget> {
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

export function saveHandlerArgs(args: Array<string | PluginKey | InstanceKey>) {
  postMessage({
    saveHandlerArgs: {
      handlerArgs: args.map((x) => {
        if (x instanceof InstanceKey) {
          return x.into();
        } else if (x instanceof PluginKey) {
          return x.into();
        } else {
          return x;
        }
      }),
    },
  });
}

export function loadHandlerArgs(
  fn: (handlerArgs: Array<string | PluginKey | InstanceKey>) => void,
) {
  addEventListener("loadHandlerArgs", (payload) => {
    let loadHandlerArgsPayload = payload as RxLoadHandlerArgs;
    fn(
      loadHandlerArgsPayload.loadHandlerArgs.handlerArgs.map((x) => {
        let y = PluginKey.from(x);
        if (typeof y === "string") {
          return InstanceKey.from(y);
        }
        return y;
      }),
    );
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

function addEventListener<T>(
  eventType: string,
  fn: (rxPayload: RxPayload<T>) => void,
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
    fn(event.data.event as RxPayload<T>);
  });
}

function postMessage(txPayload: TxPayload) {
  let message = newMessage(txPayload);
  window.parent.postMessage(message, "*");
}
