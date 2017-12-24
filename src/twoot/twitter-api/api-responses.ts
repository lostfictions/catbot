interface MediaUploadResponse {
  media_id: number
  media_id_string: string
  size: number
}

export interface ImageUploadResponse extends MediaUploadResponse {
  image: {
    w: number
    h: number
    /** The MIME type of the uploaded image. */
    image_type: string
  }
}
