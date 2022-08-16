import pino from "pino";
import pinoHttp from "pino-http";
import createTransport from "./transport";
export { default as Sentry, SENTRY_DNS, setupSentry } from "./sentry";

const isProduction = process.env.NODE_ENV === "production";

/** Creates a logger instance for the App or Package that will use it. */
export function createLogger(name: string) {
  const stream = createTransport();

  const logger = pino(
    {
      name,
      hooks: {
        // @see https://getpino.io/#/docs/help?id=avoid-message-conflict
        logMethod(inputArgs, method) {
          if (inputArgs.length === 2 && inputArgs[0].msg) {
            inputArgs[0].originalMsg = inputArgs[0].msg;
          }
          // @ts-expect-error No need typescript here
          return method.apply(this, inputArgs);
        },
      },

      transport: !isProduction
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          }
        : undefined,
    },
    stream
  );

  return logger;
}

export const expressLogger = (logger: pino.Logger) => pinoHttp({ logger });

export default createLogger;
