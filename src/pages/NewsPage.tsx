import { useState, useEffect, useRef } from "react";
import { guardianApi } from "../api/guardianApi";
import NewsCard from "../components/NewsCard";
import type { News } from "../types/types";

const NewsPage = () => {

  const [section, setSection] = useState("technology");
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);

      try {
        const data = await guardianApi(section, page);
        
        const results = data.response.results;

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
  }, [section, page]);

  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry.isIntersecting) return;

      if (isLoading || !hasMore) return;

      setPage((prevPage) => prevPage + 1);
    });

    if (!loaderRef.current) return;
    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    }

  }, [isLoading, hasMore]);

  const handleSectionChange = (section: string) => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    setSection(section);
  }

  return (
    <div>
      <select onChange={(e) => handleSectionChange(e.target.value)}>
        <option value="technology">Techology</option>
        <option value="sport">Sport</option>
        <option value="science">Sceince</option>
        <option value="business">Business</option>
      </select>

      <div className="grid grid-cols-1 justify-items-center gap-2 p-3 md:grid-cols-3 md:gap-3">
        {news.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} />
        ))}
      </div>
      {isLoading && <p className="text-3xl text-red-500">Loading more news</p>}
      {!hasMore && <p className=" text-center text-3xl text-red-500">No more news</p>}
      <div ref={loaderRef}>
      </div>
    </div>
  );
}

export default NewsPage;