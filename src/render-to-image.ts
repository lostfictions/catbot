import fs from "fs";
import { join, parse as parsePath } from "path";

import Jimp from "jimp";

import { randomInArray, randomInt, randomFloat, hsvToRGB } from "./util";
import { CatParts, CatConfig } from "./cat-config";

const OVERLAYS_DIR = "data/overlays";
const PARTS_DIR = "data/parts";
const PALETTE_PATH = "data/palette.png";
const SPECIAL_PATH = "data/mercat.png";

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
  "head-d": CatParts.EndD,
};

let cachedSprites: {
  parts: { [part: string]: Jimp[] };
  overlays: { [part: string]: { [featureType: string]: Jimp[] } };
  spriteSize: [number, number];
  /** Normal color, light shade, dark shade */
  palette: [number, number, number];
  special: Jimp;
};

async function loadSprites(): Promise<typeof cachedSprites> {
  if (!cachedSprites) {
    const parts: { [part: string]: Jimp[] } = {};
    const overlays: { [part: string]: { [featureType: string]: Jimp[] } } = {};
    let spriteSize: [number, number] | null = null;

    const prefixes = Object.keys(filenameToPart);

    const partsFilenames = fs.readdirSync(PARTS_DIR);
    if (partsFilenames.length === 0) {
      throw new Error(`No files in image directory '${PARTS_DIR}'`);
    }

    for (const fn of partsFilenames) {
      const prefix = prefixes.find((p) => fn.startsWith(p));
      if (!prefix) {
        console.warn(
          `Filename pattern doesn't match any known part prefix: '${fn}'`,
        );
      } else {
        const sprite = await Jimp.read(join(PARTS_DIR, fn));

        const { width, height } = sprite.bitmap;
        // infer our sprite size from the first file we load
        if (!spriteSize) {
          spriteSize = [width, height];
        } else if (width !== spriteSize[0] || height !== spriteSize[1]) {
          throw new Error(
            `Inconsistent sprite size:\n` +
              `Expected '${fn}' to be [${spriteSize.join(", ")}],\n` +
              `instead got [${width}, ${height}]`,
          );
        }

        let arr = parts[filenameToPart[prefix]];
        if (!Array.isArray(arr)) {
          arr = [];
          parts[filenameToPart[prefix]] = arr;
        }
        arr.push(sprite);
      }
    }

    const overlayFilenames = fs.readdirSync(OVERLAYS_DIR);
    for (const fn of overlayFilenames) {
      const [prefix, featureName] = parsePath(fn).name.split("-");

      // this is not great, but maybe good enough for now
      if (prefix !== "head") {
        console.warn(`currently unhandled overlay part: ${prefix}`);
      } else {
        const sprite = await Jimp.read(join(OVERLAYS_DIR, fn));

        const { width, height } = sprite.bitmap;
        if (width !== spriteSize![0] || height !== spriteSize![1]) {
          throw new Error(
            `Inconsistent sprite size:\n` +
              `Expected '${fn}' to be [${spriteSize!.join(", ")}],\n` +
              `instead got [${width}, ${height}]`,
          );
        }

        const rotationMap = {
          "head-u": 0,
          "head-r": 90,
          "head-d": 180,
          "head-l": 270,
        };

        for (const [partName, rotation] of Object.entries(rotationMap)) {
          let featureMap = overlays[filenameToPart[partName]];
          if (!featureMap) {
            featureMap = {};
            overlays[filenameToPart[partName]] = featureMap;
          }

          let arr = featureMap[featureName];
          if (!Array.isArray(arr)) {
            arr = [];
            featureMap[featureName] = arr;
          }

          const rotated = sprite.clone();
          rotated.rotate(rotation);
          arr.push(rotated);
        }
      }
    }

    // ensure there's at least one sprite for each part
    for (const part of Object.values(filenameToPart)) {
      if (!Array.isArray(parts[part])) {
        throw new Error(`Missing sprite category: ${part}`);
      }
    }

    const palette = await Jimp.read(PALETTE_PATH);
    const normal = palette.getPixelColor(1, 0);
    const lightShade = palette.getPixelColor(2, 0);
    const darkShade = palette.getPixelColor(3, 0);

    const special = await Jimp.read(SPECIAL_PATH);

    // eslint-disable-next-line require-atomic-updates
    cachedSprites = {
      parts,
      overlays,
      spriteSize: spriteSize!,
      palette: [normal, lightShade, darkShade],
      special,
    };
  }

  return cachedSprites;
}

