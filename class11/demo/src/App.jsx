import RecipeList from "./components/RecipeList.jsx";
import { recipes } from "./recipes.js";

// App -> RecipeList -> RecipeCard
export default function App() {
  return (
    <main>
      <h1>My Recipes</h1>
      <RecipeList recipes={recipes} />
    </main>
  );
}
