import { useState } from "react";
import { Link, Route, Routes } from "react-router";
import FavouritesCount from "./components/FavouritesCount.jsx";
import SavedDrawer from "./components/SavedDrawer.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import { recipes as initialRecipes } from "./recipes.js";
import { ThemeContext } from "./ThemeContext.js";

// App -> header (every URL) + <Routes> (one page at a time)
//   "/"            -> HomePage -> RecipeList -> RecipeCard
//   "/recipes/:id" -> RecipeDetail
//   anything else  -> NotFound
export default function App() {
  // Both pages need the recipes, so they stay here and go down as props.
  const [recipes, setRecipes] = useState(initialRecipes);
  const [theme, setTheme] = useState("light");

  function addRecipe() {
    const recipe = {
      id: crypto.randomUUID(),
      name: `New recipe ${recipes.length + 1}`,
      minutes: 10,
      tags: ["new"],
    };
    setRecipes([recipe, ...recipes]);
  }

  return (
    <ThemeContext.Provider value={theme}>
      <main>
        {/* Outside <Routes>: shown on every page. */}
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

        {/* Step 2: the map. Only the best match renders. */}
        <Routes>
          <Route
            path="/"
            element={<HomePage recipes={recipes} onAdd={addRecipe} />}
          />
          <Route
            path="/recipes/:id"
            element={<RecipeDetail recipes={recipes} />}
          />
          {/* Step 5: the catch-all 404. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </ThemeContext.Provider>
  );
}
