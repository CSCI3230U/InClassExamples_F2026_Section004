# My Recipes: client-side testing

**CSCI 3230U · Lecture 10b · demo walkthrough**

The recipe app from 10a (TheMealDB), now with automated tests. **Vitest** runs the tests and **React Testing Library (RTL)** renders components into **jsdom**, a fake DOM that runs in Node. The demo follows the deck's demo slide:

1. Unit-test `toRecipe`; run `npm test`: failed → red, passed → green
2. Component-test `RecipeCard`: click the star → `aria-pressed` becomes `"true"`
3. Triage what's worth testing in our app
4. Add an edge-case test that exposes a bug (missing `strMeal`); fix it; it stays green

## What's in this folder

| File | What to look at |
|---|---|
| `src/api.test.js` | **Steps 1 and 4.** The `toRecipe` unit test, and the edge-case test for a meal with no `strMeal` |
| `src/components/RecipeCard.test.jsx` | **Step 2.** Render the card inside a `MemoryRouter`, click the star with `userEvent`, check `aria-pressed`. `beforeEach` resets the favourites store |
| `src/filterRecipes.js` + `.test.js` | **Step 3.** The search filter, moved out of `HomePage` into a pure function so it can be tested without React |
| `src/api.js` | `toRecipe` now has the step 4 fix: `title: meal.strMeal ?? "Untitled"` |
| `vite.config.js` | The `test` block: `environment: "jsdom"` and `globals: true` |

Added since 10a: the `test` script and the dev dependencies `vitest`, `jsdom`, `@testing-library/react` and `@testing-library/user-event`. The app itself is unchanged except for the two lines above.

## Setup

```
npm install
npm test
```

`npm test` starts Vitest in **watch mode**: it re-runs the tests every time you save. Press `q` to quit. `npx vitest run` runs them once and exits (that's what CI uses). `npm run dev` still starts the app at `http://localhost:5173`.

## Try it

1. **Green, then red.** Run `npm test`: 8 tests pass. In `src/api.js`, rename `title:` to `name:` inside `toRecipe` and save. Two tests turn red. Read the failure out loud: the test name, **Expected** vs **Received**, and the file and line. Put it back.
2. **The component test.** Open `RecipeCard.test.jsx`. It finds the star by its **role** and **name** (`getByRole("button", { name: "Favourite" })`), the same way a screen reader would. Change the `aria-label` in `RecipeCard.jsx` to `"Fav"`: the test can't find the button. Put it back. Then comment out the `beforeEach` line: "clicking the star twice" now fails, because the first test left Carbonara saved in the store. Change it to `test.only(...)` so it runs alone: it passes. Tests that share data pass alone and fail together. Restore both lines.
3. **Triage.** Go through the app with the "Test it / Skip it" table from the slides. `filterRecipes` is pure logic that was inside `HomePage`; now it has three one-line tests. Things we deliberately don't test: CSS classes, the theme colours, React Router itself.
4. **Red → green.** In `src/api.js`, remove `?? "Untitled"` so the line is `title: meal.strMeal,`. The test "toRecipe gives a missing title a fallback" fails with `received undefined`. Put the fix back: green. That test is now a **regression test**: it fails if anyone removes the fix.

## Questions to think about

- The star test checks `aria-pressed`, not `useFavouriteStore.getState().saved`. Why is that the better choice?
- What would you have to set up to test `HomePage`, which fetches from TheMealDB? Why is testing `filterRecipes` so much easier?
- Which other edge cases from the slides could you add a test for (an empty search, `meals: null`, the server being down)?
