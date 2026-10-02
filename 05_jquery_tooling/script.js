const books = [
    {
        "id": "1",
        "title": "The Pragmatic Programmer", 
        "author": "PP Author",
        "status": "finished"
    },
    {
        "id": "2",
        "title": "Eloquent Javascript", 
        "author": "EJ Author",
        "status": "reading"
    }
];

function render() {
    const list = $('#book-list').empty();

    for (const book of books) {
        $('<li>').append($('<article>'))
            .append($('<h3>').text(book.title))
            .append($('<p>').text(`${book.author} - ${book.status}`))
            .append($('<button>').text('Remove').attr('data-id', book.id))
            .appendTo(list);
    }
}

$('#book-list').on('click', 'button[data-id]', () => {
    const id = $(this).attr('data-id');
    books.splice(books.findIndex((book) => book.id === id), 1);
    render();
});

render();