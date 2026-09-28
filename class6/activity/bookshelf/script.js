/* ===========================================================================
   Bookshelf: Asynchronous JavaScript activity
   CSCI 3230U · Lecture 04a

   Loaded with <script type="module">, so it needs a server, and `await`
   works at the top level of this file.
   =========================================================================== */

import { books, addBook, sortByTitle } from "./books.js";

// ===========================================================================
// PART 1: load the books from books.json.
//   - import loadBooks instead of books
//   - print "Loading books..." first
//   - get the books with loadBooks(), then print "Loaded N books"
// PART 2: wrap the loading in try...catch.
// PART 3: load books and reviews at the same time with Promise.all.
// ===========================================================================

// TODO

// ===========================================================================
// Everything below is from last class. It should print the same thing
// once the books come from books.json.
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
// `?.` gives undefined instead of crashing when the list is empty (Part 2).
console.log(`sortByTitle → new: ${sorted[0]?.title}, original: ${books[0]?.title}`);

// ===========================================================================
// PART 3: print the average rating of each book, for example
//   The Pragmatic Programmer: 4.5 / 5 (2 reviews)
// Use filter and reduce from last class.
// ===========================================================================

// TODO
