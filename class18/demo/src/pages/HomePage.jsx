import { useEffect, useState } from "react";
import { categoryUrl, fetchJson, toRecipe } from "../api.js";
import RecipeList from "../components/RecipeList.jsx";
import SearchBox from "../components/SearchBox.jsx";

const CATEGORIES = ["Beef", "Chicken", "Seafood", "Dessert", "Vegetarian"];

// The "/" page. The recipes now come from a web service, not recipes.js.
export default function HomePage() {
  const [category, setCategory] = useState("Seafood");
  const [query, setQuery] = useState("");

  // Step 2: model the async state. One status string, not three booleans.
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error

  const url = categoryUrl(category);

  // Step 1: fetching is a side effect, so it goes in useEffect, not in the
  // render body. It runs after the first render and again whenever url changes.
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchJson(url, { signal: controller.signal })
      .then((data) => {
        // Step 3: map at the boundary. meals is null when nothing matches.
        setRecipes((data.meals ?? []).map(toRecipe));
        setStatus("ok");
      })
      .catch((e) => {
        // A cancelled request is not a real error: ignore it.
        if (e.name !== "AbortError") setStatus("error");
      });

    // Cleanup: React runs this before the next effect (category changed)
    // and when the page unmounts. It cancels the request we no longer want.
    // Step 4: comment out this line, then click categories fast.
    return () => controller.abort();
  }, [url]); // the effect reads url, so url is listed

  const visible = recipes.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <nav className="categories" aria-label="Categories">
        {CATEGORIES.map((c) => (
          <button key={c} aria-pressed={c === category} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </nav>
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} />
      </div>

      {/* Step 2: branch the render on status. */}
      {status === "idle" && null}
      {status === "loading" && <p className="loading">Loading {category}…</p>}
      {status === "error" && <p className="error">Could not load recipes.</p>}
      {status === "ok" && (
        <>
          <p>
            {category}: showing {visible.length} of {recipes.length}
          </p>
          <RecipeList recipes={visible} />
        </>
      )}
    </>
  );
}
