# My Recipes, interactive: state and events

**CSCI 3230U · Lecture 07b · demo walkthrough**

The recipe app from 06b, now with state. Each card has a favourite toggle
and a servings counter. The page has a search box and an "Add recipe"
button. Nothing in this code touches the DOM: every change is "update the
state, React re-renders".

## What's in this folder

The files are saved **after** the demo:

| File | What to look at |
|---|---|
| `src/App.jsx` | three things: `recipes` and `query` are state, `visible` is computed from them on every render. `addRecipe` makes a **new** array |
| `src/components/SearchBox.jsx` | no state of its own: it gets `value` and `onChange` from `App` (data down, events up) |
| `src/components/RecipeList.jsx` | unchanged from 06b, except the empty message. `key={recipe.id}` matters more now |
| `src/components/RecipeCard.jsx` | two `useState` calls: `favourite` and `servings`. The `+3` button uses functional updates |
| `src/recipes.js` | the starting data. `App` copies it into state |

## Setup

You need Node.js. In this `demo/` folder:

```
npm install
npm run dev
```

Open the URL it prints (`http://localhost:5173`), with DevTools open.

## How it was made

We started from the 06b demo (`class11/demo`), not from a new project.

## Try it

1. **State is local.** Star two cards. Each card remembers its own star.
2. **The setter is the only way.** In `RecipeCard.jsx`, change the star's
   handler to `() => { favourite = !favourite; }`. The console says
   *TypeError: Assignment to constant variable*. With `let` instead of
   `const`, no error, and still nothing happens. Put it back.
3. **Pass a function, don't call it.** Change it to
   `onClick={setFavourite(!favourite)}` (no `() =>`). The page goes blank:
   *Too many re-renders*. Put it back.
4. **Stale values.** In `addThree`, replace `setServings((s) => s + 1)`
   with `setServings(servings + 1)` (all three lines). Click `+3`: it adds
   1. Put it back.
5. **Don't mutate.** In `addRecipe`, replace the `setRecipes` line with
   `recipes.push(recipe); setRecipes(recipes);`. Click "Add recipe":
   nothing. Then type in the search box: the recipe suddenly appears. Put
   it back.
6. **Keys.** In `RecipeList.jsx`, use `recipes.map((recipe, index) => ...)`
   and `key={index}`. Star *Pancakes*, then search for `thai`: *Pad thai*
   has the star. Clear the search and click "Add recipe": the new recipe
   has it. Put `key={recipe.id}` back and try again.
7. **Unmounting.** With the correct key, star *Pancakes*, then search for
   `thai`, then clear the search. The star is gone: the card was removed,
   and its state with it.

## Questions to think about

- Why does `query` live in `App` and not in `SearchBox`?
- Why isn't `visible` state?
- How would you show "2 favourites" in the heading? Where would
  `favourite` have to live? (It would also fix step 7.)
