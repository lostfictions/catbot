import * as fs from 'fs'
import * as path from 'path'
import { tmpdir } from 'os'

import * as Jimp from 'jimp'

import { randomInArray } from './util'
import { DATA_DIR } from './env'

import { CatParts, CatConfig } from './cat-config'

const filenameToPart: { [pattern: string]: CatParts } = {
  'empty': CatParts.Empty,
  'ud': CatParts.UD,
  'lr': CatParts.LR,
  'ul': CatParts.UL,
  'ur': CatParts.UR,
  'dl': CatParts.DL,
  'dr': CatParts.DR,
  'cross': CatParts.Cross,
  'butt': CatParts.Start,
  'head-r': CatParts.EndR,
  'head-u': CatParts.EndU,
  'head-l': CatParts.EndL,
  'head-d': CatParts.EndD
}

const outDir = tmpdir()

let catSprites: { [part: string]: Jimp[] }
let spriteSize: [number, number]

async function loadSprites(): Promise<{ [part: string]: Jimp[] }> {
  if(!catSprites) {
    catSprites = {}
    const prefixes = Object.keys(filenameToPart)

    const filenames = fs.readdirSync(DATA_DIR)
    if(filenames.length === 0) {
      throw new Error(`No files in image directory '${DATA_DIR}'`)
    }

    for(const fn of filenames) {
      const prefix = prefixes.find(p => fn.startsWith(p))
      if(!prefix) {
        console.warn(`Filename pattern doesn't match any known part prefix: '${fn}'`)
      }
      else {
        const sprite = await Jimp.read(path.join(DATA_DIR, fn))

        const { width, height } = sprite.bitmap
        // infer our sprite size from the first file we load
        if(!spriteSize) {
          spriteSize = [width, height]
        }
        else if(width !== spriteSize[0] || height !== spriteSize[1]) {
          throw new Error(
            `Inconsistent sprite size:\n` +
            `Expected '${fn}' to be [${spriteSize.join(', ')}],\n` +
            `instead got [${width}, ${height}]`
          )
        }

        let arr: Jimp[] | undefined = catSprites[filenameToPart[prefix]]
        if(!Array.isArray(arr)) {
          arr = []
          catSprites[filenameToPart[prefix]] = arr
        }
        arr.push(sprite)
      }
    }
    // ensure there's at least one sprite for each part
    for(const part of Object.values(filenameToPart)) {
      if(!Array.isArray((catSprites as any)[part])) {
        throw new Error(`Missing sprite category: ${part}`)
      }
    }
  }
  return catSprites
}

let filenameIndex = 0

export async function renderToImage(
  grid: CatParts[][],
  {
    gridSizeX,
    gridSizeY
  }: CatConfig
): Promise<string> {
  const parts = await loadSprites()

  const [sW, sH] = spriteSize
  const width = sW * gridSizeX
  const height = sH * gridSizeY
  // hack: bad typings
  const dest: Jimp = new (Jimp as any)(width, height)

  for(let x = 0; x < gridSizeX; x++) {
    for(let y = 0; y < gridSizeY; y++) {
      // we have to flip the y again
      const partType = grid[x][gridSizeY - y - 1]
      const sprite = randomInArray(parts[partType])
      dest.blit(sprite, sW * x, sH * y)
    }
  }

  filenameIndex += 1
  const filename = path.join(outDir, `catbot_${filenameIndex}.png`)

  return new Promise<string>((res, rej) => {
    dest.write(filename, e => {
      if(e) {
        rej(e)
      }
      else {
        res(filename)
      }
    })
  })
}
