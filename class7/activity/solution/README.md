# Solution: Make the bookshelf live

Run it the same way as the starter: `python3 -m http.server 8000` from inside
this folder, then open `http://localhost:8000/`.

| File | What changed |
|---|---|
| `script.js` | selects the form and list, builds cards with `bookCard`, draws them with `render`, adds with `submit`, removes with one delegated `click` listener |
| `index.html`, `books.js`, `books.json`, `styles.css`, `api.js` | unchanged from the starter |

The code follows the slides (04b): `#add-form`, `#book-list`, `bookCard`,
`withBook`, `removeBook`, `let shelf = [...books]`.

---

## Warm-up

| You typed | Result | Why |
|---|---|---|
| `...textContent = "Our Bookshelf"` | the heading changes at once | The page is a live view of the DOM tree. Change a node and the page updates. |
| `links.length` | `2` | `querySelectorAll` returns **every** match. |
| `links.map(...)` | `TypeError: links.map is not a function` | It's a `NodeList`, not an array. It has `length` and `forEach`, but no `map`. Use `[...links].map(...)`. |
| `querySelector("#nope")` | `null` | Nothing matched. Calling a method on `null` is the most common DOM error. |
| after a reload | back to "Bookshelf" | The DOM lives in memory. The browser rebuilds it from `index.html` on every load. |

`$0` is the element selected in the Elements tab, as a JS object.

---

## Part 1: render the books

```js
const form = document.querySelector("#add-form");
const list = document.querySelector("#book-list");
```

```js
const title = document.createElement("h3");
title.textContent = book.title;

const author = document.createElement("p");
author.textContent = book.author;

const status = document.createElement("p");
status.classList.add("status");
status.textContent = STATUS_LABELS[book.status];

article.append(title, author, status);
```

```js
function render() {
  list.replaceChildren();
  for (const book of shelf) {
    list.append(bookCard(book));
  }
}

list.textContent = "Loading books...";

let books = [];
try {
  books = await loadBooks();
} catch (error) {
  console.error("Could not load books:", error.message);
}

let shelf = [...books];
render();
```

- **No `DOMContentLoaded` needed.** `type="module"` scripts run after the
  HTML is parsed, so `#book-list` exists. A plain `<script>` in `<head>` would
  get `null`.
- **`createElement` makes a node in memory.** It appears only when it's
  `append`ed to something already on the page. `append` takes several nodes
  at once.
- **`bookCard` returns an element** and knows nothing about the page. It's a
  component in everything but name. React's components (06b) are the same
  idea.
- **`list.textContent = "Loading books..."`** replaces everything inside the
  list with one text node. `render()` then clears it with `replaceChildren()`.
- **`render()` can use `shelf` even though it's declared lower down.** The
  function only reads `shelf` when it's *called*, and the first call comes
  after `let shelf = ...`. Calling it earlier gives
  `Cannot access 'shelf' before initialization`.
- **`shelf` is the state.** It's `let` because it gets replaced with a new
  array on every change. The page is always drawn *from* it, never the other
  way round.

---

## Part 2: add a book

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const newBook = {
    id: crypto.randomUUID(),
    title: data.get("title"),
    author: data.get("author"),
    status: data.get("status"),
  };

  shelf = withBook(shelf, newBook);
  render();
  form.reset();
});
```

- **Without `preventDefault()`** the browser does what forms have always done:
  it sends the fields to the page's URL and loads the result. The address bar
  shows `?title=...&author=...&status=want`, the page reloads, and the new book
  is gone because `shelf` was in memory.
- **Listen for `submit`, not `click`.** Pressing Enter in a field submits too,
  and `required` blocks an empty title before `submit` even fires.
- **`FormData` reads fields by `name`.** The `id` is for the `<label>`.
- **`crypto.randomUUID()`** makes an id that won't clash with the others. It
  only exists on secure pages: `https://` or `localhost`.
- **State first, then repaint.** `withBook` returns a new array (03b), and
  `render()` redraws from it. We never `append` the new card by hand.

---

## Part 3: remove a book

```js
// in bookCard
const button = document.createElement("button");
button.type = "button";
button.textContent = "Remove";
button.dataset.id = book.id;
```

```js
function removeBook(id) {
  shelf = shelf.filter((book) => book.id !== id);
  render();
}

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  removeBook(button.dataset.id);
});
```

- **Why does it work for new buttons?** Events **bubble**. A click on a
  button fires on the button, then on the `<li>`, the `<ul>`, and so on up to
  `document`. The listener is on the `<ul>`, which `render()` never replaces,
  so it hears clicks on buttons that didn't exist when it was added.
- **Listeners on each button would be thrown away** on every `render()`,
  along with the old buttons. Delegation needs one listener instead of one
  per card.
- **`closest("button[data-id]")`** starts at the clicked element and walks up
  to the nearest match. That handles a click on text or an icon inside the
  button. It returns `null` for a click anywhere else, hence the `return`.
- **`dataset.id` is a string.** That's why the ids in `books.json` are
  strings too. With `"id": 1`, `1 !== "1"` is `true`, so nothing would be
  removed.
- **`type="button"`**: a `<button>`'s default type is `submit`. It's outside
  the form here, so it wouldn't submit anything, but it's a good habit.

---

## Finished early?

**1. XSS.** With `textContent` the title shows as text, angle brackets
included. With `innerHTML`, the browser parses it as HTML: the `<img>` fails
to load, and its `onerror` runs your JavaScript. A real attacker would
steal cookies or tokens rather than show an alert. Any text a user can type
goes in `textContent`. More in 06a (Security).

**2. Empty shelf and count:**

```js
const heading = document.querySelector("#list h2");

function render() {
  heading.textContent = `My shelf (${shelf.length})`;
  if (shelf.length === 0) {
    list.textContent = "Your shelf is empty.";
    return;
  }
  list.replaceChildren();
  for (const book of shelf) {
    list.append(bookCard(book));
  }
}
```

Because every change goes through `render()`, the count and the message are
always right, whether a book was added, removed or loaded.

**3. Change the status:**

```js
const NEXT_STATUS = { want: "reading", reading: "finished", finished: "want" };

// in bookCard: two buttons, each with data-id and a data-action
next.dataset.action = "next";
button.dataset.action = "remove";

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  if (button.dataset.action === "remove") {
    removeBook(id);
  } else if (button.dataset.action === "next") {
    shelf = shelf.map((book) =>
      book.id === id ? { ...book, status: NEXT_STATUS[book.status] } : book
    );
    render();
  }
});
```

`{ ...book, status }` makes a new book object with one field changed, so the
array and the book are both new. One listener still handles every button:
`data-action` says *what* to do, and `data-id` says *which* book.

**4. Hide finished books:**

```js
const hideFinished = document.querySelector("#hide-finished");

// in bookCard, before `return li`
if (hideFinished.checked && book.status === "finished") {
  li.setAttribute("hidden", "");
}

hideFinished.addEventListener("change", render);
```

The book stays in `shelf`; only the page hides it. The checkbox is
another piece of state, and `render()` reads it like it reads `shelf`.
