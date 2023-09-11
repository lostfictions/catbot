import path from "path";
import { tmpdir } from "os";

import Jimp from "jimp";

let defaultFilenameIndex = 0;

export async function writeToFile(
  image: Jimp,
  filename = path.join(tmpdir(), `catbot_${defaultFilenameIndex++}.png`),
): Promise<string> {
  return new Promise<string>((res, rej) => {
    image.write(filename, (e) => {
      if (e) {
        rej(e);
      } else {
        res(filename);
      }
    });
  });
}
