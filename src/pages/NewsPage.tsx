import { useState, useEffect } from "react";
import { guardianApi } from "../api/guardianApi";
import NewsCard from "../components/NewsCard";
import type { News } from "../types/types";

const NewsPage = () => {

  const [section, setSection] = useState("technology");
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await guardianApi(section);
      setNews(data.response.results);
    }
    fetchNews();
  }, [section]);

  return (
    <div>
      <select onChange={(e) => setSection(e.target.value)}>
        <option value="technology">Techology</option>
        <option value="sport">Sport</option>
        <option value="science">Sceince</option>
        <option value="business">Business</option>
      </select>

      <div>
        {news.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} />
        ))}
      </div>
    </div>
  );
}

export default NewsPage;