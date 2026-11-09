import { create } from "zustand";
import { persist } from "zustand/middleware";

// A store: the state lives OUTSIDE the component tree, so every component
// that reads it sees the same data. No <Provider> needed.
// persist() saves it to localStorage (key "favourites-store") for us.
const useFavouritesStore = create(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
    }),
    { name: "favourites-store" },
  ),
);

// Same shape as useFavourites(), so a component can switch with one import.
// It's still a custom hook: a use* function that calls another hook.
export function useSharedFavourites() {
  const ids = useFavouritesStore((s) => s.ids);
  const toggle = useFavouritesStore((s) => s.toggle);
  return { isFav: (id) => ids.includes(id), toggle, count: ids.length };
}
