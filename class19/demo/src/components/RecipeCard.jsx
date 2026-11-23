import { useContext } from "react";
import { Link } from "react-router";
import { useFavouriteStore } from "../stores/favourites.js";
import { ThemeContext } from "../ThemeContext.js";

// One recipe, in OUR shape: { id, title, image }. It never sees strMeal.
export default function RecipeCard({ recipe }) {
  const { id, title, image } = recipe;
  const theme = useContext(ThemeContext);
  const favourite = useFavouriteStore((s) => s.saved.some((r) => r.id === id));
  const toggle = useFavouriteStore((s) => s.toggle);

  return (
    <article className={`card ${theme}`}>
      <img src={image} alt="" loading="lazy" />
      <header>
        <h3>
          <Link to={`/recipes/${id}`}>{title}</Link>
        </h3>
        <button
          className="fav"
          aria-pressed={favourite}
          aria-label="Favourite"
          onClick={() => toggle(recipe)}
        >
          {favourite ? "★" : "☆"}
        </button>
      </header>
    </article>
  );
}
