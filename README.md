## catbot

a ~~twitter and~~ mastodon bot for node. ~~tweets and~~ toots very good friends.

> twitter support was removed in 2023 following twitter api changes which
> resulted in the shutdown of most bots.

![some cats](https://i.imgur.com/bWQ7Y75.png)

![more cats](https://i.imgur.com/4NXrvB5.png)

you can run it on your computer or remix it into something new! you'll need node
and [yarn](https://yarnpkg.com) (and git) installed. then run:

```
git clone https://github.com/lostfictions/catbot
cd catbot
yarn install
yarn dev
```

this bot runs on github actions. check [the workflow
file](.github/workflows/twoot.yml) for details.

the bot needs a few environment variables to be set if you want it to do stuff:

- `MASTODON_TOKEN`: a Mastodon user API token
- ~~`TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_KEY`, and
  `TWITTER_ACCESS_SECRET`: you need all of these to make a tweet.~~ no longer
  used.
- `DATA_DIR`: the directory in which to search for cat parts and store data on
  which words have been used recently. (default: 'data', already provided
  locally)

additionally, `MASTODON_SERVER` (hardcoded in [src/env.ts](src/env.ts)) controls
the mastodon instance to which API calls should be made (usually where the bot
user lives.)

###### [more bots?](https://github.com/lostfictions?tab=repositories&q=botally)
