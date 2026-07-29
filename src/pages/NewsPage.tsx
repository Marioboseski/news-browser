import { useState, useEffect, useRef } from "react";
import { guardianApi } from "../api/guardianApi";
import NewsCard from "../components/NewsCard";
import NewsModal from "../components/NewsModal";
import type { News, SavedSearch } from "../types/types";
import { Link } from "react-router-dom";
import { getBookmarks, toggleBookmark } from "../utils/bookmarks";
import { getSavedSearches, saveSearches } from "../utils/savedSearches";
import SavedSearches from "../components/SavedSearches";

const NewsPage = () => {

  const [section, setSection] = useState("technology");
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedSearches, setSavedSearches] = useState(getSavedSearches());
  const [bookmarks, setBookmarks] = useState<News[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [orderBy, setOrderBy] = useState("newest");
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loaderRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const data = await guardianApi({ section, search: searchQuery, fromDate, toDate, orderBy, page });
        const results: News[] = data.response.results;

        setNoResults(results.length === 0);

        if (data.response.currentPage >= data.response.pages) {
          setHasMore(false);
        }

        setNews((prevNews) => {
          const merged = [...prevNews, ...results];

          const unique = merged.filter(
            (item, index, array) =>
              index === array.findIndex((index) => index.id === item.id)
          );

          return unique;
        });

      } catch (error) {
        setError(true);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }

      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, [section, searchQuery, fromDate, toDate, orderBy, page]);

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

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const resetNews = () => {
    setNews([]);
    setPage(1);
    setHasMore(true);
  }

  const handleSectionChange = (section: string) => {
    resetNews();
    setSection(section);
    setSearch("");
    setSearchQuery("");
    setFromDate("");
    setToDate("");
  }

  const handleSearch = () => {
    resetNews();
    setSearchQuery(search);
  }

  const handleSaveSearch = () => {
    const searches = getSavedSearches();

    const newSearch = {
      id: crypto.randomUUID(),
      query: searchQuery,
      section,
      fromDate,
      toDate,
      orderBy,
    };

    const updatedSearches = ([...searches, newSearch]);
    saveSearches(updatedSearches);
    setSavedSearches(updatedSearches);
  }

  const handleApplySearch = ({ query, section, fromDate, toDate, orderBy }: SavedSearch) => {
    resetNews();
    setSearch(query);
    setSearchQuery(query);
    setSection(section);
    setFromDate(fromDate);
    setToDate(toDate);
    setOrderBy(orderBy);
  }

  const handleDeleteSearch = (searches: SavedSearch) => {
    const updatedSavedSearches = savedSearches.filter(savedSearch => (
      savedSearch.id !== searches.id
    ));
    saveSearches(updatedSavedSearches);
    setSavedSearches(updatedSavedSearches);
  }

  const handleBookmark = (news: News) => {
    const updatedBookmarks = toggleBookmark(news);
    setBookmarks(updatedBookmarks);
  }

  const handleOpenModal = (news: News) => {
    setSelectedNews(news);
  }

  const handleOrderByChange = (orderBy: string) => {
    resetNews();
    setOrderBy(orderBy);
  }

  const handleRetry = () => {
    resetNews();
    setError(false);
  }

  return (
    <div className="p-2">
      <div className="flex flex-col justify-evenly items-center min-h-52">

        <div className="flex gap-3">
          <select value={section} onChange={(e) => handleSectionChange(e.target.value)}>
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
          <button onClick={handleSaveSearch} className="border-2 border-black rounded-md p-1">Save search</button>

          <select value={orderBy} onChange={(e) => handleOrderByChange(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="relevance">Relevance</option>
          </select>
        </div>

        <div className="flex justify-around items-center w-full">
          <div className="flex flex-col text-center">
            <label className="border-b border-gray-600 font-semibold">From Date</label>
            <input type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)} />
          </div>

          <div className="flex flex-col text-center">
            <label className="border-b border-gray-600 w-full font-semibold">To Date</label>
            <input type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
        <Link to={"/bookmarks"} className=" text-lg border-b border-gray-500">See saved news</Link>
      </div>

      <SavedSearches savedSearches={savedSearches} onApply={handleApplySearch} onDelete={handleDeleteSearch} />

      <div className="grid grid-cols-1 justify-items-center gap-2 p-3 md:grid-cols-3 md:gap-3">
        {news.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} onBookmark={handleBookmark} isBookmarked={bookmarks.some((bookmark) => bookmark.id === newsItem.id)} onClick={handleOpenModal} />
        ))}
      </div>
      {isLoading && <p className="text-3xl text-red-500 text-center">Loading more news</p>}
      {!error && !hasMore && news.length > 0 && <p className=" text-center text-3xl text-red-500">No more news</p>}
      <div ref={loaderRef}>
      </div>
      {error && (
        <div className="flex flex-col justify-center items-center text-center">
          <p className="text-red-500 text-lg">{errorMessage}</p>
          <button onClick={handleRetry} className="border-2 border-gray-500 rounded-md p-1 w-full max-w-44 hover:bg-gray-300">Retry</button>
        </div>
      )}
      {selectedNews && (
        <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
      {!error && noResults && (
        <p className="text-center text-3xl text-red-500">
          No results found
        </p>
      )}
    </div>
  );
}

export default NewsPage;