/* ===========================================================================
   Bookshelf: the vanilla version, now a Vite project
   CSCI 3230U · Lecture 05a activity - solution

   The pattern for today:  event → change `shelf` → render() → the page.
   =========================================================================== */

// A "bare" import: no ./ and no .js. A browser can't load this by itself.
// Vite finds the package in node_modules/ and puts it in the bundle.
import confetti from "canvas-confetti";

import { loadBooks, withBook } from "./books.js";

// The text shown for each status value.
const STATUS_LABELS = {
  want: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

// A module runs after the HTML is parsed, so both elements already exist.
const form = document.querySelector("#add-form");
const list = document.querySelector("#book-list");

// ===========================================================================
// PART 1: build one card per book, and render them.
// ===========================================================================

// Builds the card for ONE book and returns it (it isn't on the page yet).
function bookCard(book) {
  const li = document.createElement("li");
  const article = document.createElement("article");
  article.classList.add("book");

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

  // PART 3: the id goes on the button, so the list's listener knows which book.
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

// textContent on the <ul> replaces everything inside it with this text.
list.textContent = "Loading books...";

let books = [];
try {
  books = await loadBooks();
} catch (error) {
  console.error("Could not load books:", error.message);
}

// The state: our own copy of the books. The page is always drawn from this.
let shelf = [...books];
render();

// ===========================================================================
// PART 2: add a book when the form is submitted.
// ===========================================================================

// "submit" on the form, not "click" on the button: Enter and `required`
// work too.
form.addEventListener("submit", (event) => {
  event.preventDefault(); // otherwise the browser reloads the page

  const data = new FormData(form); // reads fields by their name="..."
  const newBook = {
    id: crypto.randomUUID(),
    title: data.get("title"),
    author: data.get("author"),
    status: data.get("status"),
  };

  shelf = withBook(shelf, newBook); // change state...
  render();                         // ...then repaint
  form.reset();

  // PART 3: one call into a library we installed from npm.
  if (newBook.status === "finished") {
    confetti();
  }
});

// ===========================================================================
// PART 3: remove a book, with ONE listener on the list.
// ===========================================================================

function removeBook(id) {
  shelf = shelf.filter((book) => book.id !== id);
  render();
}

// render() replaces every button, but never the <ul>, so this ONE listener
// handles clicks on any current or future button.
list.addEventListener("click", (event) => {
  // The click bubbles up from whatever was clicked. Find the button, if any.
  const button = event.target.closest("button[data-id]");
  if (!button) return; // a click on a card, not on a button
  removeBook(button.dataset.id);
});
