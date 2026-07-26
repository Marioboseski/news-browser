import type { NewsModalProps } from "../types/types";

const NewsModal = ({ news, onClose }: NewsModalProps) => {

  return (
    <div className="flex flex-col justify-center items-center text-white text-center fixed inset-0 bg-black/85">

      <button onClick={onClose} className="text-2xl">X</button>

      <img src={news.fields.thumbnail} alt={news.webTitle} className="border-2 rounded-md max-h-44 max-w-44" />

      <p>{news.fields.trailText}</p>

      <a href={news.webUrl} target="_blank" rel="noopener noreferrer" className="border-b ">Read more on The Guardian</a>
    </div>
  );
}

export default NewsModal;