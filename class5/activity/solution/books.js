/* ===========================================================================
   books.js: the data and the functions that work on it.
   Nothing in here prints anything or changes what it was given.
   CSCI 3230U · Lecture 03b activity - solution
   =========================================================================== */

export const books = [
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", status: "reading", pages: 352 },
  { title: "Don't Make Me Think", author: "Steve Krug", status: "finished", pages: 216 },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", status: "want", pages: 472 },
  { title: "You Don't Know JS Yet", author: "Kyle Simpson", status: "reading", pages: 143 },
];

// FIX: spread the old books into a NEW array, then add one more.
export const addBook = (list, book) => [...list, book];

// FIX: sort() sorts IN PLACE and returns the same array.
// toSorted() returns a sorted copy. ([...list].sort(...) also works.)
export const sortByTitle = (list) =>
  list.toSorted((a, b) => a.title.localeCompare(b.title));
