import * as fs from "fs";
import * as envalid from "envalid";

const env = envalid.cleanEnv(
  process.env,
  {
    DATA_DIR: envalid.str({ default: "gfx" }),
    MASTODON_SERVER: envalid.url({ default: "https://mastodon.social" }),
    MASTODON_TOKEN: envalid.str({ default: "" }),
    TWITTER_CONSUMER_KEY: envalid.str({ default: "" }),
    TWITTER_CONSUMER_SECRET: envalid.str({ default: "" }),
    TWITTER_ACCESS_KEY: envalid.str({ default: "" }),
    TWITTER_ACCESS_SECRET: envalid.str({ default: "" }),
    CRON_RULE: envalid.str({ default: "0 0,4,8,12,16,20 * * *" })
  },
  { strict: true }
);

export const {
  DATA_DIR,
  MASTODON_SERVER,
  MASTODON_TOKEN,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_KEY,
  TWITTER_ACCESS_SECRET,
  CRON_RULE
} = env;

if (!fs.existsSync(DATA_DIR)) {
  throw new Error(`Data directory '${DATA_DIR}' doesn't exist!`);
}

export const isValidMastodonConfiguration = MASTODON_TOKEN.length > 0;
export const isValidTwitterConfiguration =
  TWITTER_CONSUMER_KEY &&
  TWITTER_CONSUMER_SECRET &&
  TWITTER_ACCESS_KEY &&
  TWITTER_ACCESS_SECRET;

if (!isValidMastodonConfiguration && !isValidTwitterConfiguration) {
  console.error(`Invalid environment config!`);
  console.error(
    `Bot will do nothing if no Mastodon API token (or Twitter API token set) is present.`
  );
  console.error(
    `Note that all four Twitter token types must be present for Twitter to work.`
  );

  const varsToCheck: (keyof typeof env)[] = [
    "MASTODON_TOKEN",
    "TWITTER_CONSUMER_KEY",
    "TWITTER_CONSUMER_SECRET",
    "TWITTER_ACCESS_KEY",
    "TWITTER_ACCESS_SECRET"
  ];
  const configInfo = varsToCheck
    .map(key => `${key}: ${env[key] ? "OK" : "NONE"}`)
    .join("\n");
  throw new Error(configInfo);
}
