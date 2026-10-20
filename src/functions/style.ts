import type { RxLoadStyle, RxStyleChanged, WidgetStyle } from "../types/rxPayload.js";
import {
  addAppEventListener,
  appPostMessage,
  appPostMessageAndListen,
  isHosted,
} from "../utils.js";

/** How long `loadStyle` waits for the app before it resolves `null` (an app older than 2.2). */
export const LOAD_STYLE_TIMEOUT_MS = 1000;

/**
 * Loads the style of this widget instance (the JSON your styler page saved with `saveStyle`).
 * Works in the styler page, the editor preview and the grid widget.
 *
 * @returns the saved style, `{}` when nothing has been saved yet, or `null` when the app does
 * not answer within 1 second (an app without widget styles: fall back to the style fields of
 * your config, if older versions of your plugin kept them there) and outside the app.
 *
 * Available from `buttonrig` 2.2.
 */
export function loadStyle<T extends object = WidgetStyle>(): Promise<T | null> {
  if (!isHosted()) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    let done = false;
    const finish = (style: T | null) => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(style);
      }
    };
    const timer = setTimeout(() => finish(null), LOAD_STYLE_TIMEOUT_MS);
    appPostMessageAndListen<T>("loadStyle", "loadStyle", (rxPayload) => {
      const payload = rxPayload as RxLoadStyle<T>;
      finish(payload.loadStyle.style ?? ({} as T));
    });
  });
}

/**
 * Saves the style of this widget instance. Only the styler page (`widgetConfig.stylerUrlPath`)
 * may save; the app ignores it from the preview and the grid widget. The app pushes the new
 * style to the preview and the grid widget (`onStyleChange`).
 *
 * @param style - A JSON object (theme, colours, sizes, ...). Placeholders are not resolved in
 * styles.
 *
 * Available from `buttonrig` 2.2.
 */
export function saveStyle<T extends object>(style: T) {
  appPostMessage({
    saveStyle: {
      style: JSON.parse(JSON.stringify(style)),
    },
  });
}

/**
 * Calls `fn` whenever the styler saved a new style for this instance (pushed to the editor
 * preview and the grid widget).
 *
 * @returns a function that stops listening.
 *
 * Available from `buttonrig` 2.2.
 */
export function onStyleChange<T extends object = WidgetStyle>(fn: (style: T) => void): () => void {
  if (!isHosted()) {
    return () => {};
  }
  return addAppEventListener<T>(null, "styleChanged", (rxPayload) => {
    const payload = rxPayload as RxStyleChanged<T>;
    fn(payload.styleChanged.style ?? ({} as T));
  });
}
