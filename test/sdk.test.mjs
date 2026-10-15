// Unit tests for the 2.0 SDK, run against the compiled `dist/` with Node's test runner
// (`npm test`). Browser globals are replaced by small fakes.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  InstanceFileName,
  InstanceKey,
  PluginFileName,
  PluginKey,
  parsePlaceholder,
} from "../dist/types/placeholder.js";
import {
  loadConfig,
  onConfigChange,
  saveConfig,
  serializeConfig,
} from "../dist/functions/config.js";
import { api, apiPath, apiSocket, PLUGIN_HEADER } from "../dist/functions/server.js";

/** A fake iframe window whose parent records posted messages. */
function installFakeWindow() {
  const posted = [];
  const listeners = new Set();
  const parent = { postMessage: (message, target) => posted.push({ message, target }) };
  globalThis.window = {
    name: "button-plugin-action-1",
    parent,
    addEventListener: (type, fn) => type === "message" && listeners.add(fn),
    removeEventListener: (type, fn) => type === "message" && listeners.delete(fn),
  };
  /** Delivers an app -> iframe message (from `source`, the parent by default). */
  const deliver = (data, source = parent) => {
    for (const fn of [...listeners]) fn({ source, data });
  };
  return { posted, listeners, deliver, parent };
}

beforeEach(() => {
  delete globalThis.window;
});

test("placeholders serialize to their strings", () => {
  assert.equal(new PluginKey("token").into(), "{{PLUGIN_KEY_VALUE_token}}");
  assert.equal(new InstanceKey("q").into(), "{{INSTANCE_KEY_VALUE_q}}");
  assert.equal(new PluginFileName("a.txt").into(), "{{PLUGIN_FILE_NAME_a.txt}}");
  assert.equal(new InstanceFileName("crop.png").into(), "{{INSTANCE_FILE_NAME_crop.png}}");
  assert.equal(`x=${new InstanceKey("q")}`, "x={{INSTANCE_KEY_VALUE_q}}");
  assert.equal(JSON.stringify(new PluginKey("token")), '"{{PLUGIN_KEY_VALUE_token}}"');
});

test("serializeConfig turns placeholders at any depth into JSON string values", () => {
  const config = {
    token: new PluginKey("token"),
    nested: {
      list: [new InstanceFileName("b.png"), 3, null, true, new PluginFileName("a.txt")],
      key: new InstanceKey("name"),
    },
    url: `https://example.com/?q=${new InstanceKey("query")}`,
    dropped: undefined,
  };
  assert.deepEqual(serializeConfig(config), {
    token: "{{PLUGIN_KEY_VALUE_token}}",
    nested: {
      list: ["{{INSTANCE_FILE_NAME_b.png}}", 3, null, true, "{{PLUGIN_FILE_NAME_a.txt}}"],
      key: "{{INSTANCE_KEY_VALUE_name}}",
    },
    url: "https://example.com/?q={{INSTANCE_KEY_VALUE_query}}",
  });
  assert.equal(serializeConfig(undefined), null);
  assert.equal(serializeConfig(new PluginKey("k")), "{{PLUGIN_KEY_VALUE_k}}");
});

test("from() returns the right class (PluginFileName/InstanceFileName fix)", () => {
  const pluginFile = PluginFileName.from("{{PLUGIN_FILE_NAME_a.txt}}");
  assert.ok(pluginFile instanceof PluginFileName);
  assert.equal(pluginFile.fileName, "a.txt");

  const instanceFile = InstanceFileName.from("{{INSTANCE_FILE_NAME_crop.png}}");
  assert.ok(instanceFile instanceof InstanceFileName);
  assert.equal(instanceFile.fileName, "crop.png");

  assert.ok(PluginKey.from("{{PLUGIN_KEY_VALUE_k}}") instanceof PluginKey);
  assert.ok(InstanceKey.from("{{INSTANCE_KEY_VALUE_k}}") instanceof InstanceKey);

  // Not exactly one placeholder: unchanged.
  for (const value of [
    "plain",
    "{{PLUGIN_KEY_VALUE_}}",
    "x {{PLUGIN_KEY_VALUE_k}}",
    "{{PLUGIN_KEY_VALUE_a}} {{PLUGIN_KEY_VALUE_b}}",
    "{{INSTANCE_FILE_NAME_crop.png}}",
    42,
    null,
  ]) {
    assert.equal(PluginKey.from(value), value);
  }
  assert.equal(PluginFileName.from("{{INSTANCE_FILE_NAME_x}}"), "{{INSTANCE_FILE_NAME_x}}");
});

test("parsePlaceholder picks the matching class", () => {
  assert.ok(parsePlaceholder("{{PLUGIN_KEY_VALUE_k}}") instanceof PluginKey);
  assert.ok(parsePlaceholder("{{INSTANCE_KEY_VALUE_k}}") instanceof InstanceKey);
  assert.ok(parsePlaceholder("{{PLUGIN_FILE_NAME_f}}") instanceof PluginFileName);
  assert.ok(parsePlaceholder("{{INSTANCE_FILE_NAME_f}}") instanceof InstanceFileName);
  assert.equal(parsePlaceholder("hello"), "hello");
});

