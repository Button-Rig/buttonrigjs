import type { RxPayload } from "./types/rxPayload.js";
import type { TxPayload } from "./types/txPayload.js";
import { newMessage } from "./types/utils.js";
import { v4 } from "uuid";

/** @returns the event name of an app -> iframe event (`"x"` or the single key of `{ x: ... }`). */
function eventName(event: unknown): string | undefined {
  if (typeof event === "string") {
    return event;
  }
  if (event !== null && typeof event === "object") {
    return Object.keys(event)[0];
  }
  return undefined;
}

/**
 * Listens for app -> iframe events of type `eventType`. Only messages from the parent window
 * (the app) are considered. With a `messageId`, only the answer to that request is passed on.
 * @returns a function that removes the listener.
 */
export function addAppEventListener<T>(
  messageId: string | null,
  eventType: string,
  fn: (rxPayload: RxPayload<T>) => void,
): () => void {
  const listener = (event: MessageEvent) => {
    if (event.source !== window.parent) {
      return;
    }
    const data = event.data;
    if (data === null || typeof data !== "object") {
      return;
    }
    if (eventName(data.event) !== eventType) {
      return;
    }
    if (messageId != null && data.messageId != messageId) {
      return;
    }

    fn(data.event as RxPayload<T>);
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}

export function appPostMessage(txPayload: TxPayload): string {
  let id = v4();
  let message = newMessage(id, txPayload);
  window.parent.postMessage(message, "*");
  return id;
}

/** Sends a request to the app and calls `fn` once with its answer (same `messageId`). */
export function appPostMessageAndListen<T>(
  txPayload: TxPayload,
  eventType: string,
  fn: (rxPayload: RxPayload<T>) => void,
) {
  let messageId = appPostMessage(txPayload);
  const remove = addAppEventListener<T>(messageId, eventType, (payload) => {
    remove();
    fn(payload);
  });
}

/** True when the page runs inside the app (an iframe), not opened directly in a browser tab. */
export function isHosted(): boolean {
  return typeof window !== "undefined" && window.parent !== window;
}
