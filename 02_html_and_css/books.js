export async function loadBooks() {
    const response = await fetch('books.json');

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    return response.json();
}

export const books = await loadBooks();

// book list modification

// immutable add
export const makeBook = (fields) => ({id: crypto.randomUUID(), ...fields});
export const withBook = (list, book) => [...list, book];

// immutable remove
export const withoutBook = (list, id) => list.filter((book) => book.id !== id);
