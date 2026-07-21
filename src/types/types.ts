export type News = {
  id: string,
  webTitle: string,
  webUrl: string

  fields: {
    thumbnail: string,
    trailText: string,
    byline: string
  }
}

export type NewsCardProps = {
  news: News
}