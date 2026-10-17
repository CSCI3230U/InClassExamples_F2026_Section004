# Solution: Type the bookshelf

`node_modules/` and `dist/` are not in the repository, so build before you
open the page:

```bash
npm install                    # rebuilds node_modules/ from package.json and the lock file
npm run build                  # tsc: src/*.ts → dist/*.js
python3 -m http.server 8000    # then open http://localhost:8000/
```

| File | What changed |
|---|---|
| `tsconfig.json` | new: the TypeScript configuration |
| `package.json`, `package-lock.json` | `typescript` as a dev dependency, and the `check`, `build` and `watch` scripts |
| `src/api.ts` | was `api.js`; two parameters annotated |
| `src/books.ts` | was `books.js`; `Status`, `Book`, typed functions, `makeBook`, `last` |
| `src/script.ts` | was `script.js`; this is "Finished early?" number 1 |
| `index.html`, `styles.css`, `books.json`, `covers/` | unchanged |

If you stopped at Part 3, your `script.js` is still JavaScript and your
`Book` has `pages: number`. Both are fine. See "Finished early?" number 1
for why the solution has `pages?: number`.

---

## Setup

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "allowJs": true,
    "noEmitOnError": true
  },
  "include": ["src"]
}
```

| Option | What it does |
|---|---|
| `rootDir` | where the source files are |
| `outDir` | where the compiled `.js` files go |
| `target` | which JavaScript version to write. `esnext` means the newest. |
| `module` | which module system to write. `esnext` keeps `import`/`export`. |
| `strict` | turns on the strict checks. Leave it on. |
| `allowJs` | compile `.js` files in `src/` too, without checking them |
| `noEmitOnError` | added in Part 3: write nothing if there's a type error |
| `include` | which files to compile |

| Script | Command | What it does |
|---|---|---|
| `npm run check` | `tsc --noEmit` | checks, writes nothing |
| `npm run build` | `tsc` | checks, and writes `dist/` |
| `npm run watch` | `tsc --watch` | builds again every time a file is saved |

- **TypeScript is a dev dependency.** It runs on your machine. None of it
  reaches the browser.
- **`dist/books.js` after the first build** is `src/books.js` with the
  blank lines removed and the indentation changed. There were no types to
  remove yet. `allowJs` lets a project hold `.js` and `.ts` files together,
  which is how a real project converts one file at a time.
- **The Network tab shows `dist/script.js`, `dist/books.js` and
  `dist/api.js`.** `index.html` asks for `dist/script.js`, and its imports
  are relative, so they stay in `dist/`. The browser never requests
  anything from `src/`.

---

## Warm-up

```
src/api.ts(8,16): error TS7006: Parameter 'ms' implicitly has an 'any' type.
src/api.ts(10,33): error TS7006: Parameter 'url' implicitly has an 'any' type.
```

```ts
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function slowFetch(url: string, ms = 1000) {
```

- **Reading an error:** `src/api.ts(8,16)` is the file, the line and the
  column. `TS7006` is the error's number, useful for searching.
- **The page still worked with two errors.** `tsc` reported them and wrote
  `dist/api.js` anyway. By default, a type error is a report, not a stop.
  Part 3 changes that.
- **`: number` is not in `dist/api.js`.** The types are removed when the
  file is compiled. The browser can't read them and doesn't need them.
- **The import in `books.js` still says `"./api.js"`.** That's the name of
  the file that will exist in `dist/`. `tsc` finds `api.ts` from it.
- **`ms = 1000` needs no annotation.** The default value is a number, so
  TypeScript infers `number`. This is **inference**.
- **`sleep` returns `Promise<unknown>`**, also inferred. You annotate the
  parameters, and TypeScript works out the rest.
- **"Implicitly has an `any` type"** means TypeScript couldn't work out the
  type and would have to give up on checking it. `strict` makes that an
  error.

---

## Part 1: the shape of the data

```ts
export type Status = "reading" | "finished" | "want";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: Status;
  pages: number;
  cover?: string;
}

export async function loadBooks(): Promise<Book[]> { ... }

