import type { ErrorPayload } from "./utils.js";

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
  | TxSavePluginFile
  | TxDeletePluginFile
  | TxGetPluginFile
  | TxSaveInstanceFile
  | TxDeleteInstanceFile
  | TxGetInstanceFile
  | TxGetPluginFilePath
  | TxGetInstanceFilePath
  | TxResetConfiguratorHeight
  | TxGetConfiguratorHeight
  | TxConsoleLog
  | TxConsoleLogWarning
  | TxConsoleLogError
  | TxTakeScreenshot
  | TxListGrids
  | ErrorPayload;

export interface TxConsoleLogError {
  consoleLogError: {
    log: string;
  };
}

export interface TxConsoleLogWarning {
  consoleLogWarning: {
    log: string;
  };
}

export interface TxConsoleLog {
  consoleLog: {
    log: string;
  };
}

export interface TxGetInstanceFilePath {
  getInstanceFilePath: {
    fileName: string;
  };
}

export interface TxGetPluginFilePath {
  getPluginFilePath: {
    fileName: string;
  };
}

export interface TxSavePluginFile {
  savePluginFile: {
    fileName: string;
    content: Uint8Array;
  };
}

export interface TxDeletePluginFile {
  deletePluginFile: {
    fileName: string;
  };
}

export interface TxGetPluginFile {
  getPluginFile: {
    fileName: string;
  };
}

//

export interface TxSaveInstanceFile {
  saveInstanceFile: {
    fileName: string;
    content: Uint8Array;
  };
}

export interface TxDeleteInstanceFile {
  deleteInstanceFile: {
    fileName: string;
  };
}

export interface TxGetInstanceFile {
  getInstanceFile: {
    fileName: string;
  };
}

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
export type TxGetConfiguratorHeight = "getConfiguratorHeight";
export type TxResetConfiguratorHeight = "resetConfiguratorHeight";
export type TxTakeScreenshot = "takeScreenshot";
export type TxListGrids = "listGrids";
