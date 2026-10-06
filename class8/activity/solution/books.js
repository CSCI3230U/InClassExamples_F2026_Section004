/* ===========================================================================
   books.js: loading the data, and the functions that work on it.
   CSCI 3230U · Lecture 05a activity - solution

   Used by both script.js and jquery.js: the data code doesn't care how the
   page gets drawn. Nothing to change in this file today.
   =========================================================================== */

import { slowFetch } from "./api.js";

export async function loadBooks() {
  const response = await slowFetch("books.json");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// Returns a NEW array with the book added (last class's addBook, renamed).
export const withBook = (list, book) => [...list, book];
