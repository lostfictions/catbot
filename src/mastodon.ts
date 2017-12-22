export interface Status {
  /** The ID of the status */
  id: string

  /** A Fediverse-unique resource ID */
  uri: string

  /** URL to the status page (can be remote) */
  url: string

  /** The Account which posted the status */
  account: Account

  /** The ID of the status this toot replies to, if any */
  in_reply_to_id: string | null

  /** The ID of the account this toot replies to, if any */
  in_reply_to_account_id: string | null

  /** The reblogged Status, if any */
  reblog: Status | null

  /** Body of the status; this will contain HTML (remote HTML already sanitized) */
  content: string

  /** The time the status was created */
  created_at: string

  /** The emoji contained in this status */
  emojis: Emoji[]

  /** The number of reblogs for the status */
  reblogs_count: number

  /** The number of favourites for the status */
  favourites_count: number

  /** Whether the authenticated user has reblogged the status */
  reblogged: boolean

  /** Whether the authenticated user has favourited the status */
  favourited: boolean

  /** Whether the authenticated user has muted the conversation this status is from */
  muted: boolean

  /** Whether media attachments should be hidden by default */
  sensitive: boolean

  /** If not empty, warning text that should be displayed before the actual content */
  spoiler_text: string

  /** The visibility level of this status */
  visibility: 'public' | 'unlisted' | 'private' | 'direct'

  media_attachments: Attachment[]
  mentions: Mention[]
  tags: Tag[]

  /** Whether this is the pinned status for the account that posted it */
  pinned: boolean

  /** Application from which the status was posted */
  application: Application | null

  /** The detected language for the status, if detected */
  language: string | null
}

export interface Account {
  id: string
  username: string
  acct: string
  display_name: string
  locked: boolean
  created_at: string
  note: string
  url: string
  avatar: string
  avatar_static: string
  header: string
  header_static: string
  followers_count: number
  following_count: number
  statuses_count: number
}

export interface Emoji {
  /** The shortcode of the emoji */
  shortcode: string

  /** URL to the emoji static image */
  static_url: string

  /** URL to the emoji image */
  url: string
}

export interface Attachment {
  /** ID of the attachment */
  id: string

  type: 'image' | 'video' | 'gifv' | 'unknown'

  /** URL of the locally hosted version of the image */
  url: string

  /** For remote images, the remote URL of the original image */
  remote_url: string | null

  /** URL of the preview image */
  preview_url: string

  /** Shorter URL for the image, for insertion into text (only present on local images) */
  text_url: string | null

  meta: {
    small: AttachmentMeta
    original: AttachmentMeta
  } | null

  /** A description of the image for the visually impaired */
  description: string | null
}

interface AttachmentMeta {
  width: number
  height: number
  size: number
  aspect: number
}

export interface Mention {
  /** URL of user's profile (can be remote) */
  url: string

  /** The username of the account */
  username: string

  /** Equals username for local users, includes @domain for remote ones */
  acct: string

  /** Account ID */
  id: string
}

export interface Tag {
  /** The hashtag, not including the preceding # */
  name: string
  /** The URL of the hashtag */
  url: string
}

export interface Application {
  name: string
  website: string
}
