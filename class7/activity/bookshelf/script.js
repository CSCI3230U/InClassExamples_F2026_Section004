/* ===========================================================================
   Bookshelf: DOM & Events activity
   CSCI 3230U · Lecture 04b

   The pattern for today:  event → change `shelf` → render() → the page.
   =========================================================================== */

import { loadBooks, withBook } from "./books.js";

// The text shown for each status value.
const STATUS_LABELS = {
  want: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

// TODO: select the <form id="add-form"> into `form`
//       and the <ul id="book-list"> into `list`.

// ===========================================================================
// PART 1: build one card per book, and render them.
// ===========================================================================

// Builds the card for ONE book and returns it (it isn't on the page yet).
function bookCard(book) {
  const li = document.createElement("li");
  const article = document.createElement("article");
  article.classList.add("book");

  // Worked example: the cover, for books that have one.
  if (book.cover) {
    const img = document.createElement("img");
    img.src = book.cover;
    img.alt = `Cover of ${book.title}`;
    article.append(img);
  }

  // TODO: create and append, in this order:
  //   - an <h3> with the title
  //   - a <p> with the author
  //   - a <p class="status"> with the label from STATUS_LABELS
  // Use textContent, not innerHTML.

  // PART 3 TODO: a <button type="button"> "Remove", with data-id set to book.id

  li.append(article);
  return li;
}

// data -> DOM: empty the list, then append a card per book.
function render() {
  // TODO
}

// TODO: show "Loading books..." in the list, then load the books
// (inside try...catch, like last class).

// The state: our own copy of the books. The page is always drawn from this.
// TODO: let shelf = [...books];  then call render()

// ===========================================================================
// PART 2: add a book when the form is submitted.
// ===========================================================================

// TODO

// ===========================================================================
// PART 3: remove a book, with ONE listener on the list.
// ===========================================================================

// TODO: function removeBook(id) { ... }

// TODO: the click listener on the list
