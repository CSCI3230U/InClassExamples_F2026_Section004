# My Recipes: a component-based app

**CSCI 3230U · Lecture 06b · demo walkthrough**

The first React app of the course. It shows a list of recipes as
components: `App` uses `RecipeList`, which uses `RecipeCard`. There is no
state yet (nothing changes when you click). That's 07b.

## What's in this folder

The files are saved **after** the demo:

| File | What to look at |
|---|---|
| `index.html` | one empty `<div id="root">`. That's the whole page the server sends |
| `src/main.jsx` | `createRoot(...).render(<App />)` puts the app into `#root` |
| `src/App.jsx` | the top of the tree: a heading and `<RecipeList recipes={recipes} />` |
| `src/components/RecipeList.jsx` | `.map` turns the array into cards, each `<li>` with a `key` |
| `src/components/RecipeCard.jsx` | one recipe. Everything it shows comes in as props |
| `src/recipes.js` | the data: an array in the repo, no API yet. Recipe `r4` has an XSS payload as its name |

## Setup

You need Node.js. In this `demo/` folder:

```
npm install
npm run dev
```

Open the URL it prints (`http://localhost:5173`), with DevTools open.

`dist/` and `node_modules/` aren't committed. `npm install` recreates
`node_modules/`, and `npm run build` recreates `dist/`.

## How it was made

```
npm create vite@latest recipes -- --template react
```

Then we deleted the template's counter, logos and `App.css`, and wrote the
files above.

## Try it

1. **Hot reload.** Change the text in `RecipeCard.jsx` and save. The page
   updates without reloading.
2. **Props.** Add a recipe to `recipes.js`. A new card appears: same
   component, different data.
3. **Keys.** Remove `key={recipe.id}` in `RecipeList.jsx` and save. The
   console warns: *Each child in a list should have a unique "key" prop*.
   Put it back.
4. **XSS.** The fourth recipe is named `<img src=x onerror=alert('XSS')>`.
   It shows as text, and no alert pops up: React escapes everything inside
   `{}`. Compare with `innerHTML` in last class's demo.
5. **The empty list.** Change `App.jsx` to pass `recipes={[]}`. You get
   "No recipes yet."
6. **Two views of the page.** *View Page Source* shows an empty
   `<div id="root">`. The *Elements* tab shows the cards. JavaScript built
   them in the browser.
7. **JSX is compiled.** In the *Network* tab, open `RecipeCard.jsx`.
   Vite has turned `<article>` into a function call, `_jsxDEV("article", ...)`.
8. **The cost.** `npm run build` prints the bundle size: about 220 KB
   (69 KB gzipped), mostly React itself. The class 10 bookshelf was 7 KB.

## Questions to think about

- `RecipeCard` uses `key={tag}` for its tags. What breaks if a recipe lists
  the same tag twice?
- Why is the array index a bad key if the list can be sorted?
- Which parts of your M1 prototype would become components?
