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
  onBookmark: (news: News) => void
  isBookmarked: boolean
  onClick: (news: News) => void
}

export type NewsModalProps = {
  news: News
  onClose: () => void
}

export type GuardianApi = {
  section: string,
  search: string,
  fromDate: string,
  toDate: string,
  page: number
}