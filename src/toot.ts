import * as fs from 'fs'
import { stringify as querystringify } from 'querystring'

import * as FormData from 'form-data'
import * as got from 'got'

import { Attachment, Status } from './mastodon'

import {
  MASTODON_SERVER,
  MASTODON_TOKEN
} from './env'

const API_POSTFIX = '/api/v1/'
const MASTODON_API_URL = MASTODON_SERVER + API_POSTFIX
const ENDPOINTS = {
  postStatus: 'statuses',
  uploadMedia: 'media'
}

const mastoAPI: { [k in keyof typeof ENDPOINTS]: string } = {} as any
for(const [k, v] of Object.entries(ENDPOINTS)) {
  (mastoAPI as any)[k] = MASTODON_API_URL + v
}

export interface TootOptions {
  status: string
  attachments?: string[]
}

export async function toot({ status, attachments = [] }: TootOptions): Promise<Status> {
  const mediaIds = await Promise.all(attachments.map(async path => {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(path))
    const mediaRes = await got(mastoAPI.uploadMedia, {
      body: formData,
      headers: { Authorization: `Bearer ${MASTODON_TOKEN}` }
    })

    return (JSON.parse(mediaRes.body) as Attachment).id
  }))


  // We have to encode the querystring ourselves because of a quirk with the
  // Mastodon API. From the docs:
  //
  // When an array parameter is mentioned, the Rails convention of specifying
  // array parameters in query strings is meant. For example, a ruby array like
  // foo = [1, 2, 3] should be encoded in the params as foo[]=1&foo[]=2&foo[]=3,
  // with empty square brackets.
  //
  // (https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#parameter-types)
  const query: any = { status }
  if(mediaIds.length > 0) {
    query['media_ids[]'] = mediaIds
  }

  const res = await got(mastoAPI.postStatus, {
    body: querystringify(query),
    headers: {
      Authorization: `Bearer ${MASTODON_TOKEN}`
    }
  })

  return JSON.parse(res.body) as Status
}
