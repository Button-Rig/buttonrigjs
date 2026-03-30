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
  | RxGetConfiguratorHeight
  | RxGetInstanceFile
  | RxGetPluginFile
  | RxGetInstanceFilePath
  | RxGetPluginFilePath
  | RxTakeScreenshot
  | null;

export interface RxTakeScreenshot {
  takeScreenshot: {
    image: Uint8Array;
  };
}

export interface RxGetPluginFilePath {
  getPluginFilePath: {
    fileName: string;
    filePath: string;
  };
}

export interface RxGetInstanceFilePath {
  getInstanceFilePath: {
    fileName: string;
    filePath: string;
  };
}

export interface RxGetPluginFile {
  getPluginFile: {
    fileName: string;
    content: Uint8Array;
  };
}

export interface RxGetInstanceFile {
  getInstanceFile: {
    fileName: string;
    content: Uint8Array;
  };
}

export interface RxGetConfiguratorHeight {
  getConfiguratorHeight: {
    height: number;
  };
}

export interface RxGetConfiguratorDefaultHeight {
  getConfiguratorDefaultHeight: {
    height: number;
  };
}

export enum DistributionTarget {
  Windows_X86_64 = "Windows_X86_64",
  Linux_X86_64 = "Linux_X86_64",
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

export interface CallHandlerResponse<T> {
  response: T;
  exitCode: number | null;
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
