# Solution: A library, then real tooling

This folder is an npm project now, so it runs differently from the starter:

```bash
npm install      # rebuilds node_modules/ from package.json and the lock file
npm run dev      # then open the URL it prints
```

`node_modules/` and `dist/` are not in the repository. `npm install` and
`npm run build` recreate them.

| File | What changed |
|---|---|
| `jquery.html` | loads jQuery 4 from its CDN, with an `integrity` hash |
| `jquery.js` | the three TODOs: the card's text, `render()`, and the delegated click |
| `package.json`, `package-lock.json` | new: the project's manifest and the exact versions installed |
| `.gitignore` | new: `node_modules/` and `dist/` |
| `script.js` | imports `canvas-confetti` and calls it for a finished book |
| `public/` | new: `books.json` and `covers/` moved here so the build copies them |
| `index.html`, `books.js`, `api.js`, `styles.css` | unchanged |

---

## Setup

`jquery.html` shows an empty shelf and `Uncaught ReferenceError: $ is not
defined`. Nothing has loaded jQuery yet, so `$` doesn't exist, and the module
stops at its first `$(...)` line.

---

## Warm-up

```html
<script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>
```

- **A CDN script adds a global.** There is no `import`: the file runs and
  creates `window.$` and `window.jQuery`. It must come before any script that
  uses `$`. A plain `<script>` runs as soon as it's reached, and a module
  runs after the HTML is parsed, so the order works here.
- **In the Network tab:** about 78 kB (about 27 kB compressed), from
  `code.jquery.com`. That's a server you don't control. If it's down, or
  you're offline, the page breaks.
- **The solution adds `integrity` and `crossorigin`.** `integrity` is a hash
  of the file. If the CDN ever serves different bytes, the browser refuses to
  run them. Always pin an exact version (`4.0.0`, not "latest").

| You typed | Result | Why |
|---|---|---|
| `$("h1").text("Our Bookshelf").addClass("active")` | the heading changes and gets `class="active"` | `.text()` returns the same jQuery object, so `.addClass()` can follow it. This is **chaining**. |
| `$("nav a").length` | `2` | `$()` wraps **every** match, like `querySelectorAll`. |
| `$("nav a").text()` | `"Add a bookMy shelf"` | Reading from several elements joins their text. Writing sets all of them. No loop either way. |
| `$("#nope").text("hello")` | an empty jQuery object, no error | A method on zero matches does nothing. |

**Better or worse?** It's shorter, and nothing crashes. But a typo in a
selector now fails silently: no error, no line number, just a page that
doesn't update. `querySelector` returning `null` at least tells you where to
look.

---

## Part 1: the bookshelf in jQuery

```js
$article.append(
  $("<h3>").text(book.title),
  $("<p>").text(book.author),
  $("<p>").addClass("status").text(STATUS_LABELS[book.status]),
);
```

```js
function render() {
  $list.empty().append(shelf.map(bookCard));
}
```

```js
$list.on("click", "button[data-id]", function () {
  removeBook($(this).attr("data-id"));
});
```

- **`$()` does three jobs.** `$("#book-list")` selects, `$("<h3>")` creates,
  and `$(this)` wraps an existing DOM element.
- **`.text()` is `textContent`.** It's the safe way to put a user's title on
  the page.
- **`.append()` takes an array**, so `render()` needs no loop.
- **`.on("click", selector, handler)` is event delegation.** One listener on
  the list, and jQuery runs the handler only for clicks inside a matching
  button. It replaces `event.target.closest(...)` and `if (!button) return;`.
- **`function`, not an arrow.** jQuery sets `this` to the matched button. An
  arrow function has no `this` of its own, so `$(this)` would wrap the wrong
  thing.
- **`$form[0]`** is the real `<form>` element inside the jQuery object.
  Native APIs such as `new FormData(...)` and `.reset()` need it.

**Why did the removed book come back?** The slides' version,
`$(this).closest("li").remove()`, takes the `<li>` off the page but leaves
the book in `shelf`. The next `render()` draws the page from `shelf`, so the
book returns. The rule from last class still holds with a library: change
the **state**, then render. jQuery makes editing the DOM so easy that
skipping the state is tempting, and that was the usual source of bugs in
jQuery apps.

**What did jQuery change?** `bookCard` is shorter. `shelf`,
`removeBook`, `withBook` and the body of the submit handler are identical.
jQuery shortens the DOM calls. It doesn't change how the app works: you
still update the page yourself. Every method used here also has a native
equivalent now, which is why new projects don't add jQuery.

---

## Part 2: an npm project

```json
{
  "name": "bookshelf",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^8.3.2"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4"
  }
}
```

Your version numbers may be newer. `npm init -y` also writes `description`,
`main`, `keywords`, `author` and `license`; they only matter if you publish
the package, so the solution drops them. `"private": true` stops an
accidental `npm publish`.

- **`^8.3.2` is a range, not a version.** Semver is `MAJOR.MINOR.PATCH`.
  `^` accepts any `8.x.x` from `8.3.2` up, but not `9.0.0`, because a new
  major version may break your code.
- **`package-lock.json` records the exact version of every package** that
  was installed. Commit it: it's what makes your teammate's `npm install`
  match yours.
- **One package, 14 folders.** Vite has its own dependencies, and they have
  theirs. These are **transitive** dependencies. `node_modules/` is about
  34 MB for this project.
