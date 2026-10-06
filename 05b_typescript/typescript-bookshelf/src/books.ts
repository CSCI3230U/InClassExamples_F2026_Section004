export type Status = 'reading' | 'finished' | 'want';

export interface Book {
    id: string;
    title: string;
    author: string;
    status: Status;
}

export async function loadBooks(): Promise<Book[]> {
    const response = await fetch('books.json');

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    return (await response.json()) as Book[];
}

export const books: Book[] = await loadBooks();
// const b1: Book = {id: '1', title: 'title', status: 'reading'};
// const b2: Book = {id: '1', title: 'title', author: 'author', status: 'read'}

export const describe = (book: Book) : string => `${book.title} (${book.status})`;

export const makeBook = (fields: Omit<Book, 'id'>): Book => ({
    id: crypto.randomUUID(),
    ...fields,
});

export const withBook = (list: Book[], book: Book) : Book[] => [...list, book];

export const withoutBook = (list: Book[], id: string) : Book[] =>
    list.filter((book: Book) => book.id !== id);
