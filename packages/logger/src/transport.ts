import pino from "pino";
import { Writable } from "stream";
import Sentry, { setupSentry } from "./sentry";

const isProduction = process.env.NODE_ENV === "production";

const SEVERITIES_MAP: Record<number | pino.Level, Sentry.Severity> = {
  10: Sentry.Severity.Debug, // pino: trace
  20: Sentry.Severity.Debug, // pino: debug
  30: Sentry.Severity.Info, // pino: info
  40: Sentry.Severity.Warning, // pino: warn
  50: Sentry.Severity.Error, // pino: error
  60: Sentry.Severity.Fatal, // pino: fatal
  // Support for useLevelLabels
  // https://github.com/pinojs/pino/blob/master/docs/api.md#uselevellabels-boolean
  trace: Sentry.Severity.Debug,
  debug: Sentry.Severity.Debug,
  info: Sentry.Severity.Info,
  warn: Sentry.Severity.Warning,
  error: Sentry.Severity.Error,
  fatal: Sentry.Severity.Fatal,
};

// Levels we want to forward to Sentry
const SEVERITIES_TO_SENTRY = [Sentry.Severity.Error, Sentry.Severity.Fatal];

const SentryTransport = () => {
  if (isProduction) {
    setupSentry();
  }

  return new Writable({
    write: (chunk, encoding, cb) => {
      if (isProduction) {
        // If we are in production, the chunks that come from pino are serialized pino's log objects
        // so we deserialize them
        const data = JSON.parse(chunk.toString());

        // then get the equivalent sentry severity
        const severity =
          SEVERITIES_MAP[data.level as keyof typeof SEVERITIES_MAP];

        // then logs what came from pino according to level
        switch (severity) {
          case Sentry.Severity.Warning:
            console.warn(data);
            break;
          case Sentry.Severity.Error:
            console.error(data);
            break;
          case Sentry.Severity.Fatal:
            console.error(data);
            break;
          default:
            // eslint-disable-next-line no-console
            console.log(data);
        }

        if (severity === Sentry.Severity.Error) {
          const error =
            data.err instanceof Error
              ? data.err
              : new Error(
                  data.msg ||
                    data.message ||
                    data.err?.message ||
                    data.err?.msg ||
                    "Unknown error"
                );

          if (data.err?.stack || data.stack)
            error.stack = data.err?.stack || data.stack;

          Sentry.captureException(error, {
            extra: data,
            level: severity,
          });
        } else if (SEVERITIES_TO_SENTRY.includes(severity)) {
          Sentry.captureMessage(data.msg.message, {
            extra: data,
            level: severity,
          });
        }
      } else {
        // If we are not in production, the chunks will be just the logs in string
        process.stdout.write(chunk);
      }

      cb();
    },
  });
};

export default SentryTransport;
