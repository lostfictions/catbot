## catbot

a twitter and mastodon bot for node. tweets and toots very good friends.

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

in a server environment, this bot can be run with
[docker](https://docs.docker.com/) for an easier time. (i recommend
[dokku](https://dokku.com/) if you're looking for a nice way to develop and host
bots.)

the bot needs environment variables if you want it to do stuff:

- `MASTODON_TOKEN`: a Mastodon user API token
- `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_KEY`, and
  `TWITTER_ACCESS_SECRET`: you need all of these to make a tweet.
- `DATA_DIR`: the directory in which to search for cat parts and store data on
  which words have been used recently. (default: 'data', already provided
  locally)
- `CRON_RULE`: the interval between each post, in crontab format. (default:
  every four hours)

additionally, `MASTODON_SERVER` (hardcoded in [src/env.ts](src/env.ts)) controls
the mastodon instance to which API calls should be made (usually where the bot
user lives.)

catbot uses the [envalid](https://github.com/af/envalid) package which in turn
wraps [dotenv](https://github.com/motdotla/dotenv), so you can alternately stick
any of the above environment variables in a file named `.env` in the project
root. (it's gitignored, so there's no risk of accidentally committing private
API tokens you put in there.)

###### [more bots?](https://github.com/lostfictions?tab=repositories&q=botally)
