export interface User {
  /**
   * The integer representation of the unique identifier for this User. This
   * number is greater than 53 bits and some programming languages may have
   * difficulty/silent defects in interpreting it. Using a signed 64 bit integer
   * for storing this identifier is safe. Use `id_str` for fetching the identifier
   * to stay on the safe side.
   *
   * Example:
   *
   * `"id": 6253282`
   */
  id: number

  /**
   * The string representation of the unique identifier for this User.
   * Implementations should use this rather than the large, possibly
   * un-consumable integer in `id`.
   *
   * Example:
   *
   * `"id_str": "6253282"`
   */
  id_str: string

  /**
   * The name of the user, as they’ve defined it. Not necessarily a person’s
   * name. Typically capped at 20 characters, but subject to change.
   *
   * Example:
   *
   * `"name": "Twitter API"`
   */
  name: string

  /**
   * The screen name, handle, or alias that this user identifies themselves
   * with. `screen_name`s are unique but subject to change. Use `id_str` as a
   * user identifier whenever possible. Typically a maximum of 15 characters
   * long, but some historical accounts may exist with longer names.
   */
  screen_name: string

  /**
   * The user-defined location for this account’s profile. Not necessarily a
   * location, nor machine-parseable. This field will occasionally be fuzzily
   * interpreted by the Search service.
   *
   * Example:
   *
   * "location": "San Francisco, CA"
   */
  location?: string

  /**
   * A URL provided by the user in association with their profile.
   *
   * Example:
   *
   * `"url": "https://dev.twitter.com"`
   */
  url?: string

  /**
   * The user-defined UTF-8 string describing their account.
   *
   * Example:
   *
   * `"description": "The Real Twitter API."`
   */
  description?: string

  /**
   * Collection of Enrichment metadata derived for user. Provides the Profile
   * Geo and Klout Enrichment metadata.
   *
   * Example:
   *
   * `"derived": { "locations": [{}], "klout": [{}] }`
   */
  derived: Enrichment[]

  /**
   * When true, indicates that this user has chosen to protect their Tweets.
   */
  protected: boolean

  /**
   * When true, indicates that the user has a verified account.
   */
  verified: boolean

  /**
   * The number of followers this account currently has. Under certain
   * conditions of duress, this field will temporarily indicate “0”.
   *
   * Example:
   *
   * `"followers_count": 21`
   */
  followers_count: number

  /**
   * The number of users this account is following (AKA their “followings”).
   * Under certain conditions of duress, this field will temporarily indicate
   * “0”.
   *
   * Example:
   *
   * "friends_count": 32
   */
  friends_count: number

  /**
   * The number of public lists that this user is a member of.
   *
   * Example:
   *
   * `"listed_count": 9274`
   */
  listed_count: number

  /**
   * The number of Tweets this user has liked in the account’s lifetime. British
   * spelling used in the field name for historical reasons.
   *
   * Example:
   *
   * `"favourites_count": 13`
   */
  favourites_count: number

  /**
   * The number of Tweets (including retweets) issued by the user.
   *
   * Example:
   *
   * `"statuses_count": 42`
   */
  statuses_count: number

  /**
   * The UTC datetime that the user account was created on Twitter.
   *
   * Example:
   *
   * `"created_at": "Mon Nov 29 21:18:15 +0000 2010"`
   */
  created_at: string

  /**
   * The offset from GMT/UTC in seconds.
   *
   * Example:
   *
   * `"utc_offset": -18000`
   */
  utc_offset?: number

  /**
   * A string describing the Time Zone this user declares themselves within.
   *
   * Example:
   *
   * `"time_zone": "Pacific Time (US & Canada)"`
   */
  time_zone?: string

  /**
   * When true, indicates that the user has enabled the possibility of
   * geotagging their Tweets. This field must be true for the current user to
   * attach geographic data when using POST `statuses`/`update`.
   *
   * Example:
   *
   * `"geo_enabled": true`
   */
  geo_enabled: boolean

