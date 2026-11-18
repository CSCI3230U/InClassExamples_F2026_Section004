import { useState } from "react";
import { Link, Route, Routes } from "react-router";
import FavouritesCount from "./components/FavouritesCount.jsx";
import SavedDrawer from "./components/SavedDrawer.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import { ThemeContext } from "./ThemeContext.js";

// App -> header (every URL) + <Routes> (one page at a time)
//   "/"            -> HomePage (fetches a category) -> RecipeList -> RecipeCard
//   "/recipes/:id" -> RecipeDetail (fetches one recipe)
//   anything else  -> NotFound
// The recipes no longer live here: each page fetches what it needs.
export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <main>
        <header className="top">
          <h1>
            <Link to="/">My Recipes</Link>
          </h1>
          <FavouritesCount />
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            Theme: {theme}
          </button>
        </header>
        <SavedDrawer />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </ThemeContext.Provider>
  );
}
