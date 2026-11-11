# My Recipes: favourites as a store

**CSCI 3230U · Lecture 09b · demo walkthrough**

The recipe app from 09a, with favourites moved into a **Zustand store**:

- `useFavouriteStore` holds the saved recipes **outside** the component
  tree. No owner component, no `<Provider>`.
- each **`RecipeCard` subscribes itself** with a selector; `RecipeList`
  no longer passes favourite props;
- a **header badge** and a **saved-recipes drawer** read the same store
  with zero props;
- **`persist`** saves it to `localStorage` (key
  `recipe-browser:favourites`), replacing 09a's `useEffect`.

## What's in this folder

| File | What to look at |
|---|---|
| `src/stores/favourites.js` | `create()(persist(...))`: state + `toggle`, created once at import |
| `src/components/RecipeCard.jsx` | two selectors: a **boolean** (`is this one saved?`) and `toggle`. Theme still from Context, servings still `useState` |
| `src/components/RecipeList.jsx` | just renders cards: no favourites code |
| `src/components/FavouritesCount.jsx` | subscribes to one number, `s.saved.length` |
| `src/components/SavedDrawer.jsx` | reads `s.saved`; its open/closed flag stays local `useState` |
| `src/hooks/useFavourites.js` | the 09a hook, kept for comparison (unused) |

## Setup

```
npm install
npm run dev
```

Open `http://localhost:5173`. Install **React DevTools**, then
Components tab → ⚙ → *Highlight updates when components render*.

## Try it

Put the code back after each one.

1. **One toggle, one card.** With highlighting on, star a recipe. Only
   that card (plus the badge and drawer) flashes. The other cards'
   selector still returns `false`, so they don't re-render.
2. **No selector.** In `RecipeCard.jsx`, replace the two store lines
   with:

   ```jsx
   const { saved, toggle } = useFavouriteStore();
   const favourite = saved.some((r) => r.id === id);
   ```

   Star a recipe: **every** card flashes. Still works, just more work.
3. **A new object each call.** Now try:

   ```jsx
   const { saved, toggle } = useFavouriteStore((s) => ({ saved: s.saved, toggle: s.toggle }));
   ```

   The page goes blank. Console: *Maximum update depth exceeded* (and
   *The result of getSnapshot should be cached*). The selector returns a
   new object every time, so it always looks changed. Wrap it in
   `useShallow` (`import { useShallow } from "zustand/react/shallow"`):
   the crash goes away, but every card still re-renders, because `saved`
   itself changed. The boolean selector is still the better one.
4. **Persistence.** Star two recipes, look at Application → Local
   Storage → `recipe-browser:favourites`, reload.

## Questions to think about

- Why does `RecipeCard`'s selector return a boolean instead of the
  `saved` array?
- `servings` and the drawer's `open` flag are state too. Why aren't they
  in the store?
- Theme is in Context, favourites in a store. What would change if you
  swapped them?
