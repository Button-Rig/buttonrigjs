# AGENTS.md: buttonrigjs

The `buttonrig` npm package (currently 2.2.0, TypeScript, ESM): the SDK that plugin pages (configurators and widget pages) use to talk to the Button Rig app and to their own plugin server. It talks to the app over the iframe `postMessage` bridge and to the plugin server through the app-run web origin (`api(path)`, `apiSocket(path)`). Work happens on branch `main` (`feature/refactor` during the UI redesign). 2.x is not published to npm yet.

## How it fits
- Wire format is defined by the app: `app/buttonrig-ui/src/utils/plugin/{rx,tx}_post_message.rs`, `widget_frames.rs`; protocol summary in `app/AGENTS.md` ("postMessage protocol"). SDK message types: `src/types/{rxPayload,txPayload}.ts`. Changing a message needs the app and the SDK changed together.
- Consumers: every plugin in `plugins/` (`"buttonrig": "file:../../../../buttonrigjs"` (from `plugins/buttonrig/<Name>/plugin-src`, verified) until published; they need `dist/` built, so run `npm run build` here first).
- Docs: `docs.buttonrig.com/content/1. plugins/3. SDK Reference/` has one page per function. Any public API change must update the matching page and the "SDK reference" section of `plugins/AGENTS.md` (Plugin authoring guide).

## Layout
- `src/main.ts`: public exports. `src/utils.ts`: shared helpers.
- `src/functions/`: `config.ts` (saveConfig, loadConfig, onConfigChange, placeholders), `widget.ts` (getWidgetContext, onWidgetContextChange, onResize, widgetReady), `server.ts` (api, apiSocket), `keyValue.ts`, `file.ts`, `app.ts` (assetUrl, listGrids, setError, `setSummary`, configurator height, ...), `style.ts` (`loadStyle`, `saveStyle`, `onStyleChange`, `LOAD_STYLE_TIMEOUT_MS`), `theme.ts` (`getTheme`, `onThemeChange`, `GET_THEME_TIMEOUT_MS`).
- `src/types/`: payload types and `placeholder.ts` (PluginKey, InstanceKey, PluginFileName, InstanceFileName).
- `test/sdk.test.mjs`: node:test unit tests (23, run against `dist`; the last one runs `scripts/sync-theme.sh --check` and is skipped when the app checkout is not next to this repo).
- `theme.css` + `fonts/` (IBM Plex woff2): the app's plugin theme for standalone development, exported as `buttonrig/theme.css` (listed in `files`). **Generated, do not edit**: `scripts/sync-theme.sh` rebuilds them from the app (the `br-tokens` block of `app/buttonrig-ui/style.css` with `data-theme` -> `data-br-theme`, its `@font-face` rules, then `app/infrastructure/src/services/plugin_web_server/components.css`) exactly like the app builds `/__buttonrig/theme.css`. Run `npm run sync-theme` (or `scripts/sync-theme.sh [APP_DIR]`; `$BUTTONRIG_APP_DIR`, default `../app`) **whenever the app's token block, font faces or `components.css` change**; `--check` only compares and exits 1 when stale.
- `dist/`: build output, gitignored (but `files` in package.json ships `dist` and `src`).

## Commands
- `npm run build`: `clean` + `tsc` (verified).
- `npm test`: build, then `node --test test/*.test.mjs` (verified, 23 pass).
- No lint script; `tsc` strictness is the check.
- Release: bump `version` in `package.json` and `package-lock.json`, `npm test`, then publish. Beware: the script named `publish` (`npx tsc && npm publish`) runs via `npm run publish`; plain `npm publish` is the real publish. Never publish unless explicitly asked (2.x needs the user's go-ahead). Previous tags: `v1.0.3`.

## Conventions
- Behaviour must also work outside an iframe where documented (`loadConfig` resolves `null` when the page is not framed).
- Keep new APIs additive within 2.x; breaking changes need a major bump. New widget APIs are marked "available from `buttonrig` 2.1" (style and theme APIs and `setSummary`: 2.2) in the docs. Calls to newer app messages must degrade for older apps (`loadStyle` resolves `null` after 1 s, `getTheme` falls back to `data-br-theme`, `setSummary` is ignored by old apps).
- Add a unit test in `test/sdk.test.mjs` for new wire formats.
- Changing public behaviour: update `docs.buttonrig.com` SDK Reference (and its `Widget`/`Config` topic pages), `plugins/AGENTS.md` (Plugin authoring guide), and the app side of the protocol if a message changes.
- Commit style: short subject, optional `SDK 2.1:` prefix for release-scoped features (`SDK 2.1: widget APIs getWidgetContext, onWidgetContextChange, onResize`). Stage explicit paths; never `git commit -a`.
