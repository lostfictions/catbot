require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeHeathcliff } from './heath'
import { toot } from './toot'

setInterval(
  () => (async () => {
    const cliff = await makeHeathcliff()
    const res = await toot({ status: "Today's Heathcliff:", attachments: [cliff] })
    console.log(`Tooted a Heath: ${res.url}`)
  })().catch(e => {
    console.error(e)
  }),
  1000 * 60 * 60 * 6 // Every six hours
)

console.log('Heathbot is running.')
