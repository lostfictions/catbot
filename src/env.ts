/* eslint-disable node/no-process-env */
import fs from "fs";

import { z, parseEnv } from "znv";

import * as Sentry from "@sentry/node";
import { CaptureConsole } from "@sentry/integrations";

export const { PERSIST_DIR, MASTODON_TOKEN, SENTRY_DSN } = parseEnv(
  process.env,
  {
    PERSIST_DIR: z.string().min(1).default("persist"),
    MASTODON_TOKEN: {
      schema: z.string().min(1),
      defaults: {
        development: "dev",
      },
    },
    SENTRY_DSN: {
      schema: z.string().min(1).optional(),
    },
  },
);

export const isDev = process.env["NODE_ENV"] !== "production";

if (!fs.existsSync(PERSIST_DIR)) {
  throw new Error(`Persistence directory '${PERSIST_DIR}' doesn't exist!`);
}

export const MASTODON_SERVER = "https://mastodon.social";

if (!SENTRY_DSN && !isDev) {
  console.warn(
    `Sentry DSN is invalid! Error reporting to Sentry will be disabled.`,
  );
} else {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: isDev ? "dev" : "prod",
    integrations: [
      new CaptureConsole({ levels: ["warn", "error", "debug", "assert"] }),
    ],
  });
}
