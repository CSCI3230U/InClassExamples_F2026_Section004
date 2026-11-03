import { useState } from "react";
import QuickToggle from "./components/QuickToggle.jsx";
import RecipeList from "./components/RecipeList.jsx";
import SearchBox from "./components/SearchBox.jsx";
import { recipes as initialRecipes } from "./recipes.js";

const QUICK_MINUTES = 20;

// App -> SearchBox, QuickToggle, RecipeList -> RecipeCard
export default function App() {
  // State: things the user changes.
  const [recipes, setRecipes] = useState(initialRecipes);
  const [query, setQuery] = useState("");
  const [quickOnly, setQuickOnly] = useState(false);

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

  return (
    <main>
      <h1>My Recipes</h1>
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} />
        <QuickToggle checked={quickOnly} onChange={setQuickOnly} count={quickCount} />
        <button onClick={addRecipe}>Add recipe</button>
      </div>
      <p>
        Showing {visible.length} of {recipes.length}
      </p>
      <RecipeList recipes={visible} />
    </main>
  );
}
