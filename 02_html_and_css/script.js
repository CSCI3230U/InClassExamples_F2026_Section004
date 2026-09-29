import { books, makeBook, withBook, withoutBook } from './books.js';

let shelf = [...books];

const list = document.querySelector('#book-list');

function bookCard(book) {
    const li = document.createElement('li');
    const article = document.createElement('article');

    // title
    const heading = document.createElement('h3');
    heading.textContent = book.title;   // avoid innerHTML due to XSS risk
    article.append(heading);

    // author, status
    const meta = document.createElement('p');
    meta.textContent = `${book.author} - ${book.status}`;
    article.append(meta);

    li.append(article);
    return li;
}

function render() {
    list.replaceChildren(); // clear old contents
    for (const book of shelf) {
        list.append(bookCard(book));
    }
}

render();

const form = document.querySelector('#add-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form); // <- bug here
    const book = makeBook({
        title: data.get('title'),
        author: data.get('author'),
        status: data.get('status'),
    });

    shelf = withBook(shelf, book);
    render();

    form.reset();
});