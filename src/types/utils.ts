import type { TxPayload } from "./txPayload.js";

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
  messageId: string;
  buttonPluginActionId: string;
  payload: TxPayload;
}

export function newMessage(messageId: string, payload: TxPayload): Message {
  return {
    messageId,
    buttonPluginActionId: window.name,
    payload: payload,
  };
}
