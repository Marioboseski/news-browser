import type { NewsCardProps } from "../types/types";

const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-2 p-3 border-2 border-gray-400 rounded-md w-full md:max-w-sm">
      <img src={news.fields.thumbnail} alt={news.webTitle} className="max-h-40 max-w-40" />
      <p>{news.fields.trailText}</p>
      <p className="font-semibold">{news.fields.byline}</p>
    </div>
  );
}

export default NewsCard;