import type { RxPayload } from "./types/rxPayload.js";
import type { TxPayload } from "./types/txPayload.js";
import { newMessage } from "./types/utils.js";

export function addAppEventListener<T>(
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

export function appPostMessage(txPayload: TxPayload) {
  let message = newMessage(txPayload);
  window.parent.postMessage(message, "*");
}
