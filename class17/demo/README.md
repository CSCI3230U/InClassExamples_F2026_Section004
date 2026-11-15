# My Recipes: a recipe detail route

**CSCI 3230U · Lecture 09c · demo walkthrough**

The recipe app from 09b, with **React Router** added. It follows the deck's demo slide:

1. `<BrowserRouter>` wraps the app (`main.jsx`), and `<Routes>` is added to `App.jsx`
2. A `/` list route (`HomePage`) and a `/recipes/:id` detail route (`RecipeDetail`)
3. Each card's name is a `<Link>`: the page does not reload
4. `RecipeDetail` reads `:id` with `useParams` and shows that recipe
5. A `path="*"` route shows `NotFound`; the Back button works because the URLs are real

## What's in this folder

| File | What to look at |
|---|---|
| `src/main.jsx` | `<BrowserRouter>` around `<App />` (step 1) |
| `src/App.jsx` | the header stays **outside** `<Routes>`, so it shows on every page. The route map (steps 2 and 5). `recipes` stays here because both pages need it |
| `src/pages/HomePage.jsx` | what `App.jsx` used to render below the header: search, quick filter, list |
| `src/components/RecipeCard.jsx` | the name is now `<Link to={`/recipes/${id}`}>` (step 3) |
| `src/pages/RecipeDetail.jsx` | `useParams()` → `{ id: "r3" }`, then `find`. An unknown id shows `NotFound` (step 4) |
| `src/pages/NotFound.jsx` | the 404 page, used by `path="*"` and by `RecipeDetail` |

The favourites store (`stores/favourites.js`), theme Context and servings `useState` are unchanged from 09b. The 09a hook `useFavourites.js` was removed.

## Setup

```
npm install
npm run dev
```

Open `http://localhost:5173`. Keep DevTools open on the **Network** tab, filtered to **Doc**.

## Try it

1. **No reload.** Star two recipes and set a card to 4 servings. Click a recipe name: the URL changes to `/recipes/r3`, the header still shows ★ 2, and the Network tab shows no new document request.
2. **Back and Forward.** Press Back: you return to the list, still with ★ 2. Press Forward: you're back on Pad thai. The servings went back to 2 because the list page unmounted when you left it.
3. **`<a>` instead of `<Link>`.** In `RecipeCard.jsx`, change the link to `<a href={`/recipes/${id}`}>`. Click it: the Network tab shows a document request, the screen flashes, and servings reset. The stars survive only because of `persist`. Put `<Link>` back.
4. **404s.** Open `/recipes/zzz` (unknown id, so `RecipeDetail` shows `NotFound`) and `/abuot` (no route matches, so `path="*"` wins).
5. **Real URLs.** Open `/recipes/r2` in a new tab, or refresh on it: Tomato soup loads directly. This works because Vite's dev server sends `index.html` for every path (see the "Real URLs Need the Server Too" slide).

## Questions to think about

- Search for "pad", open Pad thai, then press Back. The search box is empty again. Why? Where could the search text live so that Back keeps it? (Hint: the query string slides.)
- `recipes` lives in `App`, but `query` lives in `HomePage`. Why?
- Click "Add recipe", then open the new recipe and refresh. What happens, and why?
