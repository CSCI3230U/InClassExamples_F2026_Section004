# Practice Midterm - Part A: Short questions

30 questions, 1 mark each. Aim for **about 25 minutes**. Unless a question
says *Select all that apply*, exactly one answer is correct.

Answers and explanations are in [`solution/part-a-answers.md`](solution/part-a-answers.md).
Try every question first.

---

## 01a The web & HTTP

**A1.** A login form uses `method="get"`. What is the main problem?

- a) GET requests can't carry form data.
- b) The password ends up in the URL, so it is saved in the browser history and server logs.
- c) The server can't read GET requests over HTTPS.
- d) Nothing - GET and POST are interchangeable for forms.

**A2.** Which statements about HTTP status codes are true? *Select all that apply.*

- a) `201 Created` is a typical answer to a POST that created something.
- b) `401 Unauthorized` usually means the request has no valid login.
- c) `403 Forbidden` means the server is down.
- d) `3xx` codes are redirects.
- e) `404 Not Found` means the server crashed.

---

## 01b HTML & CSS

**A3.** A button shows only a trash-can icon. Which version gives it an accessible name?

- a) `<button><span title="Delete">🗑</span></button>`
- b) `<button aria-label="Delete">🗑</button>`
- c) `<button alt="Delete">🗑</button>`
- d) `<button name="delete">🗑</button>`

**A4.** What colour is the text "Read"?

```html
<ul id="list"><li class="card done">Read</li></ul>
```

```css
#list li { color: blue; }
.card.done { color: green; }
li.card.done { color: red; }
```

- a) Blue
- b) Green
- c) Red
- d) Black - the rules conflict.

**A5.** The root font size is 16px. What are the padding and the margin of the `<p>`?

```css
.card { font-size: 20px; }
.card p { padding: 1em; margin: 1rem; }
```

- a) padding 16px, margin 16px
- b) padding 20px, margin 16px
- c) padding 16px, margin 20px
- d) padding 20px, margin 20px

**A6.** The box sits inside a container whose content area is 400px wide. How
wide is the box from its left border to its right border (inclusive)?

```css
.box {
  box-sizing: content-box;
  width: 50%;
  padding: 10px;
  border: 2px solid black;
}
```

- a) 200px
- b) 220px
- c) 224px
- d) 244px

---

## 02b Responsive design & CSS frameworks

**A7.** How many columns does `.grid` have when the viewport is 70rem wide?

```css
.grid { display: grid; grid-template-columns: 1fr; }

@media (min-width: 64rem) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 40rem) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
```

- a) 1
- b) 2
- c) 3
- d) 5

**A8.** A page has no `<meta name="viewport" ...>` tag. What happens on a phone?

- a) Nothing - the tag only matters on desktops.
- b) The phone lays the page out as if it were about 980px wide and shrinks it, so the `min-width` media queries match as if on a desktop.
- c) The page won't load.
- d) The browser ignores every media query.

**A9.** A grid container's content area is 900px wide and has no gap. How wide is the middle column?

```css
grid-template-columns: 300px 1fr 2fr;
```

- a) 300px
- b) 200px
- c) 400px
- d) 1/3 of 900px

---

## 03a JavaScript fundamentals

**A10.** What does this print?

```js
const book = { title: "Dune" };
const copy = book;
copy.title = "Emma";
console.log(book.title);
```

- a) `Dune`
- b) `Emma`
- c) It throws - `book` is `const`.
- d) `undefined`

**A11.** Which of these values are falsy? *Select all that apply.*

- a) `0`
- b) `""`
- c) `"0"`
- d) `[]`
- e) `null`

**A12.** What does `"3" + 4 * 2` evaluate to?

- a) `11`
- b) `14`
- c) `"38"`
- d) `"342"`

---

## 03b Functional patterns & modules

**A13.** What happens here?

```js
const total = [].reduce((sum, n) => sum + n);
```

- a) `total` is `0`.
- b) `total` is `undefined`.
- c) It throws a TypeError, because an empty array with no initial value has nothing to start from.
- d) `total` is `NaN`.

**A14.** Which of these functions are pure (they don't change their arguments)? *Select all that apply.*

- a) `(list, x) => [...list, x]`
- b) `(list) => list.sort()`
- c) `(book) => ({ ...book, read: true })`
- d) `(book) => { book.read = true; return book; }`
- e) `(list) => list.map((b) => ({ ...b, read: true }))`

**A15.** What does this print?

```js
const a = [{ n: 1 }];
const b = [...a];
b[0].n = 2;
console.log(a[0].n);
```

- a) `1` - `b` is a copy.
- b) `2` - the spread copies the array, but both arrays hold the same object.
- c) `undefined`
- d) It throws an error.

---

## 04a Asynchronous JavaScript

**A16.** What does this print?

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

