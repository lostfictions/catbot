import * as fs from 'fs'
import * as path from 'path'
import { tmpdir } from 'os'

import * as Jimp from 'jimp'

import { randomInArray } from './util'
import { DATA_DIR } from './env'

const imgDir = path.join(DATA_DIR, 'heathcliff')
const outDir = tmpdir()

let filenames: string[] = []
if(!fs.existsSync(imgDir)) {
  throw new Error(`Heathcliff source directory '${imgDir}' not found! Heathcliff command will be unavailable.`)
}
else {
  filenames = fs.readdirSync(imgDir)
  if(filenames.length === 0) {
    throw new Error(`No files in image directory '${imgDir}'`)
  }
}

async function load(files: string[]): Promise<[Jimp, string[]]> {
  const nextFiles = files.slice()

  let img: Jimp
  do {
    const fn = randomInArray(nextFiles)
    nextFiles.splice(nextFiles.indexOf(fn), 1)
    img = await Jimp.read(path.join(imgDir, fn))
  } while(img.bitmap.width > img.bitmap.height) // NO SUNDAYS

  return [img, nextFiles]
}

let filenameIndex = 0

export async function makeHeathcliff(): Promise<string> {
  const [i, nextFiles] = await load(filenames)

  const [j] = await load(nextFiles)

  const [small, big] = i.bitmap.width < j.bitmap.width ? [i, j] : [j, i]
  big.resize(small.bitmap.width, Jimp.AUTO)

  i.blit(j, 0, i.bitmap.height * 0.9, 0, j.bitmap.height * 0.9, j.bitmap.width, j.bitmap.height * 0.1)

  filenameIndex += 1
  const filename = path.join(outDir, `heathcliff_${filenameIndex}.jpg`)

  return new Promise<string>((res, rej) => {
    i.write(filename, e => {
      if(e) {
        rej(e)
      }
      else {
        res(filename)
      }
    })
  })
}
