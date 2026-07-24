import { useEffect, useState } from "react";
import type { News } from "../types/types";

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
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id}>
          <img src={bookmark.fields.thumbnail} alt={bookmark.webTitle} />
          <p>{bookmark.fields.trailText}</p>
          <p className="font-semibold">{bookmark.fields.byline}</p>
        </div>
      ))}
    </div>
  );
}

export default Bookmarks;