import { useState } from "react";
import { useFavouriteStore } from "../stores/favourites.js";

// A second far-away reader of the same store.
export default function SavedDrawer() {
  // Local UI state stays local: only this component cares if it's open.
  const [open, setOpen] = useState(false);
  const saved = useFavouriteStore((s) => s.saved);
  const toggle = useFavouriteStore((s) => s.toggle);

  return (
    <aside className="drawer">
      <button onClick={() => setOpen((o) => !o)}>
        {open ? "Hide" : "Show"} saved ({saved.length})
      </button>
      {open && (
        <ul>
          {saved.length === 0 && <li>Nothing saved yet.</li>}
          {saved.map((recipe) => (
            <li key={recipe.id}>
              {recipe.name}{" "}
              <button aria-label={`Remove ${recipe.name}`} onClick={() => toggle(recipe)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
