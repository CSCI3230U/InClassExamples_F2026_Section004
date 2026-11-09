import { useState } from "react";
import FavouritesCount from "./components/FavouritesCount.jsx";
import QuickToggle from "./components/QuickToggle.jsx";
import RecipeList from "./components/RecipeList.jsx";
import SearchBox from "./components/SearchBox.jsx";
import { recipes as initialRecipes } from "./recipes.js";
import { ThemeContext } from "./ThemeContext.js";

const QUICK_MINUTES = 20;

// App -> FavouritesCount, SearchBox, QuickToggle, RecipeList -> RecipeCard
export default function App() {
  // State: things the user changes.
  const [recipes, setRecipes] = useState(initialRecipes);
  const [query, setQuery] = useState("");
  const [quickOnly, setQuickOnly] = useState(false);
  const [theme, setTheme] = useState("light");

  // Derived: computed from state on every render. No useState for these.
  const matches = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(query.toLowerCase()),
  );
  const quickCount = matches.filter((r) => r.minutes <= QUICK_MINUTES).length;
  const visible = quickOnly
    ? matches.filter((r) => r.minutes <= QUICK_MINUTES)
    : matches;

  function addRecipe() {
    const recipe = {
      id: crypto.randomUUID(),
      name: `New recipe ${recipes.length + 1}`,
      minutes: 10,
      tags: ["new"],
    };
    setRecipes([recipe, ...recipes]);
  }

  // Everything inside the Provider can read `theme` with useContext.
  return (
    <ThemeContext.Provider value={theme}>
      <main>
        <header className="top">
          <h1>My Recipes</h1>
          <FavouritesCount />
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            Theme: {theme}
          </button>
        </header>
        <div className="toolbar">
          <SearchBox value={query} onChange={setQuery} />
          <QuickToggle
            checked={quickOnly}
            onChange={setQuickOnly}
            count={quickCount}
          />
          <button onClick={addRecipe}>Add recipe</button>
        </div>
        <p>
          Showing {visible.length} of {recipes.length}
        </p>
        <RecipeList recipes={visible} />
      </main>
    </ThemeContext.Provider>
  );
}
