import type { NewsCardProps } from "../types/types";
import { Bookmark } from "lucide-react";

const NewsCard = ({ news, onBookmark, isBookmarked, onClick }: NewsCardProps) => {
  return (
    <div onClick={() => onClick(news)} className="flex flex-col justify-center items-center text-center gap-2 p-3 border-2 border-gray-400 rounded-md w-full cursor-pointer md:max-w-sm">
      <img src={news.fields.thumbnail} alt={news.webTitle} className="max-h-40 max-w-40" />
      <p>{news.fields.trailText}</p>
      <p className="font-semibold">{news.fields.byline}</p>
      <Bookmark onClick={(e) => {e.stopPropagation(); onBookmark(news)}} fill={isBookmarked ? "black" : "white"} className="cursor-pointer" />
    </div>
  );
}

export default NewsCard;