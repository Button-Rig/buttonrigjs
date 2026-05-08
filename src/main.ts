import { appPostMessage } from "./utils.js";

export * from "./types/handler.js";
export * from "./types/rxPayload.js";
export * from "./types/txPayload.js";
export * from "./types/utils.js";
export * from "./functions/app.js";
export * from "./functions/handler.js";
export * from "./functions/keyValue.js";
export * from "./functions/file.js";
export * from "./utils.js";
export * from "./types/app.js";

(["log", "warn", "error", "info", "debug"] as const).forEach((level) => {
  const _original = console[level];

  console[level] = (...args) => {
    _original(...args);

    const formatted = args
      .map((arg) => {
        if (arg === null) return "null";
        if (arg === undefined) return "undefined";
        if (typeof arg === "function") return arg.toString();
        if (arg instanceof Error)
          return `${arg.name}: ${arg.message}\n${arg.stack ?? ""}`;
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return Object.prototype.toString.call(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    switch (level) {
      case "info":
      case "debug":
      case "log": {
        appPostMessage({
          consoleLog: {
            log: formatted,
          },
        });
        break;
      }
      case "warn": {
        appPostMessage({
          consoleLogWarning: {
            log: formatted,
          },
        });
        break;
      }
      case "error": {
        appPostMessage({
          consoleLogError: {
            log: formatted,
          },
        });
        break;
      }
    }
  };
});

window.addEventListener("error", (event) => {
  let formatted = `Uncaught ${event.error?.name ?? "Error"}: ${event.message}\n  at ${event.filename}:${event.lineno}:${event.colno}${event.error?.stack ? "\n" + event.error.stack : ""}`;
  appPostMessage({
    consoleLogError: {
      log: formatted,
    },
  });
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const message =
    reason instanceof Error
      ? `Unhandled Promise Rejection: ${reason.name}: ${reason.message}\n${reason.stack ?? ""}`
      : `Unhandled Promise Rejection: ${String(reason)}`;

  appPostMessage({
    consoleLogError: {
      log: message,
    },
  });
});
