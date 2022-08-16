import * as Sentry from "@sentry/node";

export const SENTRY_DNS = process.env.SENTRY_DNS;

export function setupSentry() {
  return Sentry.init({
    dsn: SENTRY_DNS,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
  });
}

export default Sentry;
