/* ===========================================================================
   Bookshelf: Asynchronous JavaScript activity - solution
   CSCI 3230U · Lecture 04a

   Loaded with <script type="module">, so it needs a server, and `await`
   works at the top level of this file.
   =========================================================================== */

import { loadBooks, loadReviews, addBook, sortByTitle } from "./books.js";

// ===========================================================================
// PART 1-3: load books and reviews at the same time, and survive failure.
// ===========================================================================

console.log("Loading books...");
console.time("load");

// `let` with empty defaults: if loading fails, the code below still runs.
let books = [];
let reviews = [];

try {
  // Both requests start now, then we wait once: ~1 s instead of ~2 s.
  [books, reviews] = await Promise.all([loadBooks(), loadReviews()]);
  console.log(`Loaded ${books.length} books and ${reviews.length} reviews`);
} catch (error) {
  console.error("Could not load the shelf:", error.message);
}

console.timeEnd("load");

// ===========================================================================
// From last class, unchanged. Same output as before.
// ===========================================================================

const titles = books.map((book) => book.title);
console.log("titles:", titles);

const reading = books.filter((book) => book.status === "reading");
console.log("reading:", reading.length, "books");

const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
console.log("total pages:", totalPages);

const summary = books
  .filter((book) => book.status === "reading")
  .map((book) => book.title)
  .join(", ");
console.log("Currently reading: " + summary);

const bigger = addBook(books, { title: "Refactoring", author: "Martin Fowler", status: "want", pages: 448 });
console.log(`addBook     → new: ${bigger.length} books, original: ${books.length} books`);

const sorted = sortByTitle(books);
console.log(`sortByTitle → new: ${sorted[0]?.title}, original: ${books[0]?.title}`);

// ===========================================================================
// PART 3: average rating per book.
// ===========================================================================

for (const book of books) {
  const bookReviews = reviews.filter((review) => review.title === book.title);
  const total = bookReviews.reduce((sum, review) => sum + review.rating, 0);
  const average = bookReviews.length ? total / bookReviews.length : 0;
  console.log(`${book.title}: ${average} / 5 (${bookReviews.length} reviews)`);
}
