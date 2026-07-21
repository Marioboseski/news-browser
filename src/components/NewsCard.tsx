import type { NewsCardProps } from "../types/types";

const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <div>
      <img src={news.fields.thumbnail} alt={news.webTitle} />
      <p>{news.fields.trailText}</p>
      <p>{news.fields.byline}</p>
    </div>
  );
}

export default NewsCard;