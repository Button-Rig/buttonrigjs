import type {
  RxGetWidgetContext,
  RxWidgetContextChanged,
  WidgetContext,
  WidgetSpan,
} from "../types/rxPayload.js";
import {
  addAppEventListener,
  appPostMessage,
  appPostMessageAndListen,
  isHosted,
} from "../utils.js";

/** Size of the widget page, reported by `onResize`. */
export interface WidgetSize {
  /** CSS pixels of the widget's iframe (`document.documentElement`). */
  width: number;
  height: number;
  /** `width / height` (1 when the height is 0). Wide > ~1.6, tall < ~0.6. */
  aspect: number;
  /** `width * height`. */
  area: number;
  /** Grid cells the button covers; `null` until the app answered `getWidgetContext`. */
  span: WidgetSpan | null;
}

/**
 * Where this widget page runs: its instance id, the button id (`null` in the editor preview of
 * a button that isn't saved yet), the span in grid cells and the mode (`"grid"` on the grid,
 * `"preview"` in the button editor, also for a widget's configurator).
 *
 * @returns `null` when the page is not running inside the app.
 */
export function getWidgetContext(): Promise<WidgetContext | null> {
  if (!isHosted()) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    appPostMessageAndListen("getWidgetContext", "getWidgetContext", (rxPayload) => {
      const payload = rxPayload as RxGetWidgetContext;
      resolve(payload.getWidgetContext.context ?? null);
    });
  });
}

/**
 * Calls `fn` whenever the widget's context changes, e.g. its span after the user resized the
 * button on the grid (the page is not reloaded).
 *
 * @returns a function that stops listening.
 */
export function onWidgetContextChange(fn: (context: WidgetContext) => void): () => void {
  if (!isHosted()) {
    return () => {};
  }
  return addAppEventListener(null, "widgetContextChanged", (rxPayload) => {
    const payload = rxPayload as RxWidgetContextChanged;
    fn(payload.widgetContextChanged.context);
  });
}

/** The current size of the page, with `span`. */
export function measureWidget(span: WidgetSpan | null): WidgetSize {
  const element = document.documentElement;
  const width = element.clientWidth;
  const height = element.clientHeight;
  return {
    width,
    height,
    aspect: height > 0 ? width / height : 1,
    area: width * height,
    span,
  };
}

/**
 * Calls `fn` with the widget's size now and every time it changes (a `ResizeObserver` on
 * `document.documentElement`), and when its span changes. Use it to lay the widget out
 * continuously: scale with `min(width, height)`, arrange by `aspect`, add optional parts when
 * they fit. Every widget must also render meaningfully at a 1x1 span.
 *
 * @returns a function that stops observing.
 */
export function onResize(fn: (size: WidgetSize) => void): () => void {
  let span: WidgetSpan | null = null;
  let stopped = false;
  const report = () => {
    if (!stopped) fn(measureWidget(span));
  };

  const ResizeObserverClass = (globalThis as { ResizeObserver?: typeof ResizeObserver })
    .ResizeObserver;
  const observer = ResizeObserverClass ? new ResizeObserverClass(() => report()) : null;
  observer?.observe(document.documentElement);

  const stopContext = onWidgetContextChange((context) => {
    span = context.span;
    report();
  });
  getWidgetContext().then((context) => {
    if (context) {
      span = context.span;
      report();
    }
  });
  report();

  return () => {
    stopped = true;
    observer?.disconnect();
    stopContext();
  };
}

let readySent = false;

/**
 * Tells the app that the widget has rendered its first real frame (live data, or the last
 * data it cached). Until then the app keeps the widget's iframe invisible behind a placeholder
 * (a snapshot of the last frame, if it has one) and fades the iframe in when it gets this
 * message, so the user never sees a blank or half-built page.
 *
 * Call it once, after the first paint of meaningful content; calling it again does nothing.
 * It is not sent automatically. A widget that never calls it is revealed by the app after a
 * timeout (about 2 seconds), so older pages and pages without the call still work.
 *
 * Does nothing outside the app.
 */
export function widgetReady(): void {
  if (readySent || !isHosted()) {
    return;
  }
  readySent = true;
  appPostMessage("widgetReady");
}
