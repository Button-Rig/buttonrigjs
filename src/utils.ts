import type { RxPayload } from "./types/rxPayload.js";
import type { TxPayload } from "./types/txPayload.js";
import { newMessage } from "./types/utils.js";
import { v4 } from "../node_modules/uuid/dist/index.js";

export function addAppEventListener<T>(
  messageId: string | null,
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

    if (messageId != null && event.data.messageId != messageId) {
      return;
    }

    fn(event.data.event as RxPayload<T>);
  });
}

export function appPostMessage(txPayload: TxPayload): string {
  let id = v4();
  let message = newMessage(id, txPayload);
  window.parent.postMessage(message, "*");
  return id;
}

export function appPostMessageAndListen<T>(
  txPayload: TxPayload,
  eventType: string,
  fn: (rxPayload: RxPayload<T>) => void,
) {
  let messageId = appPostMessage(txPayload);
  addAppEventListener(messageId, eventType, fn);
}
