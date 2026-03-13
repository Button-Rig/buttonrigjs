export class ErrorPayload {
  error: {
    message: string | null;
  };

  constructor(message: string | null) {
    this.error = {
      message,
    };
  }
}

export interface Message {
  buttonPluginActionId: string;
  payload: TxPayload;
}

export function newMessage(payload: TxPayload): Message {
  return {
    buttonPluginActionId: window.name,
    payload: payload,
  };
}

export interface CallHandlerResponse {
  response: string;
  exitCode: number | null;
}

export enum DistributionTarget {
  Windows_X86_64 = "Windows_X86_64",
  Linux_X86_64 = "Linux_X86_64",
}

export type RxPayload =
  | RxFilePick
  | RxFilesPick
  | RxFolderPick
  | RxLoadHandlerArgs
  | RxCallHandler
  | RxGetPluginKeyValue
  | RxGetInstanceKeyValue
  | RxGetCurrentTarget
  | null;

export interface RxGetCurrentTarget {
  getCurrentTarget: {
    target: DistributionTarget | null;
  };
}

export interface RxGetInstanceKeyValue {
  getInstanceKeyValue: {
    value: string | null | undefined;
  };
}

export interface RxGetPluginKeyValue {
  getPluginKeyValue: {
    value: string | null | undefined;
  };
}

export interface RxCallHandler {
  callHandler: CallHandlerResponse;
}

export interface RxLoadHandlerArgs {
  loadHandlerArgs: {
    handlerArgs: string[];
  };
}

export interface RxFilePick {
  filePick: {
    file: string | null;
  };
}

export interface RxFilesPick {
  filesPick: {
    files: string[];
  };
}

export interface RxFolderPick {
  folderPick: {
    folder: string | null;
  };
}

export type TxPayload =
  | TxCallHandler
  | TxSavePluginKeyValue
  | TxRemovePluginKeyValue
  | TxGetPluginKeyValue
  | TxSaveInstanceKeyValue
  | TxRemoveInstanceKeyValue
  | TxGetInstanceKeyValue
  | TxGetCurrentTarget
  | TxSetConfiguratorHeight
  | TxPickFilePayload
  | TxPickFilesPayload
  | TxPickFolder
  | TxReadyToReceive
  | TxSaveHandlerArgsPayload
  | ErrorPayload;

export interface TxSetConfiguratorHeight {
  setConfiguratorHeight: {
    height: number;
  };
}

export interface TxGetInstanceKeyValue {
  getInstanceKeyValue: {
    key: string;
  };
}

export interface TxRemoveInstanceKeyValue {
  removeInstanceKeyValue: {
    key: string;
  };
}

export interface TxSaveInstanceKeyValue {
  saveInstanceKeyValue: {
    key: string;
    value: string;
  };
}

export interface TxGetPluginKeyValue {
  getPluginKeyValue: {
    key: string;
  };
}

export interface TxRemovePluginKeyValue {
  removePluginKeyValue: {
    key: string;
  };
}

export interface TxSavePluginKeyValue {
  savePluginKeyValue: {
    key: string;
    value: string;
  };
}

export interface TxCallHandler {
  callHandler: {
    handlerArgs: string[];
  };
}

export interface TxPickFilePayload {
  pickFile: {
    extensions: string[];
  };
}

export interface TxPickFilesPayload {
  pickFiles: {
    extensions: string[];
  };
}

export interface TxSaveHandlerArgsPayload {
  saveHandlerArgs: {
    handlerArgs: string[];
  };
}

export type TxReadyToReceive = "readyToReceive";
export type TxPickFolder = "pickFolder";
export type TxGetCurrentTarget = "getCurrentTarget";
