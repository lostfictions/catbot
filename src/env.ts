import fs from "fs";
import envalid from "envalid";

import * as Sentry from "@sentry/node";
import { CaptureConsole } from "@sentry/integrations";

export const {
  DATA_DIR,
  MASTODON_TOKEN,
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
  SENTRY_DSN,
  isDev,
} = envalid.cleanEnv(
  process.env,
  {
    DATA_DIR: envalid.str({ default: "data" }),
    MASTODON_TOKEN: envalid.str({ devDefault: "" }),
    TWITTER_API_KEY: envalid.str({ devDefault: "" }),
    TWITTER_API_SECRET: envalid.str({ devDefault: "" }),
    TWITTER_ACCESS_TOKEN: envalid.str({ devDefault: "" }),
    TWITTER_ACCESS_SECRET: envalid.str({ devDefault: "" }),
    SENTRY_DSN: envalid.str({ default: "" }),
  },
  { strict: true }
);

if (!fs.existsSync(DATA_DIR)) {
  throw new Error(`Data directory '${DATA_DIR}' doesn't exist!`);
}

export const MASTODON_SERVER = "https://mastodon.social";

if (SENTRY_DSN.length === 0 && !isDev) {
  console.warn(
    `Sentry DSN is invalid! Error reporting to Sentry will be disabled.`
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
