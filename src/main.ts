require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeHeathcliff } from './heath'
import { toot } from './twoot/toot'
import { tweet } from './twoot/tweet'
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

const messages = [
  `Today's Heathcliff:`,
  `Heathcliff comic for today:`,
  `It's Heathcliff!`,
  `Here's Heathcliff!`
]

async function twoot(): Promise<void> {
  const cliff = await makeHeathcliff()
  const status = randomInArray(messages)
  if(isValidMastodonConfiguration) {
    try {
      const postedToot = await toot({
        status,
        attachments: [cliff],
        token: MASTODON_TOKEN,
        server: MASTODON_SERVER
      })
      console.log(`Tooted a Heath: ${postedToot.url}`)
    }
    catch(e) {
      console.error('error while trying to toot: ', e)
    }
  }
  if(isValidTwitterConfiguration) {
    try {
      const t = await tweet({
        consumerKey,
        consumerSecret,
        accessKey,
        accessSecret,
        status,
        attachments: [cliff]
      })

      console.log(`Tweeted a Heath: https://twitter.com/${t.user.screen_name}/status/${t.id_str}`)
    }
    catch(e) {
      console.error('error while trying to tweet: ', e)
    }
  }
}

twoot().then(() => { console.log('Made initial twoots.') })

setInterval(twoot, 1000 * 60 * INTERVAL_MINUTES)

console.log('Heathbot is running.')
