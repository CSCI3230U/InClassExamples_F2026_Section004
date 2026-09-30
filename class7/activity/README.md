# Activity: Make the bookshelf live

**CSCI 3230U · Lecture 04b, The DOM & Events · ~25 minutes · work in pairs**

Practice only

The starter is last class's solution, with these changes:

| File | What changed |
|---|---|
| `index.html` | the form is `id="add-form"`; the hard-coded cards are gone, leaving an empty `<ul id="book-list">` |
| `books.json` | each book has an `"id"` (a string), and three have a `"cover"` |
| `books.js` | `loadBooks`, and `addBook` renamed to `withBook` (no reviews today) |
| `script.js` | a skeleton with `bookCard(book)` and `render()` to fill in |
| `styles.css` | styles for `.status` and the buttons inside a card |

---

## Setup (2 minutes)

```bash
cd bookshelf
python3 -m http.server 8000
```

Open **<http://localhost:8000/>** with DevTools open (**F12**). The shelf is
empty for now. `npx serve` or VS Code's **Live Server** work too.

---

## Warm-up: the DOM in the console (3 minutes)

Type these into the Console one at a time. Guess the answer before you press
Enter.

```js
document.querySelector("h1").textContent = "Our Bookshelf";
```

```js
const links = document.querySelectorAll("nav a");
links.length
```

```js
links.map((a) => a.textContent)
```

```js
document.querySelector("#nope")
```

Now reload the page. Where did "Our Bookshelf" go? And what is `links`, if
it doesn't have `map`?

**Bonus:** in the **Elements** tab, click the `<h1>`, then type `$0` in the
Console.

---

## Part 1: Render the books (10 minutes)

All in `script.js`.

1. Select the form and the list:
   ```js
   const form = document.querySelector("#add-form");
   const list = document.querySelector("#book-list");
   ```
2. Finish `bookCard(book)`. The cover is done as an example. Create an `<h3>`
   with the title, a `<p>` with the author, and a `<p class="status">` with
   `STATUS_LABELS[book.status]`. Set their text with `textContent` and
   `append` them to `article`.
3. Write `render()`: empty the list with `list.replaceChildren()`, then
   `for...of` over `shelf` and `list.append(bookCard(book))`.
4. At the TODOs below `render`:
   - show `Loading books...` inside the list (`list.textContent = ...`)
   - `books = await loadBooks();` inside a `try...catch` (declare
     `let books = [];` first, like last class)
   - `let shelf = [...books];`, our own copy of the data: the **state**
   - call `render()`

Reload. You should see `Loading books...` for a second, then **four** cards.
The last one has no cover.

---

## Part 2: Add a book (6 minutes)

1. Listen for the form's `submit` event:
   ```js
   form.addEventListener("submit", (event) => {
     event.preventDefault();
     const data = new FormData(form);
     // TODO
   });
   ```
2. Inside, build `newBook` with `{ id, title, author, status }`:
   - `data.get("title")` reads the field with `name="title"`
   - use `crypto.randomUUID()` for the `id`
3. Change the state, then repaint:
   ```js
   shelf = withBook(shelf, newBook);
   render();
   form.reset();
   ```

Add a book. It should appear as a fifth card, and the form should clear.

Then comment out `event.preventDefault()` and add another one. What happens,
and what's in the address bar? Put it back.

---

## Part 3: Remove a book (6 minutes)

1. In `script.js`, write `removeBook(id)`. It sets `shelf` to a **new**
   array without that book (which of `map`/`filter`/`reduce`?), then calls
   `render()`.
2. In `bookCard`, add a `<button type="button">` with the text `Remove`, and
   set `button.dataset.id = book.id`. In the Elements tab, find the
   `data-id="..."` it created.
3. Add **one** listener to the **list** (not to each button):
   ```js
   list.addEventListener("click", (event) => {
     const button = event.target.closest("button[data-id]");
     if (!button) return;
     removeBook(button.dataset.id);
   });
   ```

Remove one of the original books, then add a new one and remove that too.
Both work with the same listener. Why does it still work for a button that
didn't exist when you called `addEventListener`?

---

## Done?

- Four cards load after `Loading books...`.
- The form adds a card, doesn't reload the page, and clears itself.
- Every **Remove** button works, including on books you just added.
- Clicking a card anywhere else does nothing.
- There's no red in the console. A `favicon.ico` 404 is fine.

A reload brings back the original four books. Nothing is saved yet: `shelf`
lives in memory only.

---

## If you get stuck

- **`Cannot read properties of null`?** `querySelector` found nothing. Check
  the selector: `#book-list` needs the `#`.
- **The page flashes and your book disappears?** The form submitted for real.
  You're missing `event.preventDefault()`, or it has a typo.
- **`data.get("title")` is `null`?** `FormData` uses the field's `name`, not
  its `id`.
- **Remove does nothing?** `console.log(button.dataset.id)`. `dataset` values
  are always strings, so they only match string ids. Also check that
  `removeBook` assigns the filtered array back to `shelf`.
- **Books appear twice after adding one?** `render()` must empty the list
  first with `replaceChildren()`.
- **`Cannot access 'shelf' before initialization`?** `render()` was called
  before the `let shelf = ...` line. Call it after.
- **`books is not iterable` or `Assignment to constant variable`?** `books`
  must be declared with `let` and must be an array. Did you forget an `await`?
- **`crypto.randomUUID is not a function`?** Open the page as `localhost`,
  not by your computer's IP address.

---

## Finished early?

1. **XSS.** Add a book with this title:
   `<img src=x onerror="alert('hacked')">`.
   Then, in `bookCard`, change the title's `textContent` to `innerHTML` and
   reload. Add the same book again. What happened? Change it back.
2. **Empty shelf and count.** Show `My shelf (4)` in the heading, kept up to
   date by `render()`. When the shelf is empty, show
   `Your shelf is empty.` instead of nothing.
3. **Change the status.** Add a second button to each card, **Next status**,
   that cycles *Want to read → Reading → Finished → Want to read*. Keep the
   single listener on the list: give the buttons `data-action="remove"` and
   `data-action="next"`, and check which one was clicked. Update the book with
   `map`, not by changing it in place.
4. **Hide finished books.** Add `<label><input type="checkbox"
   id="hide-finished"> Hide finished</label>` above the list. In `bookCard`,
   when it's checked and the book is finished, call
   `li.setAttribute("hidden", "")`. Call `render()` on the checkbox's
   `change` event.

The finished version, with every change explained, is posted in `solution/`
after class.
