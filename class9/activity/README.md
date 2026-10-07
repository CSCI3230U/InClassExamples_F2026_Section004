# Activity: Type the bookshelf

**CSCI 3230U · Lecture 05b, TypeScript · ~30 minutes · work in pairs**

Practice only, nothing to hand in.

Today the only tool is the TypeScript compiler, `tsc`, so you can see every
step: you write `src/*.ts`, `tsc` writes `dist/*.js`, and the browser runs
`dist/`. You will:

1. **Describe the data with types**: a `Status` union and a `Book` interface.
2. **Type the functions**, and write one generic.
3. **Follow the pipeline**: what `tsc` writes, and what it does on an error.

The starter is last class's bookshelf **without Vite and without confetti**:

| File | What's in it |
|---|---|
| `src/api.js`, `src/books.js` | the data code. Today they become `api.ts` and `books.ts`. |
| `src/script.js` | the page code. It stays JavaScript (until "Finished early?"). |
| `index.html` | loads **`dist/script.js`**, which doesn't exist yet |
| `styles.css`, `books.json`, `covers/` | unchanged |
| `package.json`, `.gitignore` | a minimal npm project, with no packages yet |

You need **Node.js** and **VS Code**. If `node -v` says `command not found`,
pair up with someone who has Node.

---

## Setup (4 minutes)

1. Install TypeScript as a **dev** dependency:
   ```bash
   cd bookshelf
   npm install -D typescript
   ```
2. Create a file named `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "rootDir": "src",
       "outDir": "dist",
       "target": "esnext",
       "module": "esnext",
       "strict": true,
       "allowJs": true
     },
     "include": ["src"]
   }
   ```
3. In `package.json`, add a `"scripts"` section after the `"type"` line
   (put a comma after `"module"`):
   ```json
   "scripts": {
     "check": "tsc --noEmit",
     "build": "tsc",
     "watch": "tsc --watch"
   }
   ```
4. Build, then look in the new `dist/` folder:
   ```bash
   npm run build
   ```
   Open `dist/books.js` beside `src/books.js`. What did `tsc` do to a plain
   JavaScript file? (`"allowJs": true` is why it touched it at all.)
5. Serve the folder, and open **<http://localhost:8000/>** with DevTools
   open (**F12**):
   ```bash
   python3 -m http.server 8000
   ```
   Four cards, add, remove. In the **Network** tab, which folder do the
   `.js` files come from?
6. Open a **second terminal** in `bookshelf/` and leave this running:
   ```bash
   npm run watch
   ```
   It rebuilds `dist/` every time you save, and prints the errors.

---

## Warm-up: your first `.ts` file (4 minutes)

1. Rename `src/api.js` to `src/api.ts`. Don't change any `import`.
2. Look at the watch terminal. It reports two errors. Read one aloud. Which
   **file**, **line** and **column** is it about? Find the same errors as red
   underlines in VS Code.
3. Reload the page. Does it still work, with two errors?
4. Fix both by annotating the parameters: `ms` is a `number`, and `url` is a
   `string`.
   ```ts
   const sleep = (ms: number) => ...
   ```
   The watch terminal should say `Found 0 errors`.
5. Open `dist/api.js`. Where did `: number` go?

`slowFetch(url: string, ms = 1000)` has no annotation on `ms`, and there's no
error. Why not? Hover over `ms` in VS Code. Then hover over `sleep`: what
does it return? You didn't write that.

---

## Part 1: The shape of the data (8 minutes)

Rename `src/books.js` to `src/books.ts`. The watch terminal reports two
errors in this file. Leave them for step 3.

1. Open `books.json`. Under the `import` line in `books.ts`, add a union
   type for the status:
   ```ts
   export type Status = "reading" | "finished" | "want";
   ```
2. Below it, write an interface for one book. Fill in the rest from
   `books.json`. One field isn't on every book: mark it with `?`.
   ```ts
   export interface Book {
     id: string;
     title: string;
     // ...four more
   }
   ```
