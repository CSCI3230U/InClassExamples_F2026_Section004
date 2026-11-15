import { Link, useParams } from "react-router";
import NotFound from "./NotFound.jsx";

// The "/recipes/:id" page. One route serves every recipe:
// /recipes/r3 -> useParams() -> { id: "r3" }   (always a string)
export default function RecipeDetail({ recipes }) {
  const { id } = useParams(); // Step 4
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) return <NotFound />; // e.g. /recipes/zzz

  return (
    <article className="detail">
      <h2>{recipe.name}</h2>
      <p>{recipe.minutes} min</p>
      <ul className="tags">
        {recipe.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <Link to="/">← All recipes</Link>
    </article>
  );
}
