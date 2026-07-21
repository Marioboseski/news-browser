import { useState, useEffect, useRef } from "react";
import { guardianApi } from "../api/guardianApi";
import NewsCard from "../components/NewsCard";
import type { News } from "../types/types";

const NewsPage = () => {

  const [section, setSection] = useState("technology");
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);

      try {
        const data = await guardianApi(section, page);

        setNews((prevNews) => {
          return [...prevNews, ...data.response.results];
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

      if(isLoading) return;

      setPage((prevPage) => prevPage + 1);
    });

    if (!loaderRef.current) return;
    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    }

  }, [isLoading]);

  const handleSectionChange = (section: string) => {
    setNews([]);
    setPage(1);
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
      <div ref={loaderRef}>
      </div>
    </div>
  );
}

export default NewsPage;