export const withBook = (list: Book[], book: Book): Book[] => [...list, book];
```

- **`id` is a `string`.** `books.json` has `"id": "1"`, in quotes. That
  mismatch between `"1"` and `1` was the bug in classes 7 and 8.
- **`cover?: string`** because the fourth book has no cover.
- **`Status`, not `string`.** A `string` would accept any text. The union
  accepts three values.

| You changed | Message |
|---|---|
| `"want"` to `"raeding"` | `Type '"raeding"' is not assignable to type 'Status'. Did you mean '"reading"'?` |
| deleted `author` | `Property 'author' is missing in type '{ ... }' but required in type 'Book'.` |
| added `rating: 5` | `Object literal may only specify known properties, and 'rating' does not exist in type 'Book'.` |
| `412` to `"412"` | `Type 'string' is not assignable to type 'number'.` |

**The optional field.** `sample.cover.toUpperCase()` gives
`'sample.cover' is possibly 'undefined'`. The fix is the check you already
write in JavaScript:

```ts
if (sample.cover) {
  console.log(sample.cover.toUpperCase());
}
```

Inside the `if`, the type is `string`. This is **narrowing**: a check
changes the type for the lines it protects.

**Which would JavaScript have reported?** None of them. All four objects are
valid JavaScript. The misspelled status would show a blank label, the
missing author an empty line, and `"412"` would break the first sum. Each
one appears later, somewhere else, with no message pointing at the cause.

---

## Part 2: typed functions and a generic

```ts
export function makeBook(fields: Omit<Book, "id">): Book {
  return { id: crypto.randomUUID(), ...fields };
}

export function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}
```

- **`Omit<Book, "id">`** is a **utility type**: it builds a new type from
  `Book`, without `id`. If `Book` gets a new field, `fields` gets it too.
- **The return type `: Book` is a promise the checker holds you to.** If the
  body returns the wrong shape, the error is here, not at every caller.

**Why `Found 0 errors` with `pages` missing?** `script.js` is JavaScript.
`allowJs` makes `tsc` copy it into `dist/`, but it doesn't check it. Types
protect the files that have them. A typed function called from an untyped
file is unchecked at that call.

**The generic.**

- `last([1, 2, 3])` has the type `number | undefined`. `T` was filled in
  with `number`, from the argument. You didn't write `last<number>(...)`.
- `n.toFixed(2)` gives `'n' is possibly 'undefined'`: an empty array has no
  last item.
- Inside `if (n !== undefined) { ... }`, hovering shows `number`. Narrowing
  again.
- `last(["a", "b"])` gives `string | undefined`, and `.toFixed` becomes
  `Property 'toFixed' does not exist on type 'string'`. One function, and
  the type follows the data. With `any[]` in place of `T[]`, the result
  would be `any` and both mistakes would pass.

---

## Part 3: the pipeline

**The error didn't stop anything.** With `id: 42`, the watch printed

```
src/books.ts: error TS2322: Type 'number' is not assignable to type 'string'.
```

and still wrote `dist/books.js`, with `return { id: 42, ...fields };` in
it. The page loads and adds books.

**The new book can't be removed.** Its id is the number `42`. The button's
`data-id` attribute is the string `"42"`, because HTML attributes are always
strings. `removeBook` keeps every book where `book.id !== id`, and
`42 !== "42"` is `true`, so it keeps this one too. The type error was
pointing at a real bug. It's the same bug as in classes 7 and 8, found this
time before the page loaded.

**`noEmitOnError`.** With the option on, `npm run build` prints the error
and writes nothing, so there's no `dist/`. The page shows an empty shelf,
and the Console shows a 404 for `dist/script.js`. A broken build is better
than a broken site: the old version stays up, and you have a message with a
line number.

**What the browser gets.** `dist/books.js` is `src/books.ts` with the types
removed:

```js
export const withBook = (list, book) => [...list, book];

export function makeBook(fields) {
    return { id: crypto.randomUUID(), ...fields };
}