export async function renderToImage(
  grid: CatParts[][],
  params: CatConfig,
  specialPos?: [number, number],
): Promise<Jimp> {
  const {
    parts,
    overlays,
    spriteSize: [sW, sH],
    palette,
    special,
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
      // just default to one of each feature type for now
      if (overlays[partType]) {
        for (const feature of Object.values(overlays[partType])) {
          const featureSprite = randomInArray(feature);
          dest.composite(featureSprite, sW * x, sH * y);
        }
      }
    }
  }

  if (specialPos) {
    dest.blit(special, sW * specialPos[0], sH * specialPos[1]);
  }

  ////////////////////
  // Some transforms:
  const mirror = Math.random();
  if (mirror < 0.1) {
    dest.mirror(true, false);
  } else if (mirror < 0.13 && !specialPos) {
    dest.mirror(true, true);
  } else if (mirror < 0.16 && !specialPos) {
    dest.mirror(false, true);
  }

  if (Math.random() < 0.03) {
    dest.rotate(180);
  }

  let didMakeTransparent = false;
  // Recolor the cat based on palette
  if (Math.random() < 0.5) {
    didMakeTransparent = Math.random() < 0.1;

    const baseColor = [randomInt(360), randomInt(60, 90), randomInt(80, 90)];
    const lightShade = [...baseColor];
    if (Math.random() < 0.5) {
      lightShade[0] = (lightShade[0] + randomInt(-40, 40)) % 360;
    }
    lightShade[1] *= randomFloat(0.7, 0.9);
    lightShade[2] *= randomFloat(0.6, 0.9);
    const darkShade = [...lightShade];
    darkShade[1] *= randomFloat(0.7, 0.9);
    darkShade[2] *= randomFloat(0.4, 0.7);

    const replacement = [baseColor, lightShade, darkShade].map((c) => {
      const [r, g, b] = hsvToRGB(c as [number, number, number]);
      const a = didMakeTransparent
        ? Math.random() < 0.3
          ? 0
          : randomInt(20, 220)
        : 255;
      return Jimp.rgbaToInt(r, g, b, a);
    });

    // selectively recolour image
    dest.scan(0, 0, dest.bitmap.width, dest.bitmap.height, (x, y) => {
      const paletteIndex = palette.indexOf(dest.getPixelColor(x, y));
      if (paletteIndex !== -1) {
        dest.setPixelColor(replacement[paletteIndex], x, y);
      }
    });
  }

  const bgColor: [number, number, number] = [
    randomInt(0, 360),
    randomInt(10, 50),
    randomInt(10, 80),
  ];
  const [bgR, bgG, bgB] = hsvToRGB(bgColor);
  const bgCol = Jimp.rgbaToInt(bgR, bgG, bgB, 255);
  const bg: Jimp = new (Jimp as any)(
    dest.bitmap.width,
    dest.bitmap.height,
    bgCol,
  );

  // don't make a silhouette if we're transparent!
  if (!didMakeTransparent && Math.random() < 0.8) {
    const silhouette = dest.clone();
    const silhouetteCol = `#${[randomInt(50), randomInt(50), randomInt(50)]
      .map((i) => i.toString(16))
      .map((c) => (c.length < 2 ? `0${c}` : c))
      .join("")}`;

    (silhouette as any).color([
      {
        apply: "mix",
        params: [silhouetteCol, 100],
      },
    ]);

    bg.composite(silhouette, randomInt(-3, 4), randomInt(-3, 4));
  }

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
    0,
  );

  return dest;
}
