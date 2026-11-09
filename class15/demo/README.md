# My Recipes: favourites, Context and a store

**CSCI 3230U · Lecture 09a · demo walkthrough**

The recipe app from 08a, with three additions:

- a **`useFavourites()` custom hook** that remembers starred recipes in
  `localStorage`;
- a **favourites count** in the header, in a component that has nothing
  to do with the recipe list;
- a **theme button** whose value reaches every card through **Context**,
  not props.

## What's in this folder

The files are saved **after** the demo, so the components use the store
version (`useSharedFavourites`).

| File | What to look at |
|---|---|
| `src/hooks/useFavourites.js` | the custom hook: `useState` (read from `localStorage` once) + `useEffect` (save on change). Each caller gets its **own** copy |
| `src/stores/favourites.js` | the same favourites in a **Zustand store**: one copy, outside the component tree, shared by everyone. `persist()` saves it |
| `src/components/RecipeList.jsx` | calls the hook at the top, **before** the early `return` |
| `src/components/FavouritesCount.jsx` | the second, unrelated user of the favourites |
| `src/ThemeContext.js`, `App.jsx`, `RecipeCard.jsx` | `createContext`, the `Provider` in `App`, `useContext` in the card. `RecipeList` never sees `theme` |

## Setup

```
npm install
npm run dev
```

Open `http://localhost:5173` with DevTools open (Console and
Application → Local Storage).

## Try it

Put the code back after each one.

1. **Two callers, two copies.** In `RecipeList.jsx` and
   `FavouritesCount.jsx`, import `useFavourites` from
   `../hooks/useFavourites.js` and call it instead of
   `useSharedFavourites`. Star a recipe: the card changes, the header
   count doesn't. Reload: now the count is right, because both copies
   read `localStorage` on the first render. A custom hook shares
   **logic**, not **state**.
2. **Break a rule of hooks.** With the hook version from 1, add this to
   `App.jsx` after the `useState` lines:

   ```jsx
   let favCount = null;
   if (query === "") {
     favCount = useFavourites().count; // ✗ hook inside an if
   }
   ```

   Reload, then type in the search box. The page goes blank and the
   console says *Rendered fewer hooks than expected*. `npm run lint`
   catches it before you run anything: *React Hook "useFavourites" is
   called conditionally*.
3. **The effect that runs once.** With the hook version from 1, in
   `useFavourites.js`, remove `ids` from the
   effect's dependency array (`[]`). Star a recipe and reload: the star
   is gone. The effect only ran once, on mount.
4. **Context default.** In `App.jsx`, remove the
   `<ThemeContext.Provider>` wrapper. The theme button changes its label,
   but the cards stay light: with no Provider above them, `useContext`
   returns the default from `createContext("light")`.

## Questions to think about

- Why does `useFavourites` store a `Set` in state but an array in
  `localStorage`?
- Favourites change on every click. Why is that a reason **not** to put
  them in Context?
- `RecipeCard` reads the theme with `useContext`. What would you have to
  change in `RecipeList` if the theme came through props instead?