- **Never commit `node_modules/` or `dist/`.** Both are generated from files
  that *are* committed. That's what `.gitignore` is for.
- **`"type": "module"`** tells Node that `.js` files use `import`/`export`.
- **`npm run dev` runs `vite` from `node_modules/.bin`.** Nothing is
  installed globally, so everyone on the team runs the same version.
- **Vite replaces `python3 -m http.server`.** It's still an `http://`
  server, so modules and `fetch` work as before.

**Hot Module Replacement.** Saving `styles.css` swaps in the new stylesheet
without reloading: the colour changes and your two added books stay, because
`shelf` is still in memory. Saving `script.js` reloads the whole page, and
the books are gone. Vite can only hot-swap a JavaScript module that says how
to replace itself. A plain script like ours doesn't, so Vite falls back to a
full reload. Frameworks such as React add that support for you.

---

## Part 3: a library from npm, and the build

```js
import confetti from "canvas-confetti";
```

```js
if (newBook.status === "finished") {
  confetti();
}
```

- **`dependencies` vs `devDependencies`.** `canvas-confetti` runs in the
  user's browser, so it's a dependency. Vite only runs on your machine while
  you work, so it's a dev dependency. `-D` is the only difference in the
  command.
- **`"canvas-confetti"` is a bare import**: no `./`, no `.js`. A browser
  can't load it, because it isn't a path or a URL. Vite looks it up in
  `node_modules/` and puts it in the bundle. This is the second way to add a
  library, and the one real projects use.
- **Compare with the CDN.** No global, the version is recorded in
  `package.json`, the code ships from your own server, and it works offline.

**The build.**

```
dist/index.html
dist/assets/index-CQ-Pk2j4.js     12.68 kB
dist/assets/index-2ugfUY2L.css     1.07 kB
```

- **One `.js` file.** `script.js`, `books.js`, `api.js` and the confetti
  library were joined into one, so the browser makes one request, not four.
- **You can't read it.** It's **minified**: no whitespace, no comments, and
  short variable names. Smaller files download faster.
- **The strange name is a hash of the contents.** When the code changes, the
  name changes. That lets browsers cache the file for a long time without
  ever serving a stale one.
- **`dist/index.html` was rewritten** to point at the hashed files.
- **`dist/` is what you deploy.** `npm run preview` serves it locally so you
  can check the real build, not the dev version.

**The empty shelf.** The Console shows:

```
Could not load books: Unexpected token '<', "<!doctype "... is not valid JSON
```

In the Network tab, the `books.json` request has status **200** and the
response is an HTML page. `books.json` isn't in `dist/`. The preview server
answers an unknown URL with `index.html`, which suits single-page apps that
handle their own URLs. `response.ok` is `true`, so the check from 04a
passes, and then `response.json()` fails on the `<` of `<!doctype html>`.
This error message nearly always means "I asked for JSON and got an HTML
page".

**Why wasn't `books.json` copied?** The bundler follows `import` statements
and the tags in `index.html`. `fetch("books.json")` is only a string in your
code, so the bundler doesn't know that file is needed. In dev it worked
because the dev server serves the whole folder. Files in **`public/`** are
copied into `dist/` unchanged, so files you load by URL at run time go there.
The other fix is `import books from "./books.json"`, which puts the data in
the bundle.

**`jquery.html` isn't in `dist/` either.** The build starts from
`index.html` only. It still works on the dev server. Building a second page
needs a `vite.config.js`, which we don't need today.

---

## Finished early?

**1. `.data()`.** `$(this).data("id")` returns the number `1` for
`data-id="1"`: jQuery converts values that look like numbers. The ids in
`books.json` are strings, and `"1" !== 1` is `true` for every book, so
`filter` keeps them all and nothing is removed. A book you added has a UUID
id, which stays a string, so removing that one works. `.attr("data-id")`
always returns the string. A helpful conversion that breaks one case out of
two is a hard bug to find.

**2. XSS.** `.append("<h3>" + book.title + "</h3>")` parses the string as
HTML, like `innerHTML`. The `<img>` fails to load and its `onerror` runs.
In jQuery, a string that starts with `<` is HTML. User text goes through
`.text()`, for the same reason it goes through `textContent`.

**3. Without a bundler.**

```
Uncaught TypeError: Failed to resolve module specifier "canvas-confetti".
Relative references must start with either "/", "./", or "../".
```

The browser only knows how to load URLs. It has no idea what `node_modules/`
is. Resolving package names is one of the bundler's jobs.

**4. jQuery from npm.** `npm install jquery`, then `import $ from "jquery";`
in `jquery.js`, and the CDN tag can go. For a real project, npm: the version
is in `package.json` and the lock file, there's no global, nothing depends
on someone else's server, and the bundler can drop code you don't use. The
CDN tag is fine for a quick experiment or a single page with no build step.

**5. What a library costs.** Without confetti the bundle is about 2 kB. With
it, about 12.7 kB. One function call added ten kilobytes that every visitor
downloads. That's small. Some libraries add hundreds of kilobytes, so it's
worth checking before you install one.

**6. Semver.** `^8.0.0` accepts every `8.x.x`. `~8.0.0` accepts only
`8.0.x`. Neither accepts `9.0.0`. `npm outdated` lists packages with a newer
version than the one installed, and `npm ls` shows what's installed.
