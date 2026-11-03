# My Recipes: the recipe filter form

**CSCI 3230U · Lecture 08a · demo walkthrough**

The recipe app from 07b, with one new control: a **"Quick (≤ 20 min)"
checkbox** with a count badge. The search box and the checkbox are both
**controlled inputs**: their values live in `App`'s state. The list on
screen is **derived** from that state on every render.

## What's in this folder

The files are saved **after** the demo:

| File | What to look at |
|---|---|
| `src/App.jsx` | `query` and `quickOnly` are state. `matches`, `quickCount` and `visible` are computed on every render: no `useState` for them |
| `src/components/SearchBox.jsx` | a controlled text input: `value` + `onChange`, reading `e.target.value` |
| `src/components/QuickToggle.jsx` | a controlled checkbox: `checked` + `onChange`, reading `e.target.checked`. The badge uses `count > 0 &&` |
| `src/components/RecipeList.jsx`, `RecipeCard.jsx`, `recipes.js` | unchanged from 07b |

## Setup

You need Node.js. In this `demo/` folder:

```
npm install
npm run dev
```

Open the URL it prints (`http://localhost:5173`), with DevTools open.

## Try it

Each of these breaks one thing. Put the code back after each one.

1. **The frozen input.** In `SearchBox.jsx`, delete the `onChange` line.
   Reload and type: nothing appears. The console says *You provided a
   `value` prop to a form field without an `onChange` handler*. The state
   never changes, so React keeps showing `""`.
2. **The `0` on the page.** In `QuickToggle.jsx`, change `count > 0 &&` to
   `count &&`. Search for `thai`: a `0` appears after "Quick (≤ 20 min)".
   `0 && anything` is `0`, and React prints numbers.
3. **Two sources of truth.** In `App.jsx`, store the filtered list in
   state instead of computing it:

   ```jsx
   const [visible, setVisible] = useState(initialRecipes);
   function handleSearch(text) {
     setQuery(text);
     setVisible(recipes.filter((r) => r.name.toLowerCase().includes(text.toLowerCase())));
   }
   ```

   and pass `handleSearch` to `SearchBox`. Click "Add recipe": it says
   *Showing 4 of 5* and the new recipe is missing. Tick "Quick": nothing
   changes. Only the search box updates `visible`; everything else
   forgot to.
4. **`value` vs `checked`.** In `QuickToggle.jsx`, use
   `event.target.value` instead of `event.target.checked`. Log it: it's
   the string `"on"`, ticked or not.

## Questions to think about

- Why is `quickOnly` state, but `quickCount` isn't?
- Why does `QuickToggle` have no state of its own?
- How would you add a "Meal" `<select>` (breakfast / lunch / dinner)?
  Which property do you read, and where does the state go?
