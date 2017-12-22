a nice bot 4 u.

dockerized. will toot extremely official heathcliff comics every six hours.


- `MASTODON_TOKEN`: a Mastodon user API token
- `TWITTER_TOKEN`: a Twitter user API token
- `MASTODON_SERVER`: the instance to which API calls should be made (usually
  where the bot user lives.) (default: https://mastodon.social)
- `DATA_DIR`: the directory in which to search for raw heathcliff comics.
  (default: 'persist')

heathbot uses the [envalid](https://github.com/af/envalid) package which in turn
wraps [dotenv](https://github.com/motdotla/dotenv), so you can alternately stick
any of the above environment variables in a file named `.env` in the project
root. (it's gitignored, so there's no risk of accidentally committing private
API tokens you put in there.)

heathbot is written in typescript, and the dockerfile will compile to js as part
of its setup. run `npm run watch:ts` if you're hacking on things and want to
automatically recompile on changes.
