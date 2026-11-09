import { useSharedFavourites } from "../stores/favourites.js";
import RecipeCard from "./RecipeCard.jsx";

// Data in, one card per item out. key: a stable id, not the index.
export default function RecipeList({ recipes }) {
  // Hooks first, at the top level: before any if or early return.
  const { isFav, toggle } = useSharedFavourites();

  if (recipes.length === 0) {
    return <p>No recipes to show.</p>;
  }
  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <RecipeCard
            {...recipe}
            favourite={isFav(recipe.id)}
            onToggleFavourite={() => toggle(recipe.id)}
          />
        </li>
      ))}
    </ul>
  );
}