- a) 1 2 3 4
- b) 1 4 2 3
- c) 1 4 3 2
- d) 1 3 4 2

**A17.** `books.json` holds an array of 6 books. What does this log?

```js
async function load() {
  const response = await fetch("books.json");
  const books = response.json();
  console.log(books.length);
}
```

- a) `6`
- b) `undefined` - `books` is a Promise, which has no `length`.
- c) `0`
- d) It throws a SyntaxError.

**A18.** In which case does `await fetch(url)` itself reject (throw)?

- a) The server answers `404 Not Found`.
- b) The server answers `500 Internal Server Error`.
- c) The server isn't running, so no response arrives at all.
- d) The response body isn't valid JSON.

---

## 04b The DOM & events

**A19.** A click listener is on the `<ul>`. The user clicks the `<span>` inside a `<button>` inside an `<li>`. What are `event.target` and `event.currentTarget`?

- a) target: the `<button>`, currentTarget: the `<ul>`
- b) target: the `<span>`, currentTarget: the `<ul>`
- c) target: the `<ul>`, currentTarget: the `<span>`
- d) both are the `<span>`

**A20.** How do you read `<button data-book-id="7">` in JavaScript?

- a) `button.dataset.book-id`
- b) `button.dataset["book-id"]`
- c) `button.dataset.bookId`
- d) `button.data.bookId`

**A21.** `<script src="app.js"></script>` is in the `<head>` (no `defer`, not a module). The first line of `app.js` is `document.querySelector("#list").append(li)`, and it throws "Cannot read properties of null". Why?

- a) `querySelector` needs `#list` without the `#`.
- b) The script runs before the browser has parsed the `<body>`, so `#list` doesn't exist yet.
- c) `append` only works on `<div>` elements.
- d) Scripts in the `<head>` can't use the DOM at all.

---

## 05a Libraries & tooling

**A22.** `package.json` lists `"date-fns": "~3.4.2"`. Which version may npm install?

- a) 3.4.9
- b) 3.5.0
- c) 4.0.0
- d) 3.3.9

**A23.** Which statements are true? *Select all that apply.*

- a) Vite belongs in `devDependencies`, because it's only needed to build the site, not to run it in the browser.
- b) `npm ci` installs the exact versions recorded in `package-lock.json`.
- c) In a Vite project, `npm run build` writes the files to deploy into `dist/`.
- d) A browser can run `import { marked } from "marked"` from a plain `.js` file with no bundler and no import map.

---

## 05b TypeScript

**A24.** What does TypeScript report?

```ts
function label(x: string | number) {
  return x.toUpperCase();
}
```

- a) Nothing - `x` might be a string.
- b) An error: `toUpperCase` doesn't exist on type `number`, so you must narrow `x` first (e.g. `typeof x === "string"`).
- c) Nothing at compile time; it throws when called with a number.
- d) An error: functions can't take union types.

**A25.** `interface Book { title: string; cover?: string; }`. What is the type of `book.cover`?

- a) `string`
- b) `string | undefined`
- c) `any`
- d) `string | null`

**A26.** `books.json` has `"pages": "300"` (a string), but the code says:

```ts
interface Book { title: string; pages: number; }
const books = (await response.json()) as Book[];
```

What happens?

- a) TypeScript reports an error because `pages` is a string.
- b) The browser converts `"300"` to `300`.
- c) Nothing catches it - `as` only tells the compiler what to assume; it doesn't check the data when the code runs.
- d) `response.json()` throws.

---

## 06a Web security

**A27.** Which change removes the XSS risk in this code?

```js
li.innerHTML = `<img src="${book.cover}" alt="">`;
```

- a) Put the `<img>` in single quotes instead of double quotes.
- b) Build it with `const img = document.createElement("img"); img.src = book.cover; img.alt = "";` and append it.
- c) Serve the page over HTTPS.
- d) Add `required` to the cover input in the form.

**A28.** Which URL has the **same origin** as `https://app.example.com/books`?

- a) `http://app.example.com/books`
- b) `https://api.example.com/books`
- c) `https://app.example.com:443/login`
- d) `https://app.example.com:8443/books`

**A29.** The session cookie is `HttpOnly; Secure; SameSite=Lax`. An attacker still finds an XSS bug in the site. What can the injected script do?

- a) Nothing - the cookie flags block all attacks.
- b) Read the cookie with `document.cookie`.
- c) It can't read the cookie, but it can still send requests to the site from the page (the browser attaches the cookie), acting as the user.
- d) Only change the page's CSS.

**A30.** Only a book's owner may delete it. The front end hides the Delete button for everyone else. Where must the "is this the owner?" check live?

- a) Nowhere else - hiding the button is enough.
- b) In the CSS, with `display: none`.
- c) On the server, when it handles the delete request.
- d) In `localStorage`.
