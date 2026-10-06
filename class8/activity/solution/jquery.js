/* ===========================================================================
   Bookshelf: the jQuery version
   CSCI 3230U · Lecture 05a activity - solution

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

  // .text(), never an HTML string: titles are typed by users (XSS).
  // .append() takes several elements, like the native append.
  $article.append(
    $("<h3>").text(book.title),
    $("<p>").text(book.author),
    $("<p>").addClass("status").text(STATUS_LABELS[book.status]),
  );

  // The Remove button, with data-id="...".
  $("<button>")
    .attr({ type: "button", "data-id": book.id })
    .text("Remove")
    .appendTo($article);

  return $li.append($article);
}

// data -> DOM: empty the list, then append a card per book.
function render() {
  // .append() also takes an array of elements, so no loop is needed.
  $list.empty().append(shelf.map(bookCard));
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

// Add a book. Only the first line differs from script.js.
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

// Delegation: ONE listener on the list, run only for clicks inside a
// matching button. jQuery sets `this` to that button, so this must be a
// `function`, not an arrow.
$list.on("click", "button[data-id]", function () {
  // The slides remove the <li> here: $(this).closest("li").remove();
  // That changes the page but not `shelf`, so the book comes back on the
  // next render(). Change the state instead, like script.js does.

  // .attr(), not .data(): .data("id") turns "1" into the number 1, and
  // 1 !== "1", so removeBook would never find the book.
  removeBook($(this).attr("data-id"));
});
