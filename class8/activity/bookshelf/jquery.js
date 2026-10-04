/* ===========================================================================
   Bookshelf: the jQuery version
   CSCI 3230U · Lecture 05a activity

   The same app as script.js, with the DOM work done through jQuery's $.
   The state (`shelf`) and the pattern don't change:
       event → change `shelf` → render() → the page.

   `$` is a global. It comes from the <script> tag in jquery.html, not from
   an import.
   =========================================================================== */

import { loadBooks, withBook } from "./books.js";

// The text shown for each status value.
const STATUS_LABELS = {
  want: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

// $(selector) returns a jQuery object wrapping every match. The $ at the
// start of a name is only a habit: it marks "this holds a jQuery object".
const $form = $("#add-form");
const $list = $("#book-list");

// ===========================================================================
// PART 1: translate the DOM work from script.js.
// ===========================================================================

// Builds the card for ONE book and returns it (it isn't on the page yet).
function bookCard(book) {
  const $li = $("<li>"); // $("<tag>") creates an element
  const $article = $("<article>").addClass("book");

  // Worked example: the cover. Compare with the same lines in script.js.
  if (book.cover) {
    $("<img>")
      .attr({ src: book.cover, alt: `Cover of ${book.title}` })
      .appendTo($article);
  }

  // TODO 1: create and append to $article, in this order:
  //   - an <h3> with the title
  //   - a <p> with the author
  //   - a <p class="status"> with the label from STATUS_LABELS
  // Use .text(), which is jQuery's textContent.

  // Done for you: the Remove button, with data-id="...".
  $("<button>")
    .attr({ type: "button", "data-id": book.id })
    .text("Remove")
    .appendTo($article);

  return $li.append($article);
}

// data -> DOM: empty the list, then append a card per book.
function render() {
  // TODO 2: two lines in script.js. Look up .empty() and .append().
}

$list.text("Loading books...");

let books = [];
try {
  books = await loadBooks();
} catch (error) {
  console.error("Could not load books:", error.message);
}

// The state: our own copy of the books. The page is always drawn from this.
let shelf = [...books];
render();

// Done for you: add a book. Only the first line differs from script.js.
$form.on("submit", (event) => {
  event.preventDefault();

  const data = new FormData($form[0]); // [0] is the real <form> element
  const newBook = {
    id: crypto.randomUUID(),
    title: data.get("title"),
    author: data.get("author"),
    status: data.get("status"),
  };

  shelf = withBook(shelf, newBook);
  render();
  $form[0].reset();
});

function removeBook(id) {
  shelf = shelf.filter((book) => book.id !== id);
  render();
}

// TODO 3: remove a book. Start with the version from the slides:
//
//   $list.on("click", "button[data-id]", function () {
//     $(this).closest("li").remove();
//   });
//
// Then follow the README: it has a bug.
