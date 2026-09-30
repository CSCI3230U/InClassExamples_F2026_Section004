/* ===========================================================================
   books.js: loading the data, and the functions that work on it.
   CSCI 3230U · Lecture 04a activity - solution
   =========================================================================== */

import { slowFetch } from "./api.js";

// PART 1: the hard-coded array is gone. The data lives in books.json.

// PART 1 + 2: fetch, check the response, parse the JSON.
export async function loadBooks() {
  const response = await slowFetch("books.json");
  // fetch only rejects on NETWORK errors. A 404 still "succeeds",
  // so check ok ourselves.
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json(); // also a Promise: the body arrives separately
}

// PART 3: same pattern, different file.
export async function loadReviews() {
  const response = await slowFetch("reviews.json");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export const addBook = (list, book) => [...list, book];

export const sortByTitle = (list) =>
  list.toSorted((a, b) => a.title.localeCompare(b.title));
