import {
  InstanceFileName,
  InstanceKey,
  PluginFileName,
  PluginKey,
} from "../types/handler.js";
import type {
  CallHandlerResponse,
  RxCallHandler,
  RxLoadHandlerArgs,
} from "../types/rxPayload.js";
import { addAppEventListener, appPostMessage } from "../utils.js";

/**
 * You can call your handler cli from within the configurator using this function.
 *
 * @param args - The command line args that you have build.
 *
 * Eg: ["move-mouse", "-x", "234", "-y", "234"]
 *
 * Eg: ["pattern-match-move-mouse", "--crop-location", new InstanceFileName("crop.png") , "-x", "234", "-y", "234"]
 *
 * @returns the response from the handler.
 *
 * Here T is the type of the response in case its returning json. T can be string to capture any response type.
 */
export function callHandler<T>(
  args: Array<
    string | PluginKey | InstanceKey | PluginFileName | InstanceFileName
  >,
): Promise<CallHandlerResponse<T>> {
  return new Promise((resolve) => {
    appPostMessage({
      callHandler: {
        handlerArgs: args.map((x) => {
          if (x !== null && typeof x === 'object' && typeof (x as any).into === 'function') {
            return (x as any).into();
          }
          return x;
        }),
      },
    });
    addAppEventListener("callHandler", (rxPayload) => {
      let payload = rxPayload as RxCallHandler<T>;
      const raw = payload.callHandler.response;

      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

      resolve({
        ...payload.callHandler,
        response: parsed,
      });
    });
  });
}

/**
 * Use this function to save the handler args you have generated for the button.
 * This will be the handler args that will be called when your button is being executed.
 *
 * @param args - The command line args that you have build.
 *
 * Eg: ["move-mouse", "-x", "234", "-y", "234"]
 *
 * Eg: ["pattern-match-move-mouse", "--crop-location", new InstanceFileName("crop.png") , "-x", "234", "-y", "234"]
 */
export function saveHandlerArgs(
  args: Array<
    string | PluginKey | InstanceKey | PluginFileName | InstanceFileName
  >,
) {
  appPostMessage({
    saveHandlerArgs: {
      handlerArgs: args.map((x) => {
        if (x instanceof InstanceKey) {
          return x.into();
        } else if (x instanceof PluginKey) {
          return x.into();
        } else if (x instanceof PluginFileName) {
          return x.into();
        } else if (x instanceof InstanceFileName) {
          return x.into();
        } else {
          return x;
        }
      }),
    },
  });
}

/**
 *
 * @param fn - Callback which will be called when the app sends the previously saved handler args to the plugin configurator instance.
 */
export function loadHandlerArgs(
  fn: (
    handlerArgs: Array<
      string | PluginKey | InstanceKey | PluginFileName | InstanceFileName
    >,
  ) => void,
) {
  addAppEventListener("loadHandlerArgs", (payload) => {
    let loadHandlerArgsPayload = payload as RxLoadHandlerArgs;
    fn(
      loadHandlerArgsPayload.loadHandlerArgs.handlerArgs.map((x) => {
        let pluginKey = PluginKey.from(x);
        if (pluginKey instanceof PluginKey) {
          return pluginKey;
        }

        let instanceKey = InstanceKey.from(x);
        if (instanceKey instanceof InstanceKey) {
          return instanceKey;
        }

        let pluginFile = PluginFileName.from(x);
        if (pluginFile instanceof PluginFileName) {
          return pluginFile;
        }

        let instanceFile = InstanceFileName.from(x);
        if (instanceFile instanceof InstanceFileName) {
          return instanceFile;
        }

        return x;
      }),
    );
  });
  appPostMessage("readyToReceive");
}
