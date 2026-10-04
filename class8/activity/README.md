# Activity: A library, then real tooling

**CSCI 3230U · Lecture 05a, Libraries & Tooling · ~30 minutes · work in pairs**

Practice only, nothing to hand in.

Last class you built the bookshelf by hand. Today you:

1. **Redo the DOM work with a library (jQuery)**, loaded from a CDN.
2. **Turn the bookshelf into an npm project** with a `package.json` and Vite.
3. **Install a library from npm, and build the site** you would deploy.

The starter is last class's solution, plus two new files:

| File | What's in it |
|---|---|
| `index.html`, `script.js` | last class's solution, unchanged. This is the **vanilla** version. |
| `jquery.html` | a copy of `index.html` that loads `jquery.js` instead |
| `jquery.js` | the same app written with jQuery, with three TODOs |
| `books.js`, `api.js`, `books.json`, `styles.css`, `covers/` | unchanged; both versions share them |

You need **Node.js** for Parts 2 and 3. Check now, in a terminal:

```bash
node -v
npm -v
```

If either says `command not found`, pair up with someone who has Node, and
install it after class from <https://nodejs.org> (the LTS version).

---

## Setup (2 minutes)

```bash
cd bookshelf
python3 -m http.server 8000
```

Open **<http://localhost:8000/>** with DevTools open (**F12**). It's the
bookshelf from last class: four cards, add, remove.

Now open **<http://localhost:8000/jquery.html>**. The shelf is empty. What's
the error in the Console?

---

## Warm-up: a library from a CDN (4 minutes)

1. In `jquery.html`, replace the TODO comment in `<head>` with:
   ```html
   <script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>
   ```
   Reload. The error is gone, and the list is stuck on `Loading books...`
   because `render()` is one of your TODOs.
2. In the **Network** tab, find `jquery-4.0.0.min.js`. How big is it? Which
   server did it come from?
3. Type these into the Console one at a time. Guess the answer before you
   press Enter.

```js
$("h1").text("Our Bookshelf").addClass("active");
```

```js
$("nav a").length
```

```js
$("nav a").text()
```

```js
$("#nope").text("hello")
```

Last class, `document.querySelector("#nope")` gave you `null`, and the next
line crashed. What did jQuery do instead? Is that better or worse when you
have a typo in a selector?

---

## Part 1: The bookshelf in jQuery (8 minutes)

All in `jquery.js`. Keep `script.js` open beside it: you are translating it.

| Vanilla | jQuery |
|---|---|
| `document.querySelector("#book-list")` | `$("#book-list")` |
| `document.createElement("h3")` | `$("<h3>")` |
| `el.textContent = "Hi"` | `$el.text("Hi")` |
| `el.classList.add("status")` | `$el.addClass("status")` |
| `article.append(a, b)` | `$article.append($a, $b)` |
| `list.replaceChildren()` | `$list.empty()` |

1. **TODO 1**, in `bookCard`: the title, the author and the status. Most
   jQuery methods return the same object, so you can chain:
   ```js
   $("<p>").addClass("status").text(STATUS_LABELS[book.status])
   ```
2. **TODO 2**, `render()`: empty the list, then append a card per book.
   Reload: four cards, and the form already adds a fifth.
3. **TODO 3**, remove a book. Start with the version from the slides:
   ```js
   $list.on("click", "button[data-id]", function () {
     $(this).closest("li").remove();
   });
   ```
   Click **Remove** on a book. It disappears. Now **add a new book**. What
   came back, and why?
4. Fix it. The handler must change the **state**, like `script.js` does:
   ```js
   removeBook($(this).attr("data-id"));
   ```

Compare `bookCard` in the two files. Which is shorter? Now compare
`removeBook`, `shelf` and the submit handler. What did jQuery change there?

---

## Part 2: Make it an npm project (8 minutes)

Stop the Python server (**Ctrl+C**). Stay inside `bookshelf/`.

1. Create a `package.json`, then open it:
   ```bash
   npm init -y
   ```
2. Install Vite as a **dev** dependency:
   ```bash
   npm install -D vite
   ```
   Look at what changed:
   - `package.json` has a new section. What does the `^` in the version mean?
   - There's a new `package-lock.json`, and a new `node_modules/` folder.
   - You installed one package. How many folders are in `node_modules/`?
     (`ls node_modules | wc -l`)
3. In `package.json`, change `"type"` to `"module"` and replace the
   `"scripts"` section:
   ```json
   "type": "module",
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview"
   },
   ```
4. Create a file named `.gitignore` with two lines:
   ```
   node_modules/
   dist/
   ```
5. Start the dev server and open the URL it prints:
   ```bash
   npm run dev
   ```
6. Try **Hot Module Replacement**. Add two books in the page. Then, in
   `styles.css`, change `--accent` to `#1d6fb8` and save. Don't reload.
   What happened to the colour? Are your two books still there?
