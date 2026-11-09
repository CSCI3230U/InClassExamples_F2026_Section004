import { useContext, useState } from "react";
import { ThemeContext } from "../ThemeContext.js";

// One recipe. Favourite now comes in through props (RecipeList owns it);
// servings is still this card's own state. The theme comes from Context:
// nobody passes it down.
export default function RecipeCard({ name, minutes, tags, favourite, onToggleFavourite }) {
  const theme = useContext(ThemeContext); // no prop-drilling
  const [servings, setServings] = useState(2);

  // Three updates in one click. setServings(servings + 1) three times
  // would add 1: each call reads the same `servings` from this render.
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
          onClick={onToggleFavourite}
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
