# Solution: Refactor the bookshelf

Run it the same way as the starter: `python3 -m http.server 8000` from inside
this folder, `http://localhost:8000/`, console open. It **must** be served,
because `script.js` is a module now.

| File | What's in it |
|---|---|
| `books.js` | the data, `addBook` and `sortByTitle`, all exported |
| `script.js` | imports them and does all the printing |
| `index.html` | loads `script.js` with `type="module"` |

---

## Warm-up

| Expression | Result | Why |
|---|---|---|
| `[1, 2, 3].map((n) => { n * 2 })` | `[undefined, undefined, undefined]` | With `{ }`, the arrow function needs `return`. Without it, each call returns `undefined`. |
| `["1", "2", "3"].map(parseInt)` | `[1, NaN, NaN]` | `map` passes `(item, index)`, and `parseInt` reads the index as the number base. Write `(s) => parseInt(s)`. |
| `nums` after `nums.sort()` | `[1, 2, 3]` | `sort` changes the array itself *and* returns it. `sortedNums === nums` is `true`. |

---

## Part 1: loops to array methods

```js
const titles = books.map((book) => book.title);
const reading = books.filter((book) => book.status === "reading");
const totalPages = books.reduce((sum, book) => sum + book.pages, 0);

const summary = books
  .filter((book) => book.status === "reading")
  .map((book) => book.title)
  .join(", ");
```

In each one, the empty result variable, the `push` and the `let` disappear.
What's left is the line that says what you want.

| You want… | Use | Out |
|---|---|---|
| one new thing per item | `map` | same length |
| some of the items | `filter` | same or shorter |
| one value from all of them | `reduce` | a single value |

In refactor 4, the loop needed `if (summary !== "")` to avoid a leading comma.
`join` only puts `", "` *between* items, so that check isn't needed. Order
matters too: after `.map((book) => book.title)` you only have strings, so
there's no `.status` left to filter on.

---

## Part 2: stop changing the shelf

```js
export const addBook = (list, book) => [...list, book];
export const sortByTitle = (list) => list.toSorted((a, b) => a.title.localeCompare(b.title));
```

- **`addBook`:** `push` added the book to the caller's array, so `books` grew
  too. Spread copies the books into a **new** array and adds one more.
- **`sortByTitle`:** `sort` sorts the array in place and returns the same
  array, so `const sorted = list.sort(...)` only *looks* like a copy.
  `toSorted` returns a sorted copy. In older code you'll see
  `[...list].sort(...)`, which does the same.

Why it matters: in React (week 7), the page only redraws when the state is a
*new* array or object. `books.push(x)` keeps the same array, so nothing
updates. `[...books, x]` works.

---

## Part 3: modules

```js
// books.js
export const books = [ /* ... */ ];
export const addBook = (list, book) => [...list, book];

// script.js
import { books, addBook, sortByTitle } from "./books.js";
```

```html
<script type="module" src="script.js"></script>
```

- **`file://` fails** with a CORS error. Browsers only load modules from a
  server.
- **`defer` isn't needed.** Modules are deferred automatically.
- **Each module has its own scope.** Typing `books` in the console no longer
  works, because it isn't a global any more.

---

## Finished early?

**Count by status:**

```js
const byStatus = books.reduce((acc, book) => {
  acc[book.status] = (acc[book.status] ?? 0) + 1;
  return acc;
}, {});
// { reading: 2, finished: 1, want: 1 }
```

**Numbered list:**

```js
console.log(books.map((book, i) => `${i + 1}. ${book.title}`).join("\n"));
```

**Mark a book finished:**

```js
const markFinished = (list, title) =>
  list.map((book) => (book.title === title ? { ...book, status: "finished" } : book));
```

`map` gives you a new array, but it holds the **same book objects**. Writing
`book.status = "finished"` inside it would still change the original book.
`{ ...book, status: "finished" }` makes a new object for the one book that
changes.
