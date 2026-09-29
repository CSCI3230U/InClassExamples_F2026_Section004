const accent = '#b8431d';
// accent = 'blue';

let count = 0;
count++;

{
    let scoped = 'Only seen in this block';
}

console.log('Hello!');
// console.log(`The value of scoped: ${scoped}`);

function describe(book) {
    return `${book.title} (${book.status})`;
}

const addBook = (title, author, status = 'want') => {
    return { title, author, status };
};

console.log(describe({title: 'Eloquent Javascript', status: 'reading'}));
console.log(addBook("You Don't Know JS", "Kyle Simpson"));

// import 'books'
import { books, tags, loadBooks } from './books.js';
import { loadTags } from './tags.js';

console.log(`Books: ${books}`);
console.log(`Tags: ${tags}`);

function countByStatus(status) {
    let count = 0;
    for (const book of books) {
        if (book.status === status) {
            count++;
        }
    }
    return count;
}

console.log(countByStatus('reading'));

for (const book of books) {
    console.log(describe(book));
}
console.log(`On our shelf: ${books.length} books.`);

// map
function get_title(book) {
    return book.title;
}
// const book_titles = books.map(get_title);
const book_titles = books.map( (book) => book.title );
console.log(book_titles);

// filter
const reading = books.filter( (book) => book.status === 'reading' );
console.log(reading);

// reduce
const counts = books.reduce( (accumulator, book) => {
    accumulator[book.status] = (accumulator[book.status] ?? 0) + 1;
    return accumulator;
}, {} );
console.log(counts);

// method chaining
const summary = books 
    .filter((book) => book.status === 'reading')
    .map((book) => book.title)
    .join(', ');
console.log(summary);

// mutable
// books.push({title: 'Refactoring', status: 'want'});

// immutable
const added = [...books, {title: 'Refactoring', status: 'want'}];

console.log(books);
console.log(added);


// console.log(await loadBooks());
// console.log(await loadTags());

// const [ books, tags ] = await Promise.all([loadBooks(), loadTags()]);
// console.log(books);
// console.log(tags);

// DOM manipulation

const h1 = document.querySelector('h1');
console.log(h1.textContent);
h1.textContent = 'My Reading List';

// don't use innerHTML due to XSS
// h1.innerHTML = '<script>alert(1)</script>';
