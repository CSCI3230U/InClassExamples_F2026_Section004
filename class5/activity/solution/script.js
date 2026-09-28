/* ===========================================================================
   Bookshelf: Functional Patterns activity - solution
   CSCI 3230U · Lecture 03b

   script.js imports the data and functions from books.js and does all the
   printing. Loaded with <script type="module">, so it needs a server.
   =========================================================================== */

import { books, addBook, sortByTitle } from "./books.js";

// ===========================================================================
// PART 1: same output as the loops, one method (or one chain) each.
// ===========================================================================

// REFACTOR 1: map. One title per book.
const titles = books.map((book) => book.title);
console.log("titles:", titles);

// REFACTOR 2: filter. Keep the books whose test is true.
const reading = books.filter((book) => book.status === "reading");
console.log("reading:", reading.length, "books");

// REFACTOR 3: reduce. Start at 0, add each book's pages.
const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
console.log("total pages:", totalPages);

// REFACTOR 4: a chain. join puts ", " only BETWEEN titles, so the
// "is this the first one?" check disappears.
const summary = books
  .filter((book) => book.status === "reading")
  .map((book) => book.title)
  .join(", ");
console.log("Currently reading: " + summary);

// ===========================================================================
// PART 2: the checks. The fixed functions now live in books.js.
// ===========================================================================
const bigger = addBook(books, { title: "Refactoring", author: "Martin Fowler", status: "want", pages: 448 });
console.log(`addBook     → new: ${bigger.length} books, original: ${books.length} books`);

const sorted = sortByTitle(books);
console.log(`sortByTitle → new: ${sorted[0].title}, original: ${books[0].title}`);
