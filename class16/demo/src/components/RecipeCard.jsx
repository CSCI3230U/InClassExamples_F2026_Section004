import { useContext, useState } from "react";
import { useFavouriteStore } from "../stores/favourites.js";
import { ThemeContext } from "../ThemeContext.js";

// One recipe. It subscribes to the store itself: nobody passes it
// favourite props. Its selector returns a boolean, so toggling another
// card's star doesn't re-render this one.
export default function RecipeCard({ recipe }) {
  const { id, name, minutes, tags } = recipe;
  const theme = useContext(ThemeContext); // rarely changes: Context
  const favourite = useFavouriteStore((s) => s.saved.some((r) => r.id === id));
  const toggle = useFavouriteStore((s) => s.toggle);
  const [servings, setServings] = useState(2); // only this card cares: useState

  function addThree() {
    setServings((s) => s + 1);
    setServings((s) => s + 1);
    setServings((s) => s + 1);
  }

  return (
    <article className={`card ${theme}`}>
      <header>
        <h3>{name}</h3>
        <button
          className="fav"
          aria-pressed={favourite}
          aria-label="Favourite"
          onClick={() => toggle(recipe)}
        >
          {favourite ? "★" : "☆"}
        </button>
      </header>
      <p>{minutes} min</p>
      <p className="servings">
        <button onClick={() => setServings((s) => Math.max(1, s - 1))}>−</button>
        <span>{servings} servings</span>
        <button onClick={() => setServings((s) => s + 1)}>+</button>
        <button onClick={addThree}>+3</button>
      </p>
      <ul className="tags">
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}
