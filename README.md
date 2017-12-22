a nice bot 4 u.

dockerized. will spin up Slack and/or Discord clients if the respective
environment variables are present. possible env vars are:

- `SLACK_TOKENS`: a Slack API token, or a comma-separated list of Slack API
  tokens
- `DISCORD_TOKEN`: a Discord API token
- `USE_CLI`: if 'true', will start up an interface that reads from stdin and
  prints to stdout instead of connecting to any servers.
- `BOT_NAME`: the bot name (default: 'bort')
- `DATA_DIR`: the directory to store persistent data (default: 'persist')
- `HOSTNAME`: hostname for the bot's server component (defaults to 'localhost'
  in a dev environment, required in production)
- `PORT`: port number for the bot's server component (defaults to 8080 in a dev
  environment, required in production)

(check the `peerio` branch if you're looking for support for that service.)

each service that bort connects to gets its own isolated data store. stores are
serialized to json in the directory provided as the `DATA_DIR`.

bort uses the [envalid](https://github.com/af/envalid) package which in turn
wraps [dotenv](https://github.com/motdotla/dotenv), so you can alternately stick
any of the above environment variables in a file named `.env` in the project
root. (it's gitignored, so there's no risk of accidentally committing private
API tokens you put in there.)

the "server component" mentioned above currently serves two purposes:

- it serves static files, like the bot's profile image (which must be hosted for
  services like Slack and Discord) and generated comics.
- it's a ping server that you can use in combination with a service like
  uptimerobot.com to verify if the bot is still running. (...and it's useful in
  the free tier of certain SaaSes to prevent the bot from going to sleep.)

eventually the plan is to have a full web-based management interface (that
optionally authenticates through your Slack or Discord account via OAuth) but
that's a bit ambitious for a hobby project designed for sharing funny gifs and
making bad rhymes.

`npm start` will start the bot in production mode. Use `npm run dev` if you want
to run online but restart on any change, or `npm run cli` to spin up a command
line interface for testing that will restart on any change.

bort is written in typescript, and the dockerfile will compile to js as part of
its setup. run `npm run watch-cli` or `npm run watch-dev` if you're hacking on
things and want an auto-reloading cli interface or live client, respectively.
