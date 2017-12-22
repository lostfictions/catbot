import * as fs from 'fs'
import * as envalid from 'envalid'

const env = envalid.cleanEnv(
  process.env,
  {
    DATA_DIR: envalid.str({ default: 'persist' }),
    MASTODON_SERVER: envalid.url({ default: 'https://mastodon.social' }),
    MASTODON_TOKEN: envalid.str({ default: '' }),
    TWITTER_TOKEN: envalid.str({ default: '' })
  },
  { strict: true }
)

export const {
  DATA_DIR,
  MASTODON_SERVER,
  MASTODON_TOKEN,
  TWITTER_TOKEN
} = env

if(!fs.existsSync(DATA_DIR)) {
  throw new Error(`Data directory '${DATA_DIR}' doesn't exist!`)
}

const isValidConfiguration = MASTODON_TOKEN || TWITTER_TOKEN

if(!isValidConfiguration) {
  console.error(`Invalid environment config! Bot will do nothing if no Mastodon or Twitter API token is present.`)

  const varsToCheck: (keyof typeof env)[] = ['MASTODON_TOKEN', 'TWITTER_TOKEN']
  const configInfo = varsToCheck.map(key => `${key}: ${env[key] ? 'OK' : 'NONE'}`).join('\n')
  throw new Error(configInfo)
}
