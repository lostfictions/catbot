require("source-map-support").install();

import { scheduleJob } from "node-schedule";
import { twoot, Configs as TwootConfigs } from "twoot";

import * as Jimp from "jimp";

import { makeCat } from "./catmaker";
import { renderToImage } from "./render-to-image";
import { writeToFile } from "./write-image-to-file";
import { makeStatus } from "./text";

import { randomInt, randomByWeight } from "./util";
import {
  MASTODON_SERVER,
  MASTODON_TOKEN,
  isValidMastodonConfiguration,
  TWITTER_CONSUMER_KEY as consumerKey,
  TWITTER_CONSUMER_SECRET as consumerSecret,
  TWITTER_ACCESS_KEY as accessKey,
  TWITTER_ACCESS_SECRET as accessSecret,
  isValidTwitterConfiguration,
  CRON_RULE
} from "./env";

const twootConfigs: TwootConfigs = [];
if (isValidMastodonConfiguration) {
  twootConfigs.push({
    token: MASTODON_TOKEN,
    server: MASTODON_SERVER
  });
}
if (isValidTwitterConfiguration) {
  twootConfigs.push({
    consumerKey,
    consumerSecret,
    accessKey,
    accessSecret
  });
}

async function makeTwoot(): Promise<{ status: string; image: Jimp }> {
  const sizeChance = Math.random();
  const sizeMultiplier = sizeChance < 0.008 ? 3 : sizeChance < 0.02 ? 2 : 1;

  const wideChance = Math.random();
  const wideMultiplier = wideChance < 0.015 ? 3 : wideChance < 0.045 ? 2 : 1;

  const tallChance = Math.random();
  const tallMultiplier = tallChance < 0.015 ? 3 : tallChance < 0.045 ? 2 : 1;

  const gen = makeCat({
    catChance: randomByWeight([[80, 10], [90, 5], [100, 10]]),
    leftChance: randomByWeight([
      [0, 1],
      [randomInt(50), 0],
      [50, 20],
      [randomInt(50, 100), 10]
    ]),
    rightChance: randomByWeight([
      [0, 1],
      [randomInt(50), 0],
      [50, 20],
      [randomInt(50, 100), 10]
    ]),
    straightChance: randomByWeight([
      [0, 1],
      [randomInt(50), 0],
      [50, 20],
      [randomInt(50, 100), 10]
    ]),
    minSteps: randomByWeight([[1, 1], [randomInt(5, 15), 20], [50, 1]]),
    maxSteps: randomByWeight([[1, 1], [randomInt(30, 60), 20], [100, 1]]),
    gridSizeX: 16 * sizeMultiplier * wideMultiplier,
    gridSizeY: 9 * sizeMultiplier * tallMultiplier
  });

  const steps = [...gen];
  const { grid, catsMade, config } = steps[steps.length - 1];

  const image = await renderToImage(grid, config);

  const status = makeStatus(catsMade);

  return { status, image };
}

async function doTwoot(): Promise<void> {
  const { status, image } = await makeTwoot();
  const filename = await writeToFile(image);

  try {
    const urls = await twoot(twootConfigs, status, [filename]);
    console.log(
      `[${new Date().toUTCString()}] twooted:\n${urls
        .map(u => "\t -> " + u)
        .join("\n")}`
    );
  } catch (e) {
    console.error("error while trying to twoot: ", e);
  }
}

let job;
if (process.argv.slice(2).includes("local")) {
  // seems like scheduleJob doesn't like being passed async functions
  // directly...?
  const localJob = () => {
    (async () => {
      const { status, image } = await makeTwoot();
      const filename = await writeToFile(image);
      console.log(status, `file://${filename}`);
    })();
  };
  localJob();
  job = scheduleJob("*/10 * * * * *", localJob);
} else {
  // we're running in production mode!
  job = scheduleJob(CRON_RULE, doTwoot);
}

const now = new Date(Date.now()).toUTCString();
const next = (job.nextInvocation() as any).toDate().toUTCString(); // bad typings
console.log(`[${now}] Bot is running! Next job scheduled for [${next}]`);
