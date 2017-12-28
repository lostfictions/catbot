require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeCat } from './catmaker'
import { makeStatus } from './text'

import { randomInt, randomInArray } from './util'

makeCat({
  catChance: randomInt(30, 100),
  leftChance: randomInt(100),
  rightChance: randomInt(100),
  straightChance: randomInt(100),
  minSteps: randomInArray([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 50]),
  maxSteps: randomInArray([1, 2, 30, 35, 40, 45, 50, 55, 60, 100, 500])
}).then(({ filename, params, catsMade }) => {
  console.log(`made ${makeStatus(catsMade)} at ${filename}`)
  console.log('creation params:', `(${catsMade} cats)`)
  console.dir(params)
})
