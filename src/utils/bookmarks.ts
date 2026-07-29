import type { News } from "../types/types";

const bookmarkNews = "bookmarkNews";

export const getBookmarks = (): News[] => {
  const storedBookmarks = localStorage.getItem(bookmarkNews);

  if (!storedBookmarks) {
    return [];
  }

  return JSON.parse(storedBookmarks);
}

export const saveBookmarks = (bookmarks: News[]) => {
  localStorage.setItem(bookmarkNews, JSON.stringify(bookmarks));
}

export const toggleBookmark = (news: News): News[] => {
  const bookmarks = getBookmarks();

  const alreadyBookmarked = bookmarks.some((bookmark) => {
    return bookmark.id === news.id;
  });

  if (alreadyBookmarked) {
    const updatedBookmarks = bookmarks.filter((bookmark) => {
      return bookmark.id !== news.id
    });

    saveBookmarks(updatedBookmarks);
    return updatedBookmarks;
  }

  const updatedBookmarks = [...bookmarks, news];
  saveBookmarks(updatedBookmarks);
  return updatedBookmarks;
}