7. Now change something in `script.js` (the `"Remove"` button text, say) and
   save. Are your two books still there this time?

---

## Part 3: A library from npm, and the build (8 minutes)

1. Install a library. No `-D` this time:
   ```bash
   npm install canvas-confetti
   ```
   Where did it go in `package.json`? Why not next to Vite?
2. At the top of `script.js`:
   ```js
   import confetti from "canvas-confetti";
   ```
   In the submit handler, after `form.reset()`:
   ```js
   if (newBook.status === "finished") {
     confetti();
   }
   ```
   Add a book with the status **Finished**.
3. Stop the dev server (**Ctrl+C**) and build the site:
   ```bash
   npm run build
   ```
   Look in the new `dist/` folder. How many `.js` files are there now? Open
   the one in `dist/assets/`. Can you read it? Why is its name so strange?
4. Serve the built site and open the URL it prints:
   ```bash
   npm run preview
   ```
   The shelf is empty. Read the error in the Console, then look at the
   `books.json` request in the **Network** tab. What did the server send back?
5. Fix it. Vite copies only the `public/` folder into `dist/` as it is.
   Stop the preview, then:
   ```bash
   mkdir public
   mv books.json covers public/
   npm run build
   npm run preview
   ```
   Four cards again. Check that `dist/` now has `books.json` and `covers/`.

---

## Done?

- `jquery.html` shows four cards, adds a book, and removes one **for good**.
- `package.json` has `dev`, `build` and `preview` scripts, Vite under
  `devDependencies`, and `canvas-confetti` under `dependencies`.
- `npm run dev` serves the bookshelf, and a CSS change shows up without a reload.
- Adding a **Finished** book throws confetti.
- `npm run build` then `npm run preview` shows four cards.
- `.gitignore` lists `node_modules/` and `dist/`.

---

## If you get stuck

- **`$ is not defined`?** The jQuery `<script>` tag is missing, has a typo
  in the URL, or you're offline. It must come **before** the module script.
- **`$("h1")` works in the Console on a page without jQuery?** Chrome's
  Console has its own `$` shortcut for `querySelector`. It isn't jQuery, and
  it only exists in the Console. `jQuery.fn.jquery` prints the version if the
  real one is loaded.
- **`$(this)` is wrong or `undefined`?** The handler must be a `function`,
  not an arrow function. Arrow functions don't get their own `this`.
- **A removed book comes back?** You removed the `<li>` but not the book in
  `shelf`. Call `removeBook`.
- **`npm: command not found`?** Node isn't installed. Pair up for today.
- **`npm install` hangs or fails?** Check the Wi-Fi, then try again. It
  downloads from the network.
- **`npm error Missing script: "dev"`?** The `"scripts"` section wasn't
  saved, or you're not inside `bookshelf/`.
- **`npm error ... JSON.parse`?** `package.json` is strict JSON: double
  quotes, a comma between entries, and no comma after the last one.
- **`Port 5173 is in use`?** Vite picks the next port. Use the URL it prints.
- **`Failed to resolve import "canvas-confetti"`?** The install failed, or
  it ran in a different folder. Check `dependencies` in `package.json`.
- **`Unexpected token '<', "<!doctype "... is not valid JSON`?** That's
  step 4 of Part 3. Read on.

---

## Finished early?

1. **`.data()` has a surprise.** In `jquery.js`, change
   `$(this).attr("data-id")` to `$(this).data("id")`. Try to remove one of
   the original four books, then add a book and remove that one. Which works?
   `console.log(typeof $(this).data("id"))` for each. Change it back.
2. **XSS, jQuery style.** In `jquery.js`, replace the title line with
   `$article.append("<h3>" + book.title + "</h3>");`. Add a book titled
   `<img src=x onerror="alert('hacked')">`. Which vanilla property does
   `.append("<...>")` behave like? Change it back.
3. **Why you needed a bundler.** Stop Vite and serve the folder with
   `python3 -m http.server 8000` again. Open the page and read the Console
   error. What can't the browser do with `"canvas-confetti"`? (To see the
   books again without Vite, you'd also have to move them back out of
   `public/`.)
4. **The other way to get jQuery.** `npm install jquery`, delete the CDN
   `<script>` from `jquery.html`, and add `import $ from "jquery";` at the top
   of `jquery.js`. Open `/jquery.html` on the dev server. Which way would you
   pick for a real project, and why?
5. **What does a library cost?** Comment out the `confetti` import and its
   call, run `npm run build`, and note the size of the `.js` file. Put them
   back, build again, and compare. `du -sh node_modules` shows what you
   downloaded to build it.
6. **Semver.** Run `npm ls` and `npm outdated`. Then `npm view vite versions`.
   Which of those versions would `^8.0.0` accept? And `~8.0.0`?

The finished version, with every change explained, is posted in `solution/`
after class.
