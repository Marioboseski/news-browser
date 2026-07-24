import NewsPage from "./pages/NewsPage";
import Bookmarks from "./pages/Bookmarks";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
    </Routes>
  );
}

export default App;