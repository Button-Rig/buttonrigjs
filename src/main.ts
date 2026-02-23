import {
  newMessage,
  type RxPayload,
  type TxPayload,
  ErrorPayload,
  newSaveHandlerArgs,
  RxLoadHandlerArgsPayload,
  RxFilePickPayload,
  RxFolderPickPayload,
  RxFilesPickPayload,
} from "./types.js";

export function saveHandlerArgs(args: string[] | ErrorPayload) {
  let txPayload: TxPayload;
  if (args instanceof ErrorPayload) {
    txPayload = args;
  } else {
    txPayload = newSaveHandlerArgs(args);
  }
  postMessage(txPayload);
}

export function loadHandlerArgs(fn: (handlerArgs: string[]) => void) {
  addEventListener("loadHandlerArgs", (payload) => {
    let loadHandlerArgsPayload = payload as RxLoadHandlerArgsPayload;
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
    addEventListener("filePick", (payload) => {
      let filePickPayload = payload as RxFilePickPayload;
      resolve(filePickPayload.filePick.file);
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
    addEventListener("filesPick", (payload) => {
      let filesPickPayload = payload as RxFilesPickPayload;
      resolve(filesPickPayload.filesPick.files);
    });
  });
}

export function pickFolder(): Promise<string | null> {
  return new Promise((resolve) => {
    postMessage("pickFolder");
    addEventListener("folderPick", (payload) => {
      let folderPickPayload = payload as RxFolderPickPayload;
      resolve(folderPickPayload.folderPick.folder);
    });
  });
}

function addEventListener(eventType: string, fn: (payload: RxPayload) => void) {
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

function postMessage(payload: TxPayload) {
  let message = newMessage(payload);
  window.parent.postMessage(message, "*");
}
