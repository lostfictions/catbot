require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeCat } from './catmaker'
import { twoot, Configs as TwootConfigs } from 'twoot'
import { makeStatus } from './text'

import { randomInt, randomByWeight } from './util'

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
    catChance: randomByWeight([
      [80, 10],
      [90, 5],
      [100, 10]
    ]),
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
    minSteps: randomByWeight([
      [1, 1],
      [randomInt(5, 15), 20],
      [50, 1]
    ]),
    maxSteps: randomByWeight([
      [1, 1],
      [randomInt(30, 60), 20],
      [100, 1]
    ])
  })

  const status = makeStatus(catsMade)

  try {
    const urls = await twoot(twootConfigs, status, [filename])
    console.log(`[${new Date().toISOString()}] twooted:\n${urls.map(u => '\t -> ' + u).join('\n')}`)
  }
  catch(e) {
    console.error('error while trying to twoot: ', e)
  }
}

doTwoot().then(() => { console.log('Made initial twoots.') })

setInterval(doTwoot, 1000 * 60 * INTERVAL_MINUTES)

console.log('Catbot is running.')
