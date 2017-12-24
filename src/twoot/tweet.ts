import * as fs from 'fs'
import { promisify } from 'util'
const readFile = promisify(fs.readFile)

import * as Twit from 'twit'

import { Tweet } from './twitter-api/tweet'
import { ImageUploadResponse } from './twitter-api/api-responses'
import { StatusUpdateRequest, MediaUploadRequest } from './twitter-api/api-requests'


export interface TweetOptions {
  /** The text of the tweet. */
  status: string
  /** A list of file paths. */
  attachments?: string[]
  consumerKey: string
  consumerSecret: string
  accessKey: string
  accessSecret: string
}

export async function tweet({
  consumerKey,
  consumerSecret,
  accessKey,
  accessSecret,
  status,
  attachments = []
}: TweetOptions): Promise<Tweet> {
  const T = new Twit({
    access_token: accessKey,
    access_token_secret: accessSecret,
    consumer_key: consumerKey,
    consumer_secret: consumerSecret
  })

  const mediaIds = await Promise.all(attachments.map(async path => {
    const base64data = await readFile(path, { encoding: 'base64' })
    const uploadRequest: MediaUploadRequest = { media_data: base64data }
    const uploadRes = await T.post('media/upload', uploadRequest)
    return (uploadRes.data as any as ImageUploadResponse).media_id_string
  }))

  const statusRequest: StatusUpdateRequest = {
    status,
    media_ids: mediaIds.join(',')
  }

  const updateRes = await T.post('statuses/update', statusRequest as any) as any
  return updateRes.data as Tweet
}
