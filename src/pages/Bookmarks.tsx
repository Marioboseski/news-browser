import { useEffect, useState } from "react";
import type { News } from "../types/types";
import { ArrowBigLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Bookmarks = () => {

  const [bookmarks, setBookmarks] = useState<News[]>([]);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkNews");

    if (!storedBookmarks) return;

    const parsedBookmarks = JSON.parse(storedBookmarks);

    setBookmarks(parsedBookmarks);

  }, []);

  return (
    <div>

      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-center text-2xl border-b border-gray-500">Saved news</h2>
        <Link to={"/"} className="justify-start"><ArrowBigLeft size={33} /></Link>
      </div>

      <div className="grid grid-cols-1 justify-items-center gap-2 p-3 md:grid-cols-3 md:gap-3">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="flex flex-col justify-center items-center text-center gap-2 p-3 border-2 border-gray-400 rounded-md w-full md:max-w-sm">
            <img src={bookmark.fields.thumbnail} alt={bookmark.webTitle} />
            <p>{bookmark.fields.trailText}</p>
            <p className="font-semibold">{bookmark.fields.byline}</p>
          </div>
        ))}
      </div>

    </div>

  );
}

export default Bookmarks;