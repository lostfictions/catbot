require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeCat } from './catmaker'
import { twoot, Configs as TwootConfigs } from 'twoot'
import { makeStatus } from './text'

import { randomInArray, randomInt, randomByWeight } from './util'

import {
  MASTODON_SERVER,
  MASTODON_TOKEN,
  isValidMastodonConfiguration,

  TWITTER_CONSUMER_KEY as consumerKey,
  TWITTER_CONSUMER_SECRET as consumerSecret,
  TWITTER_ACCESS_KEY as accessKey,
  TWITTER_ACCESS_SECRET as accessSecret,
  isValidTwitterConfiguration,

  INTERVAL_MINUTES
} from './env'

const twootConfigs: TwootConfigs = []
if(isValidMastodonConfiguration) {
  twootConfigs.push({
    token: MASTODON_TOKEN,
    server: MASTODON_SERVER
  })
}
if(isValidTwitterConfiguration) {
  twootConfigs.push({
    consumerKey,
    consumerSecret,
    accessKey,
    accessSecret
  })
}

async function doTwoot(): Promise<void> {
  const { filename, catsMade } = await makeCat({
    catChance: randomInt(30, 100),
    leftChance: randomByWeight([[0, 1], [randomInt(100), 20]]),
    rightChance: randomByWeight([[0, 1], [randomInt(100), 20]]),
    straightChance: randomByWeight([[0, 1], [randomInt(100), 20]]),
    minSteps: randomInArray([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 50]),
    maxSteps: randomInArray([1, 2, 30, 35, 40, 45, 50, 55, 60, 100, 500])
  })

  const status = makeStatus(catsMade)

  try {
    const urls = await twoot(twootConfigs, status, [filename])
    console.log(`twooted:\n${urls.map(u => '\t -> ' + u).join('\n')}`)
  }
  catch(e) {
    console.error('error while trying to twoot: ', e)
  }
}

doTwoot().then(() => { console.log('Made initial twoots.') })

setInterval(doTwoot, 1000 * 60 * INTERVAL_MINUTES)

console.log('Catbot is running.')
