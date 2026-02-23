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

export type TxPayload =
  | TxPickFilePayload
  | TxPickFilesPayload
  | TxPickFolder
  | TxReadyToReceive
  | TxSaveHandlerArgsPayload
  | ErrorPayload;

export interface TxPickFilePayload {
  pickFile: {
    extensions: string[];
  };
}

export interface TxPickFilesPayload {
  pickFiles: {
    extensions: string[];
  }
}

export function newSaveHandlerArgs(
  handlerArgs: string[]
): TxSaveHandlerArgsPayload {
  return {
    saveHandlerArgs: {
      handlerArgs,
    },
  };
}

export type RxPayload =
  | RxFilePickPayload
  | RxFilesPickPayload
  | RxFolderPickPayload
  | RxLoadHandlerArgsPayload
  | null;

export class RxLoadHandlerArgsPayload {
  loadHandlerArgs: {
    handlerArgs: string[];
  };

  constructor(handlerArgs: string[]) {
    this.loadHandlerArgs = {
      handlerArgs,
    };
  }
}

export class RxFilePickPayload {
  filePick: {
    file: string | null;
  };

  constructor() {
    this.filePick = {
      file: null,
    };
  }
}

export class RxFilesPickPayload {
  filesPick: {
    files: string[];
  };

  constructor() {
    this.filesPick = {
      files: [],
    };
  }
}

export class RxFolderPickPayload {
  folderPick: {
    folder: string | null;
  };

  constructor() {
    this.folderPick = {
      folder: null,
    };
  }
}

export interface TxSaveHandlerArgsPayload {
  saveHandlerArgs: {
    handlerArgs: string[];
  };
}

export type TxReadyToReceive = "readyToReceive";
export type TxPickFolder = "pickFolder";
