import type { Grid } from "./app.js";

export type RxPayload<T> =
  | RxFilePick
  | RxFilesPick
  | RxFolderPick
  | RxLoadConfig<T>
  | RxConfigChanged<T>
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
  | RxListGrids
  | RxGetWidgetContext
  | RxWidgetContextChanged
  | null;

/** Grid cells a widget button covers. */
export interface WidgetSpan {
  columns: number;
  rows: number;
}

/** `"grid"` on the grid, `"preview"` in the button editor. */
export type WidgetMode = "grid" | "preview";

export interface WidgetContext {
  instanceId: string;
  /** `null` in the editor preview of a button that isn't saved yet. */
  buttonId: number | null;
  span: WidgetSpan;
  mode: WidgetMode;
}

/** Answer to `"getWidgetContext"`. */
export interface RxGetWidgetContext {
  getWidgetContext: {
    context: WidgetContext;
  };
}

/** Pushed by the app when the widget's context changes (e.g. its span after a resize). */
export interface RxWidgetContextChanged {
  widgetContextChanged: {
    context: WidgetContext;
  };
}

export interface RxListGrids {
  listGrids: {
    response: {
      grids: Grid[];
    };
  };
}

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

/** Answer to `"loadConfig"`; `config` is `null` for a new instance. */
export interface RxLoadConfig<T> {
  loadConfig: {
    config: T | null;
  };
}

/** Pushed by the app when the instance's config changes (e.g. to a widget preview). */
export interface RxConfigChanged<T> {
  configChanged: {
    config: T | null;
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