export function last(items) {
    return items[items.length - 1];
}
```

`Status` and `Book` are gone completely. The annotations, `Omit<...>` and
`<T>` are gone. The code is the same. Types are **erased**: they cost
nothing at run time, and nothing checks them at run time either.

**A teammate's three commands.**

```bash
npm install
npm run build
python3 -m http.server 8000
```

`npm install` recreates `node_modules/` from `package.json` and the lock
file. `npm run build` recreates `dist/` from `src/`. Neither folder is
committed, because both are generated from files that are.

---

## Finished early?

**1. `script.ts`.** `index.html` doesn't change because it loads
`dist/script.js`, and `tsc` writes that file from `src/script.js` or from
`src/script.ts`. The page never knew which.

| Error | Why | Fix |
|---|---|---|
| `'list' is possibly 'null'` | `querySelector` returns `null` when nothing matches | `document.querySelector<HTMLUListElement>("#book-list")!` |
| `Property 'reset' does not exist on type 'Element'` | TypeScript can't know `#add-form` is a form | `querySelector<HTMLFormElement>("#add-form")!` |
| `Parameter 'book' implicitly has an 'any' type` | parameters are never inferred | `function bookCard(book: Book)` |
| `Variable 'books' implicitly has type 'any[]'` | `[]` has nothing to infer from | `let books: Book[] = [];` |
| `'error' is of type 'unknown'` | anything can be thrown, not only an `Error` | `if (error instanceof Error)` |
| `Property 'closest' does not exist on type 'EventTarget'` | `event.target` may not be an element | `if (!(event.target instanceof Element)) return;` |

- **`!` means "trust me, this isn't `null`".** It turns the check off. Use
  it only where the HTML is yours and the element is always there.
- **`import type { Book, Status }`** imports types only. The line is removed
  from the JavaScript.

**The submit handler.** `data.get("title")` has the type
`FormDataEntryValue | null`: a form field can hold a file, or not exist.
`String(...)` converts it. The status needs more, because a `string` isn't a
`Status`:

```ts
const status = String(data.get("status"));
if (status !== "want" && status !== "reading" && status !== "finished") {
  return;
}
```

After the `if`, TypeScript knows `status` is one of the three. Values from
outside your code (a form, a `fetch`) have to be checked or converted before
they fit your types.

**The missing `pages`.** With `script.ts` checked, the call from Part 2
finally reports:

```
Property 'pages' is missing in type '{ title: string; author: string; status: ...; }'
but required in type 'Omit<Book, "id">'.
```

The form has no pages field, so a book added by the form never had `pages`.
`pages: number` was wrong from the start, and JavaScript never said so. The
solution changes the interface to `pages?: number`, because that is the
truth about the data. Adding a number field to the form would also work.

**2. `Record<Status, string>`.** After adding `"abandoned"`:

```
Property 'abandoned' is missing in type '{ want: string; reading: string; finished: string; }'
but required in type 'Record<Status, string>'.
```

You changed one type, and the checker listed the code that has to follow.
In `script.ts`, the `if` that checks the form's status needs the new value
too.

**3. Where types stop.** `npm run check` says nothing, and the page shows a
card with a blank status. TypeScript checks your code, not your data.
`loadBooks(): Promise<Book[]>` is a claim about `books.json` that nobody
tests. Data from outside needs a check at run time.

**4. `any`.** No error. At run time, `n.nope` is `undefined`, and
`undefined.nope` throws a `TypeError`. `any` means "don't check this", and
it spreads: everything computed from an `any` is also `any`.

**5. Without `strict`.** `npm run check` reports the missing annotation.
`npx tsc --noEmit --strict false` reports nothing: `ms` silently becomes
`any`. Keep `strict` on. Without it, most of today's errors disappear, and
so does the reason to use TypeScript.

**6. `target`.** In `old/books.js`:

```js
export function makeBook(fields) {
    return Object.assign({ id: crypto.randomUUID() }, fields);
}
```

Spreading an object with `...` arrived in JavaScript in 2018. Asked for
2017's JavaScript, `tsc` rewrote it with `Object.assign`, which does the
same job and is older. So `tsc` does two things to your code: it removes the
types, and it rewrites newer syntax for the `target` you choose. With
`esnext` there is nothing to rewrite.