3. Type the two functions, until the watch terminal says `Found 0 errors`:
   - `loadBooks` returns a promise of an array of books: `Promise<Book[]>`.
   - `withBook` takes a `Book[]` and a `Book`, and returns a `Book[]`.
4. Add this line at the bottom of `books.ts`. It should have no errors:
   ```ts
   const sample: Book = { id: "9", title: "Dune", author: "Frank Herbert", status: "want", pages: 412 };
   ```
5. Now break it, **one change at a time**. Read each message, then undo:
   - change `"want"` to `"raeding"`
   - delete the `author`
   - add `rating: 5`
   - change `412` to `"412"`
6. Add a second line: `console.log(sample.cover.toUpperCase());`
   What's the error? Fix it without changing the interface.
7. Delete both lines.

Which of the four mistakes in step 5 would plain JavaScript have reported?
When?

---

## Part 2: Typed functions and a generic (8 minutes)

1. In `books.ts`, add `makeBook`. It takes a book **without** its id, and
   returns a full `Book`:
   ```ts
   export function makeBook(fields: Omit<Book, "id">): Book {
     return { id: crypto.randomUUID(), ...fields };
   }
   ```
   Hover over `fields`. Which fields does it have?
2. Use it. In `src/script.js`, add `makeBook` to the `import` from
   `"./books.js"`, and replace the `newBook = { ... }` object:
   ```js
   const newBook = makeBook({
     title: data.get("title"),
     author: data.get("author"),
     status: data.get("status"),
   });
   ```
   Reload, and add a book. It still works.
3. Look at that call again. `makeBook` needs `pages`, and you didn't pass
   it. The watch terminal says `Found 0 errors`. Why?
4. Back in `books.ts`, add a generic function:
   ```ts
   export function last<T>(items: T[]): T | undefined {
     return items[items.length - 1];
   }
   ```
5. Try it with two lines at the bottom of the file:
   ```ts
   const n = last([1, 2, 3]);
   console.log(n.toFixed(2));
   ```
   Hover over `n`. What is its type? What's the error on the second line?
6. Fix it with an `if`, then hover over `n` **inside** the `if`. What changed?
7. Change the first line to `last(["a", "b"])`. What's the type of `n` now?
   What happened to `.toFixed`? Delete your test lines.

---

## Part 3: The pipeline (6 minutes)

1. Put a type error in `makeBook`: change `crypto.randomUUID()` to `42`, and
   save. The watch terminal reports it. Now reload the page and add a book.
   Does it work? Open `dist/books.js` and find the `42`.
2. Try to **remove** the book you just added. What happens? Why? (Look at
   `removeBook` in `script.js`, and think about `data-id`.)
3. Stop the watch (**Ctrl+C**). In `tsconfig.json`, add one option after
   `"allowJs": true` (with a comma between them):
   ```json
   "noEmitOnError": true
   ```
   Then delete the old output and build:
   ```bash
   rm -r dist
   npm run build
   ```
   Is there a `dist/` folder? Reload the page. What does the Console say?
4. Fix `makeBook`, run `npm run build` again, and reload.
5. Open `dist/books.js` beside `src/books.ts`. What's gone? What's the same?
   Can you find `Status` or `Book` anywhere in `dist/`?

`.gitignore` lists `node_modules/` and `dist/`, so neither is committed. A
teammate clones this project. Which commands do they run before the page
works?

---

## Done?

- `src/api.ts` and `src/books.ts` exist; `src/api.js` and `src/books.js`
  don't.
- `books.ts` exports `Status`, `Book`, `loadBooks`, `withBook`, `makeBook`
  and `last`.
- `npm run check` prints no errors.
- `script.js` builds new books with `makeBook`.
- `tsconfig.json` has `"noEmitOnError": true`, and `npm run build` writes
  nothing when there's a type error.
- The page shows four cards, and add and remove still work.

---

