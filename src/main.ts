require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeHeathcliff } from './heath'
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

const messages = [
  `Today's Heathcliff:`,
  `Heathcliff comic for today:`,
  `It's Heathcliff!`,
  `Here's Heathcliff!`
]

async function doTwoot(): Promise<void> {
  const cliff = await makeHeathcliff()
  const status = randomInArray(messages)
  try {
    const urls = await twoot(twootConfigs, status, [cliff])
    for(const url of urls) {
      console.log(`twooted at '${url}'!`)
    }
  }
  catch(e) {
    console.error('error while trying to twoot: ', e)
  }
}

doTwoot().then(() => { console.log('Made initial twoots.') })

setInterval(doTwoot, 1000 * 60 * INTERVAL_MINUTES)

console.log('Heathbot is running.')