  /**
   * The BCP 47 code for the user’s self-declared user interface language. May
   * or may not have anything to do with the content of their Tweets.
   *
   * Examples:
   *
   * `"lang": "en"` `"lang": "msa"` `"lang": "zh-cn"`
   */
  lang: string

  /**
   * Indicates that the user has an account with “contributor mode” enabled,
   * allowing for Tweets issued by the user to be co-authored by another
   * account. Rarely true (this is a legacy field).
   */
  contributors_enabled: boolean

  /**
   * The hexadecimal color chosen by the user for their background.
   *
   * Example:
   *
   * `"profile_background_color": "e8f2f7"`
   */
  profile_background_color: string

  /**
   * A HTTP-based URL pointing to the background image the user has uploaded for
   * their profile.
   *
   * Example:
   *
   * `"profile_background_image_url": "http://a2.twimg.com/profile_background_images/229557229/twitterapi-bg.png"`
   */
  profile_background_image_url: string

  /**
   * A HTTPS-based URL pointing to the background image the user has uploaded
   * for their profile.
   *
   * Example:
   *
   * `"profile_background_image_url_https":
   * "https://si0.twimg.com/profile_background_images/229557229/twitterapi-bg.png"`
   */
  profile_background_image_url_https: string

  /**
   * When true, indicates that the user’s `profile_background_image_url` should
   * be tiled when displayed.
   */
  profile_background_tile: boolean

  /**
   * The HTTPS-based URL pointing to the standard web representation of the
   * user’s uploaded profile banner. By adding a final path element of the URL,
   * it is possible to obtain different image sizes optimized for specific
   * displays.
   *
   * For size variants, please see [User Profile Images and
   * Banners](https://developer.twitter.com/en/docs/accounts-and-users/user-profile-images-and-banners).
   *
   * Example:
   *
   * `"profile_banner_url":
   * "https://si0.twimg.com/profile_banners/819797/1348102824"`
   */
  profile_banner_url: string

  /**
   * A HTTP-based URL pointing to the user’s profile image. See [User Profile
   * Images and Banners](https://developer.twitter.com/en/docs/accounts-and-users/user-profile-images-and-banners).
   *
   * Example:
   *
   * `"profile_image_url":
   * "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"`
   */
  profile_image_url: string

  /**
   * A HTTPS-based URL pointing to the user’s profile image.
   *
   * Example:
   *
   * `"profile_image_url_https":
   * "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"`
   */
  profile_image_url_https: string

  /**
   * The hexadecimal color the user has chosen to display links with in their
   * Twitter UI.
   *
   * Example:
   *
   * `"profile_link_color": "0094C2"`
   */
  profile_link_color: string

  /**
   * The hexadecimal color the user has chosen to display sidebar borders with
   * in their Twitter UI.
   *
   * Example:
   *
   * `"profile_sidebar_border_color": "0094C2"`
   */
  profile_sidebar_border_color: string

  /**
   * The hexadecimal color the user has chosen to display sidebar backgrounds
   * with in their Twitter UI.
   *
   * Example:
   *
   * `"profile_sidebar_fill_color": "a9d9f1"`
   */
  profile_sidebar_fill_color: string

  /**
   * The hexadecimal color the user has chosen to display text with in their
   * Twitter UI.
   *
   * Example:
   *
   * `"profile_text_color": "437792"`
   */
  profile_text_color: string

  /**
   * When true, indicates the user wants their uploaded background image to be
   * used.
   */
  profile_use_background_image: boolean

  /**
   * When true, indicates that the user has not altered the theme or background
   * of their user profile.
   */
  default_profile: boolean

  /**
   * When true, indicates that the user has not uploaded their own profile image
   * and a default image is used instead.
   */
  default_profile_image: boolean

  /*
   * When present, indicates a textual representation of the two-letter country
   * codes this user is withheld from.
   *
   * Example:
   *
   * "withheld_in_countries": "GR, HK, MY"
   */
  withheld_in_countries?: string

  /**
   * When present, indicates whether the content being withheld is the “status”
   * or a “user.”
   *
   * Example:
   *
   * "withheld_scope": "user"
   */
  withheld_scope?: 'status' | 'user'
}

type Enrichment = any