test("saveConfig posts { saveConfig: { config } } with serialized placeholders", () => {
  const { posted } = installFakeWindow();
  saveConfig({ message: "hi", token: new PluginKey("token") });
  assert.equal(posted.length, 1);
  const { message, target } = posted[0];
  assert.equal(target, "*");
  assert.equal(message.buttonPluginActionId, "button-plugin-action-1");
  assert.equal(typeof message.messageId, "string");
  assert.deepEqual(message.payload, {
    saveConfig: { config: { message: "hi", token: "{{PLUGIN_KEY_VALUE_token}}" } },
  });
});

test("loadConfig sends \"loadConfig\" and resolves with the matching answer only", async () => {
  const { posted, listeners, deliver } = installFakeWindow();
  const promise = loadConfig();
  assert.equal(posted.length, 1);
  assert.equal(posted[0].message.payload, "loadConfig");
  const messageId = posted[0].message.messageId;

  // Ignored: other message ids, other events, other sources, junk.
  deliver({ messageId: "other", event: { loadConfig: { config: { wrong: 1 } } } });
  deliver({ messageId, event: { getCurrentTarget: { target: "Linux_X86_64" } } });
  deliver({ messageId, event: { loadConfig: { config: { wrong: 2 } } } }, {});
  deliver("vite:hmr");
  deliver(null);
  deliver({ messageId });

  deliver({ messageId, event: { loadConfig: { config: { message: "saved" } } } });
  assert.deepEqual(await promise, { message: "saved" });
  assert.equal(listeners.size, 0, "listener removed after the answer");
});

test("loadConfig resolves null for a new instance and outside the app", async () => {
  const { posted, deliver } = installFakeWindow();
  const promise = loadConfig();
  deliver({ messageId: posted[0].message.messageId, event: { loadConfig: { config: null } } });
  assert.equal(await promise, null);

  globalThis.window = { parent: null };
  globalThis.window.parent = globalThis.window;
  assert.equal(await loadConfig(), null);
});

test("onConfigChange receives configChanged pushes until unsubscribed", () => {
  const { deliver, listeners } = installFakeWindow();
  const seen = [];
  const stop = onConfigChange((config) => seen.push(config));
  deliver({ messageId: "push-1", event: { configChanged: { config: { a: 1 } } } });
  deliver({ messageId: "push-2", event: { loadConfig: { config: { b: 2 } } } });
  deliver({ messageId: "push-3", event: { configChanged: { config: null } } });
  stop();
  deliver({ messageId: "push-4", event: { configChanged: { config: { c: 3 } } } });
  assert.deepEqual(seen, [{ a: 1 }, null]);
  assert.equal(listeners.size, 0);
});

test("api prefixes /api and adds the plugin header, keeping init", async () => {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response("ok");
  };
  await api("/applications");
  await api("status?x=1", {
    method: "POST",
    body: "{}",
    headers: { "Content-Type": "application/json", [PLUGIN_HEADER]: "0" },
  });
  await api("/h", { headers: new Headers([["Accept", "text/plain"]]) });

  assert.equal(calls[0].url, "/api/applications");
  assert.equal(calls[0].init.headers.get(PLUGIN_HEADER), "1");

  assert.equal(calls[1].url, "/api/status?x=1");
  assert.equal(calls[1].init.method, "POST");
  assert.equal(calls[1].init.body, "{}");
  assert.equal(calls[1].init.headers.get("content-type"), "application/json");
  assert.equal(calls[1].init.headers.get("x-buttonrig-plugin"), "1");

  assert.equal(calls[2].init.headers.get("accept"), "text/plain");
  assert.equal(calls[2].init.headers.get(PLUGIN_HEADER), "1");
  assert.equal(PLUGIN_HEADER, "X-Buttonrig-Plugin");
  assert.equal(apiPath("/a/b"), "/api/a/b");
  assert.equal(apiPath("a"), "/api/a");
});

test("apiSocket opens ws(s)://<host>/api<path>", () => {
  const opened = [];
  globalThis.WebSocket = class {
    constructor(...args) {
      opened.push(args);
    }
  };
  globalThis.location = { protocol: "http:", host: "127.0.0.1:43123" };
  apiSocket("/ws/events");
  apiSocket("ws/x", ["v1"]);
  globalThis.location = { protocol: "https:", host: "example.test" };
  apiSocket("/s");
  assert.deepEqual(opened, [
    ["ws://127.0.0.1:43123/api/ws/events"],
    ["ws://127.0.0.1:43123/api/ws/x", ["v1"]],
    ["wss://example.test/api/s"],
  ]);
});
