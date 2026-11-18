# My Recipes: load recipes from a web service

**CSCI 3230U · Lecture 10a · demo walkthrough**

The recipe app from 09c. The recipes no longer come from a local array (`recipes.js`). They come from **TheMealDB**, a free recipe web service: the app requests a URL and the service answers with JSON. The demo follows the deck's demo slide:

1. Fetch recipes in a `useEffect`
2. Model `idle` / `loading` / `ok` / `error` and branch the render on it
3. Map the API response to our own `{ id, title, image }` shape
4. Remove the `AbortController`, click categories fast → stale results flash
5. Add it back → results stabilize (cancels the in-flight request)

## What's in this folder

| File | What to look at |
|---|---|
| `src/pages/HomePage.jsx` | **The main file.** The `useEffect` that fetches a category (step 1), the `status` state and the render that branches on it (step 2), the cleanup line `return () => controller.abort();` (steps 4–5) |
| `src/api.js` | Everything about TheMealDB: the URLs, `toRecipe` (step 3: map at the boundary), and `fetchJson`, which checks `r.ok` and adds a random delay (see below) |
| `src/components/RecipeCard.jsx` | Uses only our shape: `{ id, title, image }`. It never sees `strMeal` |
| `src/pages/RecipeDetail.jsx` | The same pattern again: the `:id` from the URL goes into `lookup.php?i=…`. An unknown id gives `meals: null`, so it shows `NotFound` |
| `src/stores/favourites.js` | Unchanged except the `localStorage` key, because saved items now have `title` instead of `name` |

Removed since 09c: `recipes.js`, the quick filter (TheMealDB's category list has no cooking times), the "Add recipe" button, and servings.

### The artificial delay

TheMealDB answers in about 100 ms, too fast to see a race in class. `src/api.js` has `const SLOW = true;`: each request first waits a random 0.3–2 seconds, so answers come back in a different order than they were sent. Set it to `false` to see the real speed.

## Setup

```
npm install
npm run dev
```

Open `http://localhost:5173`. Keep DevTools open on the **Network** tab, filtered to **Fetch/XHR**.

`npm run lint` shows a `set-state-in-effect` warning on `setStatus("loading")` inside the effect. That line is the pattern from the slides. The warning is a reminder that calling `setState` in an effect costs an extra render. For fetching it's acceptable, because the effect is syncing with something outside React (the server).

## Try it

1. **The effect and its dependency.** Reload: you see "Loading Seafood…" and then the list. Click **Beef**: the URL changes, so the effect runs again. In development you'll see **two** requests on the first load. That's Strict Mode running the effect twice; the first one is cancelled.
2. **The four statuses.** While loading you get the loading line. For the error screen, open `src/api.js`, change `API` to a wrong address (e.g. `…/v1/1/nope`) and save; put it back afterwards.
3. **The boundary.** In the Network tab, click a request and open **Response**: you'll see `idMeal`, `strMeal`, `strMealThumb`. Then look at `RecipeCard.jsx`: it only knows `id`, `title`, `image`.
4. **The race.** In `HomePage.jsx`, comment out `return () => controller.abort();`. Click Beef, Chicken, Dessert, Vegetarian, Seafood quickly. Watch the cards: other categories flash in, and often the list ends on the **wrong** category while the Seafood button is still selected. The caption says "Seafood" because it reads the current `category` state, not what the data actually is.
5. **The fix.** Put the line back and repeat. In the Network tab the old requests show as **(canceled)**, and the list always matches the selected button.

## Questions to think about

- Remove `url` from the dependency array (`}, []);`). What happens when you click a category, and why?
- Go to a recipe and press Back: you're on Seafood again, whichever category you had picked. Why? How would `useSearchParams` from 09c fix it?
- Why does `toRecipe` live in `api.js` and not inside `RecipeCard`?
