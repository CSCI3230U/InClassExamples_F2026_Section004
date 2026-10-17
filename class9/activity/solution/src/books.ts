/* ===========================================================================
   books.ts: the shape of the data, loading it, and the functions that work
   on it.
   CSCI 3230U · Lecture 05b activity - solution
   =========================================================================== */

// The import says .js: it names the file that exists after compiling,
// dist/api.js. tsc finds api.ts from it.
import { slowFetch } from "./api.js";

// ===========================================================================
// PART 1: the shape of the data.
// ===========================================================================

// A union type: a Status is one of these three strings and nothing else.
export type Status = "reading" | "finished" | "want";

// An interface: the fields every Book has, and the type of each.
export interface Book {
  id: string;
  title: string;
  author: string;
  status: Status;
  // `?` marks a field that may be missing. A book added with the form has no
  // pages (the form doesn't ask), and the fourth book in books.json has no
  // cover.
  pages?: number;
  cover?: string;
}

// Promise<Book[]>: a promise that resolves to an array of books.
// This is a claim, not a check. response.json() returns `any`, and
// TypeScript never sees books.json.
export async function loadBooks(): Promise<Book[]> {
  const response = await slowFetch("books.json");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// Returns a NEW array with the book added.
export const withBook = (list: Book[], book: Book): Book[] => [...list, book];

// ===========================================================================
// PART 2: typed functions and a generic.
// ===========================================================================

// Omit<Book, "id"> is a Book without its id. The caller gives the other
// fields, and makeBook adds the id.
export function makeBook(fields: Omit<Book, "id">): Book {
  return { id: crypto.randomUUID(), ...fields };
}

// A generic: works for an array of any type T, and remembers which one.
// `| undefined` because an empty array has no last item.
export function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}
