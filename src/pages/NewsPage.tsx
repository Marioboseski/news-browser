import { useState, useEffect, useRef } from "react";
import { guardianApi } from "../api/guardianApi";
import NewsCard from "../components/NewsCard";
import NewsModal from "../components/NewsModal";
import type { News } from "../types/types";
import { Link } from "react-router-dom";

const NewsPage = () => {

  const [section, setSection] = useState("technology");
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<News[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ selectedNews, setSelectedNews ] = useState<News | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);

      try {
        console.log("current page", page);
        const data = await guardianApi({section, search: searchQuery, fromDate, toDate, page});
        const results = data.response.results;
        console.log(results.length);

        if (data.response.currentPage >= data.response.pages) {
          setHasMore(false);
        }

        setNews((prevNews) => {
          return [...prevNews, ...results];
        });

      } catch (error) {
        console.error("Failed to fetch news:", error);

      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, [section, searchQuery, fromDate, toDate, page]);

  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry.isIntersecting) return;

      if (isLoading || !hasMore) return;

      console.log("Observer fired");
      setPage((prevPage) => prevPage + 1);
    });

    if (!loaderRef.current) return;
    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    }

  }, [isLoading, hasMore]);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkNews");
    
    if (!storedBookmarks) return;

    const parsedBookmarks = JSON.parse(storedBookmarks);

    setBookmarks(parsedBookmarks);
  }, []);

  const handleSectionChange = (section: string) => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    setSection(section);
    setSearch("");
    setSearchQuery("");
    setFromDate("");
    setToDate("");
  }

  const handleSearch = () => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    setSearchQuery(search);
  }

  const handleBookmark = (news: News) => {
    const storedBookmarks = localStorage.getItem("bookmarkNews");

    const bookmarks: News[] = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    const alreadyBookmarked = bookmarks.some((bookmark) => {
      return bookmark.id === news.id
    });

    if (alreadyBookmarked) {
      const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== news.id);
      localStorage.setItem("bookmarkNews", JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
      return;
    };

    const updatedBookmarks = [...bookmarks, news];

    localStorage.setItem("bookmarkNews", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  }

  const handleOpenModal = (news: News) => {
    setSelectedNews(news);
  }

  return (
    <div className="p-3">
      <div className="flex flex-col justify-evenly items-center min-h-52">

        <div className="flex gap-3">
          <select onChange={(e) => handleSectionChange(e.target.value)}>
            <option value="technology">Techology</option>
            <option value="sport">Sport</option>
            <option value="science">Sceince</option>
            <option value="business">Business</option>
          </select>

          <input type="text"
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-gray-400 rounded-md p-1 w-full max-w-40" />
          <button onClick={handleSearch} className="border border-black rounded-md p-1">Search</button>
        </div>

        <div className="flex justify-around items-center w-full">
          <input type="date"
            value={fromDate}
             onChange={(e) => setFromDate(e.target.value)} />

          <input type="date"
            value={toDate}
             onChange={(e) => setToDate(e.target.value)} />
        </div>
        <Link to={"/bookmarks"} className=" text-lg border-b border-gray-500">See saved news</Link>
      </div>

      <div className="grid grid-cols-1 justify-items-center gap-2 p-3 md:grid-cols-3 md:gap-3">
        {news.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} onBookmark={handleBookmark} isBookmarked={bookmarks.some((bookmark) => bookmark.id === newsItem.id)} onClick={handleOpenModal} />
        ))}
      </div>
      {isLoading && <p className="text-3xl text-red-500">Loading more news</p>}
      {!hasMore && <p className=" text-center text-3xl text-red-500">No more news</p>}
      <div ref={loaderRef}>
      </div>
      {selectedNews && (
        <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </div>
  );
}

export default NewsPage;