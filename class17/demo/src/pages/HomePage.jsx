import { useState } from "react";
import QuickToggle from "../components/QuickToggle.jsx";
import RecipeList from "../components/RecipeList.jsx";
import SearchBox from "../components/SearchBox.jsx";

const QUICK_MINUTES = 20;

// The "/" page: what App.jsx used to render below the header (class 16).
// Search and the quick filter are local state of this page.
export default function HomePage({ recipes, onAdd }) {
  const [query, setQuery] = useState("");
  const [quickOnly, setQuickOnly] = useState(false);

  const matches = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(query.toLowerCase()),
  );
  const quickCount = matches.filter((r) => r.minutes <= QUICK_MINUTES).length;
  const visible = quickOnly
    ? matches.filter((r) => r.minutes <= QUICK_MINUTES)
    : matches;

  return (
    <>
      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} />
        <QuickToggle
          checked={quickOnly}
          onChange={setQuickOnly}
          count={quickCount}
        />
        <button onClick={onAdd}>Add recipe</button>
      </div>
      <p>
        Showing {visible.length} of {recipes.length}
      </p>
      <RecipeList recipes={visible} />
    </>
  );
}
