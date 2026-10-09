import { books, makeBook, withBook, withoutBook, type Book, type Status} from './books.ts';

let shelf : Book[] = [...books];

const list = document.querySelector<HTMLUListElement>('#book-list')!;
// ! - this "could" be null, but it won't be

function bookCard(book: Book) : HTMLLIElement {
    const li = document.createElement('li');
    const article = document.createElement('article');

    const heading = document.createElement('h3');
    heading.textContent = book.title;

    const meta = document.createElement('p');
    meta.textContent = `${book.author} (${book.status})`;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.dataset.id = book.id;

    article.append(heading, meta, remove);
    li.append(article);
    return li;
}

function render() : void {
    list?.replaceChildren(); // ? handle null.functionCall() gracefully
    for (const book of shelf) {
        list?.append(bookCard(book));
    }
}

render();

const form = document.querySelector<HTMLFormElement>('#add-form')!;
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const book = makeBook({
        title: String(data.get('title')),
        author: String(data.get('author')),
        status: data.get('status') as Status,
    });
    shelf = withBook(shelf, book);
    form.reset();
    render();
});

// remove event handler
list.addEventListener('click', (event) => {
    const target = event.target as Element;
    const button = target.closest<HTMLButtonElement>('button[data-id]');
    if (!button) return;
    // fix:  I must have auto-corrected withoutBook.apply instead of withoutBook here
    shelf = withoutBook(shelf, button.dataset.id!);
    render();
});