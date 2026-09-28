/* ===========================================================================
   books.js: the data and the functions that work on it.
   CSCI 3230U · Lecture 04a activity

   The books are still hard-coded below. The same data is now also in
   books.json, and today you load it from there instead.
   =========================================================================== */

import { slowFetch } from "./api.js";

// PART 1: delete this array once loadBooks works.
export const books = [
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", status: "reading", pages: 352 },
  { title: "Don't Make Me Think", author: "Steve Krug", status: "finished", pages: 216 },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", status: "want", pages: 472 },
  { title: "You Don't Know JS Yet", author: "Kyle Simpson", status: "reading", pages: 143 },
];

// PART 1: load books.json with slowFetch and return the array of books.
// PART 2: if the response is not ok, throw an Error.
export async function loadBooks() {
  // TODO
}

// PART 3: same as loadBooks, for reviews.json.
export async function loadReviews() {
  // TODO
}

export const addBook = (list, book) => [...list, book];

export const sortByTitle = (list) =>
  list.toSorted((a, b) => a.title.localeCompare(b.title));
