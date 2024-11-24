import { setTimeout } from "timers/promises";

import { twoot } from "twoot";
import { close as flushSentry } from "@sentry/node";

import { makeCat } from "./catmaker";
import { renderToImage } from "./render-to-image";
import { writeToFile } from "./write-image-to-file";
import { makeStatus } from "./text";

import { CatParts } from "./cat-config";
import { randomInt, randomByWeight } from "./util";
import {
  BSKY_PASSWORD,
  BSKY_USERNAME,
  MASTODON_SERVER,
  MASTODON_TOKEN,
} from "./env";

async function makeTwoot() {
  const sizeChance = Math.random();
  const sizeMultiplier = sizeChance < 0.008 ? 3 : sizeChance < 0.02 ? 2 : 1;

  const wideChance = Math.random();
  const wideMultiplier = wideChance < 0.015 ? 3 : wideChance < 0.045 ? 2 : 1;

  const tallChance = Math.random();
  const tallMultiplier = tallChance < 0.015 ? 3 : tallChance < 0.045 ? 2 : 1;

  const gen = makeCat({
    catChance: randomByWeight([
      [80, 10],
      [90, 5],
      [100, 10],
    ]),
    leftChance: randomByWeight([
      [0, 1],
      [randomInt(50), 0],
      [50, 20],
      [randomInt(50, 100), 10],
    ]),
    rightChance: randomByWeight([
      [0, 1],
      [randomInt(50), 0],
      [50, 20],
      [randomInt(50, 100), 10],
    ]),
    straightChance: randomByWeight([
      [0, 1],
      [randomInt(50), 0],
      [50, 20],
      [randomInt(50, 100), 10],
    ]),
    minSteps: randomByWeight([
      [1, 1],
      [randomInt(5, 15), 20],
      [50, 1],
    ]),
    maxSteps: randomByWeight([
      [1, 1],
      [randomInt(30, 60), 20],
      [100, 1],
    ]),
    gridSizeX: 16 * sizeMultiplier * wideMultiplier,
    gridSizeY: 9 * sizeMultiplier * tallMultiplier,
  });

  const steps = [...gen];
  const { grid, catsMade, config } = steps.at(-1)!;

  let specialPosition: [number, number] | undefined;
  // 1/200 chance to search for it
  if (Math.random() < 0.005) {
    for (let y = 0; y < config.gridSizeY; y++) {
      for (let x = 0; x < config.gridSizeX - 1; x++) {
        const empty1 = grid[x][config.gridSizeY - y - 1] === CatParts.Empty;
        const empty2 = grid[x + 1][config.gridSizeY - y - 1] === CatParts.Empty;
        if (!specialPosition && empty1 && empty2 && Math.random() < 0.0001) {
          specialPosition = [x, y];
        }
      }
    }
  }

  const image = await renderToImage(grid, config, specialPosition);

  const status = makeStatus(catsMade + (specialPosition ? 1 : 0));

  return { status, image };
}

async function doTwoot(): Promise<void> {
  const { status, image } = await makeTwoot();
  const filename = await writeToFile(image);

  const results = await twoot({ status, media: [{ path: filename }] }, [
    {
      type: "mastodon",
      server: MASTODON_SERVER,
      token: MASTODON_TOKEN,
    },
    {
      type: "bsky",
      username: BSKY_USERNAME,
      password: BSKY_PASSWORD,
    },
  ]);

  for (const res of results) {
    switch (res.type) {
      case "mastodon":
        console.log(`tooted at ${res.status.url}`);
        break;
      case "bsky":
        console.log(`skeeted at ${res.status.uri}`);
        break;
      case "error":
        console.error(`error while tooting:\n${res.message}`);
        break;
      default:
        throw new Error(`unexpected value:\n${JSON.stringify(res)}`);
    }
  }
}

if (process.argv.slice(2).includes("local")) {
  const loopCat = async () => {
    const { status, image } = await makeTwoot();
    const filename = await writeToFile(image);
    console.log(status, `file://${filename}`);
    await setTimeout(1000);
    void loopCat();
  };
  void loopCat();
} else {
  void doTwoot()
    .then(() => flushSentry(2000))
    .then(() => {
      process.exit(0);
    });
}