## If you get stuck

- **An empty shelf, and `GET /dist/script.js 404` in the Console?** There's
  no `dist/` yet. Run `npm run build`.
- **Your change doesn't show in the page?** The browser runs `dist/`, not
  `src/`. Check that the watch is still running and reports 0 errors, then
  reload. A hard reload (**Ctrl+Shift+R**) skips the cache.
- **`tsc: command not found`?** Use `npm run build` or `npx tsc`, not `tsc`
  alone. TypeScript is installed in this project, not on the whole machine.
- **`npm error Missing script: "watch"`?** The `"scripts"` section wasn't
  saved, or you're not inside `bookshelf/`.
- **`npm error ... JSON.parse`?** `package.json` and `tsconfig.json` are
  strict JSON: double quotes, a comma between entries, none after the last.
- **`No inputs were found in config file`?** Check that `"include"` in
  `tsconfig.json` says `["src"]`.
- **`tsc` prints a long help text?** It found no `tsconfig.json`. The file
  must be in `bookshelf/`, next to `package.json`.
- **`Parameter 'x' implicitly has an 'any' type`?** The parameter needs an
  annotation: `(x: string)`.
- **`Cannot find name 'Book'`?** The interface is missing or misspelled.
  Names are case-sensitive: `Book`, not `book`.
- **No red underlines in VS Code?** Check the file ends in `.ts`, and that
  you opened the `bookshelf/` folder, not a single file.
- **`Failed to load module script` or a CORS error?** You opened
  `index.html` by double-clicking it. Use the `http://localhost:8000` URL.
- **`Address already in use`?** Another server is on port 8000. Use
  `python3 -m http.server 8001`.

---

## Finished early?

1. **Type the page code.** Rename `src/script.js` to `src/script.ts`.
   `index.html` doesn't change: why not? `npm run check` reports about 19
   errors, in five groups. Fix one group at a time:

   | Error | Fix |
   |---|---|
   | `'list' is possibly 'null'`, `Property 'reset' does not exist on type 'Element'` | `document.querySelector<HTMLFormElement>("#add-form")!` and `<HTMLUListElement>` for the list |
   | `Parameter 'book' implicitly has an 'any' type` | `import type { Book } from "./books.js";` then annotate |
   | `Variable 'books' implicitly has type 'any[]'` | `let books: Book[] = [];` |
   | `'error' is of type 'unknown'` | `if (error instanceof Error) { ... }` |
   | `Property 'closest' does not exist on type 'EventTarget'` | `if (!(event.target instanceof Element)) return;` |

   Two are left, both in the submit handler. `data.get("title")` isn't a
   `string`: what is it? And once that's fixed, TypeScript finally reports
   the missing `pages` from Part 2. Should you change the form, or the
   interface?
2. **Let the type find the work.** Move `STATUS_LABELS` into `books.ts` and
   type it as `Record<Status, string>`. Then add `"abandoned"` to the
   `Status` union. What does the compiler tell you to do next?
3. **Where types stop.** In `books.json`, change a status to `"raeding"`.
   Run `npm run check`, then reload the page. Who caught it? Change it back.
4. **`any` turns the checker off.** At the bottom of `books.ts`:
   ```ts
   const n: any = last([1, 2, 3]);
   console.log(n.nope.nope);
   ```
   Does `npm run check` complain? What would happen when this line runs?
   Delete it.
5. **Without `strict`.** Remove the `: number` from `sleep` in `api.ts`. Run
   `npm run check`, then `npx tsc --noEmit --strict false`. Which one would
   you want on a team project? Put the annotation back.
6. **What `target` does.** Compile for 2017's JavaScript into a separate
   folder:
   ```bash
   npx tsc --target es2017 --outDir old
   ```
   Compare `makeBook` in `old/books.js` with the one in `dist/books.js`.
   What happened to `...fields`? Then `rm -r old`.

The finished version, with every change explained, is posted in `solution/`
after class.
