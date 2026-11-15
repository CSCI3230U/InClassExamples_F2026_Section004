import RecipeCard from "./RecipeCard.jsx";

// Data in, one card per item out. key: a stable id, not the index.
// No favourites here any more: each card subscribes to the store itself.
export default function RecipeList({ recipes }) {
  if (recipes.length === 0) {
    return <p>No recipes to show.</p>;
  }
  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </ul>
  );
}
