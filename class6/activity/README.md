# Activity: Load the bookshelf from a server

**CSCI 3230U · Lecture 04a, Asynchronous JavaScript · ~25 minutes · work in pairs**

Practice only, nothing to hand in.

Last class the books were an array inside `books.js`. Real apps get their data
from a server, so today the bookshelf loads it over the network:

1. **Load `books.json` with `fetch` and `await`.**
2. **Handle a request that fails.**
3. **Load two files at the same time with `Promise.all`.**

The starter is last class's solution, plus three new files:

| File | What's in it |
|---|---|
| `books.json` | the same four books, as JSON |
| `reviews.json` | six reviews, used in Part 3 |
| `api.js` | `slowFetch(url)`: waits 1 second, then does a normal `fetch`. Local files load too fast to see anything wait. Read it, but don't change it. |

---

## Setup (2 minutes)

```bash
cd bookshelf
python3 -m http.server 8000
```

Open **<http://localhost:8000/>** with the console open (**F12**, Console tab).
`npx serve` or VS Code's **Live Server** work too. `fetch` needs a server,
just like modules.

---

## Warm-up: predict, then check (3 minutes)

Type these into the console one at a time. Guess the answer before you press
Enter.

```js
console.log("A"); fetch("books.json").then(() => console.log("B")); console.log("C");
```

```js
const p = fetch("books.json");
p
```

```js
const response = await p;
response.ok
```

```js
const data = await response.json();
data.length
```

What is `p`? And why does `response.json()` need its own `await`?

---

## Part 1: Load the books (8 minutes)

1. In `books.js`, fill in `loadBooks()`:
   - `await slowFetch("books.json")` to get the response.
   - Return `response.json()`.
2. Delete the hard-coded `books` array from `books.js`.
3. In `script.js`, change the import to bring in `loadBooks` instead of `books`.
4. At the first `TODO` in `script.js`:
   - print `Loading books...`
   - `const books = await loadBooks();`
   - print `Loaded 4 books` (use `books.length`, don't hard-code the 4)

Reload. After a one-second pause, you should see the same output as last
class, starting with `Loading books...` and `Loaded 4 books`.

---

## Part 2: When loading fails (5 minutes)

1. In `loadBooks`, change `"books.json"` to `"bookz.json"` and reload. Read the
   error. With Python's server it complains about `<!DOCTYPE`, not about a
   missing file. Why?
2. `fetch` only rejects when the **network** fails. A 404 is still a response.
   After the `await`, add:
   ```js
   if (!response.ok) {
     throw new Error(`HTTP ${response.status}`);
   }
   ```
   Reload. The error now says `HTTP 404`.
3. In `script.js`, catch it so the page keeps going:
   ```js
   let books = [];
   try {
     books = await loadBooks();
   } catch (error) {
     console.error("Could not load books:", error.message);
   }
   ```
   Reload. You get one clear red line, and the rest prints with 0 books.
4. Put `"books.json"` back.

---

## Part 3: Two requests at once (7 minutes)

1. Fill in `loadReviews()` in `books.js`. It's the same as `loadBooks`, for
   `reviews.json`.
2. In `script.js`, load both **one after the other** and time it:
   ```js
   console.time("load");
   books = await loadBooks();
   const reviews = await loadReviews();
   console.timeEnd("load");
   ```
   About how long does it take?
3. Now load them **at the same time**:
   ```js
   [books, reviews] = await Promise.all([loadBooks(), loadReviews()]);
   ```
   (`reviews` now needs to be a `let` declared next to `books`, and both lines
   go inside your `try`.) How long now?
4. At the last `TODO`, print each book's average rating. For each book,
   `filter` its reviews and `reduce` their ratings:
   ```
   The Pragmatic Programmer: 4.5 / 5 (2 reviews)
   Don't Make Me Think: 4 / 5 (1 reviews)
   Eloquent JavaScript: 4 / 5 (2 reviews)
   You Don't Know JS Yet: 4 / 5 (1 reviews)
   ```

---

## Done?

A reload prints this, with no red:

```
Loading books...
Loaded 4 books and 6 reviews
load: ~1000 ms
titles: ['The Pragmatic Programmer', "Don't Make Me Think", 'Eloquent JavaScript', "You Don't Know JS Yet"]
reading: 2 books
total pages: 1183
Currently reading: The Pragmatic Programmer, You Don't Know JS Yet
addBook     → new: 5 books, original: 4 books
sortByTitle → new: Don't Make Me Think, original: The Pragmatic Programmer
The Pragmatic Programmer: 4.5 / 5 (2 reviews)
Don't Make Me Think: 4 / 5 (1 reviews)
Eloquent JavaScript: 4 / 5 (2 reviews)
You Don't Know JS Yet: 4 / 5 (1 reviews)
```

---

## If you get stuck

- **`books` is a `Promise`, not an array?** You forgot `await` in front of
  `loadBooks()`.
- **`response.json is not a function`?** You forgot `await` in front of
  `slowFetch(...)`, so `response` is still a Promise.
- **`Unexpected token '<'`?** The URL is wrong, and the server sent back an
  HTML error page. Check the file name, and check `response.ok`.
- **`Assignment to constant variable`?** `books` was declared with `const`.
  Use `let` when you assign it inside `try`.
- **`books is not defined` or `does not provide an export named 'books'`?**
  You deleted the array but still import `books`. Import `loadBooks` instead.
- **Nothing loads when you double-click `index.html`?** It needs a server
  (`file://` addresses can't use `fetch` or modules).

---

## Finished early?

1. **Freeze the page.** Add this at the top of `script.js`, reload, and try to
   type in the form's Title box right away:
   ```js
   const end = Date.now() + 3000;
   while (Date.now() < end) {}
   ```
   Now move the loop inside an `async` function and call it. Does it still
   freeze? Why?
2. **Show the books even if the reviews fail.** Break `reviews.json` in
   `loadReviews`. With `Promise.all`, the books are lost too. Rewrite it with
   `Promise.allSettled`, so the books still print.
3. **The old way.** Rewrite `loadBooks` with `.then()` instead of `await`.

The finished version, with every change explained, is posted in `solution/`
after class.
