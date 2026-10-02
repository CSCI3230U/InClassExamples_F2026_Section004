// modify to load books from local Storage, if present
export const books = /*JSON.parse(localStorage.getItem('books')) ??*/ [
    {title: 'The Pragmatic Programmer', status: 'finished'},
    {title: 'Eloquent Javascript', status: 'reading'},
];
localStorage.setItem('books', books);

export const tags = [
    'HTML',
    'CSS',
    'JavaScript'
];

// asynchronous code

console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');

// fetch()

// const promise = fetch('http://localhost:8000/books.json');
// console.log(promise); // Promise { <pending> }
// promise
//     .then((response) => response.json())
//     .then((books) => console.log(books))
//     .catch((error) => console.error(error));

//fetch('http://localhost:8000/books.json')
fetch('books.json')
    .then((response) => response.json())
    .then((books) => console.log(books))
    .catch((error) => console.error(error));

export async function loadBooks() {
    try {
        const response = await fetch('books.json');
        if (!response.ok) {
            throw new Error(`HTTP: ${response.status}`);
        }
        const books = await response.json();
        return books;
    } catch (error) {
        console.error('Failed to load:', error);
        return [];
    }
}


