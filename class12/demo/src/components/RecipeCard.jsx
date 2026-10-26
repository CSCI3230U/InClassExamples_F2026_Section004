import { useState } from "react";

// One recipe. The data comes in through props; favourite and servings are
// this card's own state. Each card has its own copy.
export default function RecipeCard({ name, minutes, tags }) {
  const [favourite, setFavourite] = useState(false);
  const [servings, setServings] = useState(2);

  // Three updates in one click. setServings(servings + 1) three times
  // would add 1: each call reads the same `servings` from this render.
  function addThree() {
    setServings((s) => s + 1);
    setServings((s) => s + 1);
    setServings((s) => s + 1);
  }

  return (
    <article className="card">
      <header>
        <h3>{name}</h3>
        <button
          className="fav"
          aria-pressed={favourite}
          aria-label="Favourite"
          onClick={() => setFavourite(!favourite)}
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
