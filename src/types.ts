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

export class PluginKey {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  into(): string {
    return "{{PLUGIN_" + this.key + "}}";
  }

  static from(arg: string): PluginKey | string {
    const match = arg.match(/^{{PLUGIN_(.*)}}$/);
    let key = match ? (match[1] ? match[1] : null) : null;
    return key ? new PluginKey(key) : arg;
  }
}

export class InstanceKey {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  into(): string {
    return "{{INSTANCE_" + this.key + "}}";
  }

  static from(arg: string): InstanceKey | string {
    const match = arg.match(/^{{INSTANCE_(.*)}}$/);
    let key = match ? (match[1] ? match[1] : null) : null;
    return key ? new InstanceKey(key) : arg;
  }
}

export function newMessage(payload: TxPayload): Message {
  return {
    buttonPluginActionId: window.name,
    payload: payload,
  };
}

export interface CallHandlerResponse<T> {
  response: T;
  exitCode: number | null;
}

export enum DistributionTarget {
  Windows_X86_64 = "Windows_X86_64",
  Linux_X86_64 = "Linux_X86_64",
}

export type RxPayload<T> =
  | RxFilePick
  | RxFilesPick
  | RxFolderPick
  | RxLoadHandlerArgs
  | RxCallHandler<T>
  | RxGetPluginKeyValue
  | RxGetInstanceKeyValue
  | RxGetCurrentTarget
  | RxGetConfiguratorDefaultHeight
  | null;

export interface RxGetConfiguratorDefaultHeight {
  getConfiguratorDefaultHeight: {
    height: number;
  };
}

export interface RxGetCurrentTarget {
  getCurrentTarget: {
    target: DistributionTarget;
  };
}

export interface RxGetInstanceKeyValue {
  getInstanceKeyValue: {
    key: string;
    value: string | null | undefined;
  };
}

export interface RxGetPluginKeyValue {
  getPluginKeyValue: {
    key: string;
    value: string | null | undefined;
  };
}

export interface RxCallHandler<T> {
  callHandler: CallHandlerResponse<T>;
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
  | TxGetConfiguratorDefaultHeight
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
export type TxGetConfiguratorDefaultHeight = "getConfiguratorDefaultHeight";
