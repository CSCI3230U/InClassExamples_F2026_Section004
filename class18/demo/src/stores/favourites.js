import { create } from "zustand";
import { persist } from "zustand/middleware";

// A store: create() runs ONCE, when this module is first imported.
// The state lives outside the component tree, so there is no owner
// component and no <Provider>. Any component can subscribe.
// persist() saves it to localStorage, replacing 09a's useEffect.
export const useFavouriteStore = create()(
  persist(
    (set) => ({
      saved: [], // whole recipe objects ({ id, title, image }), so the drawer can show titles
      toggle: (recipe) =>
        set((state) => ({ // same updater idea as useState
          saved: state.saved.some((r) => r.id === recipe.id)
            ? state.saved.filter((r) => r.id !== recipe.id)
            : [...state.saved, recipe],
        })),
    }),
    // New key: saved items now use our { id, title, image } shape.
    { name: "recipe-browser:favourites-api" },
  ),
);
