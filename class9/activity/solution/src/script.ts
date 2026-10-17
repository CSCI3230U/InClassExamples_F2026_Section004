/* ===========================================================================
   script.ts: the page code, with types ("Finished early?" number 1).
   CSCI 3230U · Lecture 05b activity - solution

   The pattern is unchanged:  event → change `shelf` → render() → the page.
   =========================================================================== */

import { loadBooks, makeBook, withBook } from "./books.js";
// `import type` brings in types only. It is removed from the JavaScript.
import type { Book, Status } from "./books.js";

// Record<Status, string>: one label for every Status. Add a fourth status
// to the union and this object becomes an error until it has a label.
const STATUS_LABELS: Record<Status, string> = {
  want: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

// querySelector returns `Element | null`.
//   <HTMLFormElement>  says which kind of element we expect.
//   !                  says "this isn't null". It turns the check off, so
//                      use it only where the HTML is yours.
const form = document.querySelector<HTMLFormElement>("#add-form")!;
const list = document.querySelector<HTMLUListElement>("#book-list")!;

// Builds the card for ONE book and returns it (it isn't on the page yet).
function bookCard(book: Book): HTMLLIElement {
  const li = document.createElement("li");
  const article = document.createElement("article");
  article.classList.add("book");

  // book.cover is `string | undefined`. Inside the `if` it is a string:
  // the check narrows the type.
  if (book.cover) {
    const img = document.createElement("img");
    img.src = book.cover;
    img.alt = `Cover of ${book.title}`;
    article.append(img);
  }

  // textContent, never innerHTML: titles are typed by users (XSS).
  const title = document.createElement("h3");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.textContent = book.author;

  const status = document.createElement("p");
  status.classList.add("status");
  status.textContent = STATUS_LABELS[book.status];

  // type="button": a button's default type is "submit".
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Remove";
  button.dataset.id = book.id; // becomes data-id="..." in the HTML

  article.append(title, author, status, button);
  li.append(article);
  return li;
}

// data -> DOM: empty the list, then append a card per book.
function render() {
  list.replaceChildren();
  for (const book of shelf) {
    list.append(bookCard(book));
  }
}

list.textContent = "Loading books...";

// An empty array has no type to infer from, so this one is annotated.
let books: Book[] = [];
try {
  books = await loadBooks();
} catch (error) {
  // Anything can be thrown, so `error` is `unknown` until we check it.
  if (error instanceof Error) {
    console.error("Could not load books:", error.message);
  }
}

// The state: our own copy of the books. The page is always drawn from this.
let shelf = [...books];
render();

form.addEventListener("submit", (event) => {
  event.preventDefault(); // otherwise the browser reloads the page

  const data = new FormData(form); // reads fields by their name="..."

  // data.get() returns `FormDataEntryValue | null`: a field can be a file,
  // or missing. String() turns it into a string.
  const status = String(data.get("status"));

  // A string from outside our code isn't a Status until we check it.
  // After this line, TypeScript knows `status` is one of the three.
  if (status !== "want" && status !== "reading" && status !== "finished") {
    return;
  }

  const newBook = makeBook({
    title: String(data.get("title")),
    author: String(data.get("author")),
    status,
  });

  shelf = withBook(shelf, newBook); // change state...
  render();                         // ...then repaint
  form.reset();
});

function removeBook(id: string) {
  shelf = shelf.filter((book) => book.id !== id);
  render();
}

// render() replaces every button, but never the <ul>, so this ONE listener
// handles clicks on any current or future button.
list.addEventListener("click", (event) => {
  // event.target could be something that isn't an element, so check first.
  if (!(event.target instanceof Element)) return;

  // closest() returns a plain Element, which has no dataset.
  // <HTMLButtonElement> says what we expect to find.
  const button = event.target.closest<HTMLButtonElement>("button[data-id]");
  if (!button) return; // a click on a card, not on a button

  // dataset values are `string | undefined`.
  const id = button.dataset.id;
  if (id) removeBook(id);
});
