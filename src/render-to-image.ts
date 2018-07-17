import * as fs from "fs";
import * as path from "path";

import * as Jimp from "jimp";

import { randomInArray, randomInt } from "./util";
import { DATA_DIR } from "./env";

import { CatParts, CatConfig } from "./cat-config";

const filenameToPart: { [pattern: string]: CatParts } = {
  empty: CatParts.Empty,
  ud: CatParts.UD,
  lr: CatParts.LR,
  ul: CatParts.UL,
  ur: CatParts.UR,
  dl: CatParts.DL,
  dr: CatParts.DR,
  cross: CatParts.Cross,
  butt: CatParts.Start,
  "head-r": CatParts.EndR,
  "head-u": CatParts.EndU,
  "head-l": CatParts.EndL,
  "head-d": CatParts.EndD
};

let cachedSprites: {
  parts: { [part: string]: Jimp[] };
  spriteSize: [number, number];
};

async function loadSprites(): Promise<{
  parts: { [part: string]: Jimp[] };
  spriteSize: [number, number];
}> {
  if (!cachedSprites) {
    const parts: { [part: string]: Jimp[] } = {};
    let spriteSize: [number, number] | null = null;

    const prefixes = Object.keys(filenameToPart);

    const filenames = fs.readdirSync(DATA_DIR);
    if (filenames.length === 0) {
      throw new Error(`No files in image directory '${DATA_DIR}'`);
    }

    for (const fn of filenames) {
      const prefix = prefixes.find(p => fn.startsWith(p));
      if (!prefix) {
        console.warn(
          `Filename pattern doesn't match any known part prefix: '${fn}'`
        );
      } else {
        const sprite = await Jimp.read(path.join(DATA_DIR, fn));

        const { width, height } = sprite.bitmap;
        // infer our sprite size from the first file we load
        if (!spriteSize) {
          spriteSize = [width, height];
        } else if (width !== spriteSize[0] || height !== spriteSize[1]) {
          throw new Error(
            `Inconsistent sprite size:\n` +
              `Expected '${fn}' to be [${spriteSize.join(", ")}],\n` +
              `instead got [${width}, ${height}]`
          );
        }

        let arr: Jimp[] | undefined = parts[filenameToPart[prefix]];
        if (!Array.isArray(arr)) {
          arr = [];
          parts[filenameToPart[prefix]] = arr;
        }
        arr.push(sprite);
      }
    }
    // ensure there's at least one sprite for each part
    for (const part of Object.values(filenameToPart)) {
      if (!Array.isArray(parts[part])) {
        throw new Error(`Missing sprite category: ${part}`);
      }
    }

    cachedSprites = {
      parts,
      spriteSize
    } as any;
  }

  return cachedSprites;
}

export async function renderToImage(
  grid: CatParts[][],
  params: CatConfig
): Promise<Jimp> {
  const {
    parts,
    spriteSize: [sW, sH]
  } = await loadSprites();

  const { gridSizeX, gridSizeY } = params;

  const width = sW * gridSizeX;
  const height = sH * gridSizeY;
  // hack: bad typings
  let dest: Jimp = new (Jimp as any)(width, height);

  for (let x = 0; x < gridSizeX; x++) {
    for (let y = 0; y < gridSizeY; y++) {
      // we have to flip the y again
      const partType = grid[x][gridSizeY - y - 1];
      const sprite = randomInArray(parts[partType]);
      dest.blit(sprite, sW * x, sH * y);
    }
  }

  ////////////////////
  // Some transforms:
  const mirror = Math.random();
  if (mirror < 0.1) {
    dest.mirror(true, false);
  } else if (mirror < 0.14) {
    dest.mirror(true, true);
  } else if (mirror < 0.18) {
    dest.mirror(false, true);
  }

  if (Math.random() < 0.2) {
    dest.rotate(180);
  }

  const bgCol = Jimp.rgbaToInt(
    randomInt(256),
    randomInt(256),
    randomInt(256),
    255
  );
  const bg: Jimp = new (Jimp as any)(
    dest.bitmap.width,
    dest.bitmap.height,
    bgCol
  );

  const silhouette = dest.clone();
  const silhouetteCol =
    "#" +
    [randomInt(50), randomInt(50), randomInt(50)]
      .map(i => i.toString(16))
      .map(c => (c.length < 2 ? "0" + c : c))
      .join("");

  (silhouette as any).color([{ apply: "mix", params: [silhouetteCol, 100] }]);

  bg.composite(silhouette, randomInt(-3, 4), randomInt(-3, 4));
  bg.composite(dest, 0, 0);
  dest = bg;

  const getTransform = () => {
    const val = Math.random();
    switch (true) {
      case val < 0.3:
        return { apply: "spin", params: [randomInt(360)] };
      case val < 0.4:
        return { apply: "lighten", params: [randomInt(5, 20)] };
      case val < 0.5:
        return { apply: "brighten", params: [randomInt(5, 20)] };
      case val < 0.6:
        return { apply: "desaturate", params: [randomInt(10, 100)] };
      case val < 0.7:
        return { apply: "tint", params: [randomInt(10, 20)] };
      case val < 0.8:
        return { apply: "red", params: [randomInt(10, 50)] };
      case val < 0.9:
        return { apply: "green", params: [randomInt(10, 50)] };
      default:
        return { apply: "blue", params: [randomInt(10, 50)] };
    }
  };

  if (Math.random() < 0.9) {
    const transforms = [...Array(randomInt(1, 3))].map(getTransform);
    (dest as any).color(transforms);
  }
  ////////////////////

  // make one pixel 99% opacity to prevent twitter jpeg compression
  const pixCol = (Jimp as any).intToRGBA(dest.getPixelColor(0, 0));
  dest.setPixelColor(
    Jimp.rgbaToInt(pixCol.r, pixCol.g, pixCol.b, pixCol.a - 1),
    0,
    0
  );

  return dest;
}
