import type { AppTheme, RxGetTheme, RxThemeChanged } from "../types/rxPayload.js";
import { addAppEventListener, appPostMessageAndListen, isHosted } from "../utils.js";

/** How long `getTheme` waits for the app before it falls back. */
export const GET_THEME_TIMEOUT_MS = 1000;

/** The theme the page shows now: `data-br-theme` on `<html>`, else dark. */
function currentTheme(): AppTheme {
  const attribute =
    typeof document !== "undefined"
      ? document.documentElement?.getAttribute?.("data-br-theme")
      : null;
  return attribute === "light" ? "light" : "dark";
}

/**
 * The app's theme, `"dark"` or `"light"` (the app's "System" setting is resolved).
 *
 * Configurator and styler pages don't need this for styling: the app injects
 * `/__buttonrig/theme.css` and a script that sets `data-br-theme` on `<html>`, so the `--br-*`
 * tokens and `br-*` classes follow the theme by themselves. Use it for things CSS can't reach
 * (a canvas, a chart library).
 *
 * @returns the theme; outside the app, or when the app does not answer within 1 second, the
 * page's current `data-br-theme` (dark when unset).
 *
 * Available from `buttonrig` 2.2.
 */
export function getTheme(): Promise<AppTheme> {
  if (!isHosted()) {
    return Promise.resolve(currentTheme());
  }
  return new Promise((resolve) => {
    let done = false;
    const finish = (theme: AppTheme) => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(theme);
      }
    };
    const timer = setTimeout(() => finish(currentTheme()), GET_THEME_TIMEOUT_MS);
    appPostMessageAndListen("getTheme", "getTheme", (rxPayload) => {
      const payload = rxPayload as RxGetTheme;
      finish(payload.getTheme.theme === "light" ? "light" : "dark");
    });
  });
}

/**
 * Calls `fn` when the app's theme changes (pushed to configurator and styler pages).
 *
 * @returns a function that stops listening.
 *
 * Available from `buttonrig` 2.2.
 */
export function onThemeChange(fn: (theme: AppTheme) => void): () => void {
  if (!isHosted()) {
    return () => {};
  }
  return addAppEventListener(null, "themeChanged", (rxPayload) => {
    const payload = rxPayload as RxThemeChanged;
    fn(payload.themeChanged.theme === "light" ? "light" : "dark");
  });
}
