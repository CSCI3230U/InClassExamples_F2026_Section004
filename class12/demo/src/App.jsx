import { useState } from "react";
import RecipeList from "./components/RecipeList.jsx";
import SearchBox from "./components/SearchBox.jsx";
import { recipes as initialRecipes } from "./recipes.js";

// App -> SearchBox, RecipeList -> RecipeCard
export default function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [query, setQuery] = useState("");

  // Computed on every render, not stored in state.
  const visible = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(query.toLowerCase()),
  );

  function addRecipe() {
    const recipe = {
      id: crypto.randomUUID(),
      name: `New recipe ${recipes.length + 1}`,
      minutes: 10,
      tags: ["new"],
    };
    // A new array, with the new recipe first. recipes.push(recipe) changes
    // the old array, and React doesn't re-render.
    setRecipes([recipe, ...recipes]);
  }

  return (
    <main>
      <h1>My Recipes</h1>
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} />
        <button onClick={addRecipe}>Add recipe</button>
      </div>
      <p>
        Showing {visible.length} of {recipes.length}
      </p>
      <RecipeList recipes={visible} />
    </main>
  );
}
