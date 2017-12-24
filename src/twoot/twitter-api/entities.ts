export interface Entities {
  /**
   * Represents hashtags which have been parsed out of the Tweet text.
   *
   * The `hashtags` array will be empty if no hashtags are present.
   */
  hashtags: Hashtag[]

  /**
   * Represents media elements uploaded with the Tweet.
   *
   * Will contain a Media object if any media object has been attached to the
   * Tweet. If no native media has been attached, there will be no `media` array
   * in the entities.
   *
   * For the following reasons the `extended_entities` section should be used to
   * process Tweet native media:
   *
   * - Media type will always indicate ‘photo’ even in cases of a video and GIF
   *   being attached to Tweet.
   *
   * - Even though up to four photos can be attached, only the first one will be
   *   listed in the entities section.
   */
  media?: Media[]

  /**
   * Represents URLs included in the text of a Tweet.
   */
  urls: TwitterURL[]

  /**
   * Represents other Twitter users mentioned in the text of the Tweet.
   */
  user_mentions: UserMention[]

  /**
   * Represents symbols, ie. $cashtags, included in the text of the Tweet.
   */
  symbols: TwitterSymbol[]

  /**
   * Represents Twitter Polls included in the Tweet.
   */
  polls: Poll[]
}

/**
 * When it comes to any native media (photo, video, or GIF), `extended_entities`
 * is the preferred metadata source for several reasons. Currently, up to four
 * photos can be attached to a Tweet. The `entities` metadata will only contain
 * the first photo (until 2014, only one photo could be included), while the
 * `extended_entities` section will include _all_ attached photos.
 *
 * Tweets can only have one type of media attached to it. For photos, up to four
 * photos can be attached. For videos and GIFs, one can be attached. Since the
 * media `type` metadata in the `extended_entities` section correctly indicates
 * the media type (`photo`, `video` or `animated_gif`), and supports up to 4
 * photos, it is the preferred metadata source for native media.
 */
export interface ExtendedEntities {
  /**
   * Represents media elements uploaded with the Tweet.
   *
   * Will contain a Media object if any media object has been attached to the
   * Tweet. If no native media has been attached, there will be no `media` array
   * in the entities.
   *
   * For the following reasons the `extended_entities` section should be used to
   * process Tweet native media:
   *
   * - Media type will always indicate ‘photo’ even in cases of a video and GIF
   *   being attached to Tweet.
   *
   * - Even though up to four photos can be attached, only the first one will be
   *   listed in the entities section.
   */
  media?: Media[]
}

export interface Hashtag {
  /**
   * An array of integers indicating the offsets within the Tweet text where the
   * hashtag begins and ends. The first integer represents the location of the #
   * character in the Tweet text string. The second integer represents the
   * location of the first character after the hashtag. Therefore the difference
   * between the two numbers will be the length of the hashtag name plus one
   * (for the ‘#’ character).
   *
   * Example:
   *
   * `"indices":[32,38]`
   */
  indices: [number, number]

  /**
   * Name of the hashtag, minus the leading ‘#’ character.
   *
   * Example:
   *
   * `"text": "nodejs"`
   */
  text: string
}


export interface Media {
  /**
   * URL of the media to display to clients.
   *
   * Example:
   *
   * `"display_url":"pic.twitter.com/rJC5Pxsu"`
   */
  display_url: string

  /**
   * An expanded version of display_url. Links to the media display page.
   *
   * Example:
   *
   * `"expanded_url":
   * "http://twitter.com/yunorno/status/114080493036773378/photo/1"`
   */
  expanded_url: string

  /**
   * ID of the media expressed as a 64-bit integer.
   *
   * Example:
   *
   * `"id":114080493040967680`
   */
  id: number

  /**
   * ID of the media expressed as a string.
   *
   * Example:
   *
   * `"id_str":"114080493040967680"`
   */
  id_str: string

  /**
   * An array of integers indicating the offsets within the Tweet text where the
   * URL begins and ends. The first integer represents the location of the first
   * character of the URL in the Tweet text. The second integer represents the
   * location of the first non-URL character occurring after the URL (or the end
   * of the string if the URL is the last part of the Tweet text).
   *
   * Example:
   *
   * `"indices":[15,35]`
   */
  indices: [number, number]

  /**
   * An `http://` URL pointing directly to the uploaded media file.
   *
   * Example:
   *
   * `"media_url":"http://p.twimg.com/AZVLmp-CIAAbkyy.jpg"`
   *
   * For media in direct messages, `media_url` is the same https URL as
   * `media_url_https` and must be accessed via an authenticated twitter.com
   * session or by signing a request with the user’s access token using OAuth
   * 1.0A. It is not possible to directly embed these images in a web page.
   */
  media_url: string

  /**
   * An `https://` URL pointing directly to the uploaded media file, for
   * embedding on https pages.
   *
   * Example:
   *
   * `"media_url_https":"https://p.twimg.com/AZVLmp-CIAAbkyy.jpg"`
   *
   * For media in direct messages, `media_url_https` must be accessed via an
   * authenticated twitter.com session or by signing a request with the user’s
   * access token using OAuth 1.0A. It is not possible to directly embed these
   * images in a web page.
   */
  media_url_https: string

  /**
   * An object showing available sizes for the media file.
   */
  sizes: Sizes

  /**
   * For Tweets containing media that was originally associated with a different
   * tweet, this ID points to the original Tweet.
   *
   * Example:
   *
   * `"source_status_id": 205282515685081088`
   */
  source_status_id?: number

  /**
   * For Tweets containing media that was originally associated with a different
   * tweet, this string-based ID points to the original Tweet.
   *
   * Example:
   *
   * `"source_status_id_str": "205282515685081088"`
   */
  source_status_id_str?: string

  /**
   * Type of uploaded media. Possible types include photo, video, and
   * animated_gif.
   *
   * Example:
   *
   * `"type":"photo"`
   */
  type: 'photo' | 'video' | 'animated_gif'

  /**
   * Wrapped URL for the media link.This corresponds with the URL embedded
   * directly into the raw Tweet text, and the values for the indices parameter.
   *
   * Example:
   *
   * `"url": "http://t.co/rJC5Pxsu"`
   */
  url: string
}

export interface Sizes {
  /**
   * Information for a thumbnail-sized version of the media.
   */
  thumb: Size

  /**
   * Information for a large-sized version of the media.
   */
  large: Size

  /**
   * Information for a medium-sized version of the media.
   */
  medium: Size

  /**
   * Information for a small-sized version of the media.
   */
  small: Size
}

export interface Size {
  /**
   * Width in pixels of this size.
   */
  w: number

  /**
   * Height in pixels of this size.
   */
  h: number

  /**
   * Resizing method used to obtain this size. A value of `fit` means that the
   * media was resized to fit one dimension, keeping its native aspect ratio. A
   * value of `crop` means that the media was cropped in order to fit a specific
   * resolution.
   */
  resize: 'crop' | 'fit'
}

type TwitterURL = any
type TwitterSymbol = any
type UserMention = any
type Poll = any
