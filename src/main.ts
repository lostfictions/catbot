require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeHeathcliff } from './heath'
import { toot } from './twoot/toot'
// import { tweet } from './twoot/tweet'

import {
  MASTODON_SERVER,
  MASTODON_TOKEN,
  // TWITTER_CONSUMER_KEY as consumerKey,
  // TWITTER_CONSUMER_SECRET as consumerSecret,
  // TWITTER_ACCESS_KEY as accessKey,
  // TWITTER_ACCESS_SECRET as accessSecret,
  isValidMastodonConfiguration,
  // isValidTwitterConfiguration
} from './env'

setInterval(
  (async () => {
    const cliff = await makeHeathcliff()
    const status = "Today's Heathcliff:"
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
    // if(isValidTwitterConfiguration) {
    //   try {
    //     const t = await tweet({
    //       consumerKey,
    //       consumerSecret,
    //       accessKey,
    //       accessSecret,
    //       status,
    //       attachments: [cliff]
    //     })

    //     console.log(`Tweeted! ${t.created_at}`)
    //   }
    //   catch(e) {
    //     console.error('error while trying to tweet: ', e)
    //   }
    // }
  }),
  1000 * 60 * 60 * 6 // Every six hours
)

console.log('Heathbot is running.')
