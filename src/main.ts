require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeCat } from './catmaker'
import { twoot, Configs as TwootConfigs } from 'twoot'
import { randomInArray } from './util'

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

const adjectives = [
  `mysterious`,
  `curious`,
  `astonishing`,
  `astonished`
]

const nouns = [
  `cat`,
  `feline`
]

async function doTwoot(): Promise<void> {
  const cat = await makeCat()
  const status = `${randomInArray(adjectives)} ${randomInArray(nouns)}`
  try {
    const urls = await twoot(twootConfigs, status, [cat])
    console.log(`twooted:\n${urls.map(u => '\t -> ' + u).join('\n')}`)
  }
  catch(e) {
    console.error('error while trying to twoot: ', e)
  }
}

doTwoot().then(() => { console.log('Made initial twoots.') })

setInterval(doTwoot, 1000 * 60 * INTERVAL_MINUTES)

console.log('Catbot is running.')
