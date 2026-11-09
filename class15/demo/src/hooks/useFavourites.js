import { useEffect, useState } from "react";

const KEY = "favourites";

// A custom hook: a function named use* that calls other hooks.
// Every component that calls it gets its OWN copy of this state.
export function useFavourites() {
  // Lazy initial state: read localStorage once, on the first render.
  const [ids, setIds] = useState(
    () => new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]")),
  );

  // Persist: after every render where `ids` changed, save it.
  // A Set doesn't survive JSON.stringify, so save it as an array.
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify([...ids]));
  }, [ids]);

  const toggle = (id) =>
    setIds((prev) => {
      const next = new Set(prev); // new Set, so React sees a change
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return { isFav: (id) => ids.has(id), toggle, count: ids.size };
}
