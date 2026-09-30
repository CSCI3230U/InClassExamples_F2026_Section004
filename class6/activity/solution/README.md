# Solution: Load the bookshelf from a server

Run it the same way as the starter: `python3 -m http.server 8000` from inside
this folder, `http://localhost:8000/`, console open.

| File | What changed |
|---|---|
| `books.js` | the hard-coded array is gone; `loadBooks` and `loadReviews` fetch the JSON files |
| `script.js` | loads both files with `Promise.all` inside `try...catch`, then prints the averages |
| `books.json`, `reviews.json`, `api.js` | unchanged from the starter |

---

## Warm-up

| You typed | Result | Why |
|---|---|---|
| `console.log("A"); fetch(...).then(() => console.log("B")); console.log("C");` | `A`, `C`, then `B` | The `.then` callback waits until the current code has finished and the response has arrived. |
| `p` | `Promise {<pending>}` or `Promise {<fulfilled>: Response}` | `fetch` returns a **Promise** right away, not the data. |
| `response.ok` | `true` | `await p` unwraps the Promise into a `Response`. |
| `data.length` | `4` | The response **headers** arrive first. The body is read separately, so `response.json()` is another Promise. |

---

## Part 1: load the books

```js
export async function loadBooks() {
  const response = await slowFetch("books.json");
  return response.json();
}
```

```js
import { loadBooks, addBook, sortByTitle } from "./books.js";

console.log("Loading books...");
const books = await loadBooks();
console.log(`Loaded ${books.length} books`);
```

- **`await` works at the top level** of `script.js` because it's a module.
  In a classic script it would have to be inside an `async` function.
- **The page doesn't freeze during the 1-second wait.** `await` pauses only
  this module, not the main thread. You can scroll and type while it loads.
- **`return response.json()` without `await` is fine.** An `async` function
  that returns a Promise passes it on, and the caller's `await` unwraps it.
- **Everything below the `await` is unchanged.** It's the same code as last
  class, and it runs once `books` has a value.

---

## Part 2: when loading fails

```js
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
```

```js
let books = [];
try {
  books = await loadBooks();
} catch (error) {
  console.error("Could not load books:", error.message);
}
```

- **Why the `<!DOCTYPE` error?** The server answered the missing file with a
  404 **HTML page**. `fetch` got a response, so it didn't reject.
  `response.json()` then tried to parse HTML as JSON and failed at the first `<`.
- **`response.ok`** is `true` for status 200–299. Checking it turns a
  confusing parse error into `HTTP 404`.
- **`throw` inside an `async` function rejects its Promise**, so the caller's
  `try...catch` catches it just as if the error had happened on the spot.
- **`let books = []`:** if loading fails, the rest of the script still runs,
  with an empty list. That's why the last check uses `sorted[0]?.title`:
  with 0 books, `sorted[0]` is `undefined`, and `.title` would crash.

---

## Part 3: two requests at once

```js
let books = [];
let reviews = [];

try {
  [books, reviews] = await Promise.all([loadBooks(), loadReviews()]);
} catch (error) {
  console.error("Could not load the shelf:", error.message);
}
```

| Version | Time | Why |
|---|---|---|
| `await loadBooks()` then `await loadReviews()` | ~2 s | The second request only **starts** after the first finishes. |
| `await Promise.all([...])` | ~1 s | Both requests start first, then we wait once for both. |

- **`Promise.all` takes an array of Promises** and resolves to an array of
  results, in the **same order**. The `[books, reviews] = ...` line
  destructures that array.
- **If either request fails, `Promise.all` rejects**, and we land in `catch`
  with nothing loaded. The second "Finished early?" task fixes that.

Average rating per book, using last class's `filter` and `reduce`:

```js
for (const book of books) {
  const bookReviews = reviews.filter((review) => review.title === book.title);
  const total = bookReviews.reduce((sum, review) => sum + review.rating, 0);
  const average = bookReviews.length ? total / bookReviews.length : 0;
  console.log(`${book.title}: ${average} / 5 (${bookReviews.length} reviews)`);
}
```

The `bookReviews.length ? ... : 0` check avoids dividing by zero, which would
print `NaN` for a book with no reviews.

---

## Finished early?

**1. Freeze the page.** The busy loop blocks the main thread for 3 seconds:
you can't type, click or scroll. Moving it into an `async` function
**doesn't help**. `async` doesn't move code to another thread. It only lets
the function *pause at an `await`*, and a `while` loop never awaits.
Waiting (network, timers) is async-friendly; heavy computation needs a Web
Worker.

**2. Show the books even if the reviews fail:**

```js
const [booksResult, reviewsResult] = await Promise.allSettled([loadBooks(), loadReviews()]);

if (booksResult.status === "fulfilled") {
  books = booksResult.value;
} else {
  console.error("Could not load books:", booksResult.reason.message);
}

if (reviewsResult.status === "fulfilled") {
  reviews = reviewsResult.value;
} else {
  console.error("Could not load reviews:", reviewsResult.reason.message);
}
```

`Promise.allSettled` never rejects. It waits for every Promise and tells you,
for each one, whether it was `"fulfilled"` (with a `value`) or `"rejected"`
(with a `reason`).

**3. The old way, with `.then()`:**

```js
export function loadBooks() {
  return slowFetch("books.json").then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  });
}
```

It doesn't need `async`, because it already returns a Promise: the one
that `.then` creates. Throwing inside `.then` rejects that Promise, just like
throwing inside an `async` function.
