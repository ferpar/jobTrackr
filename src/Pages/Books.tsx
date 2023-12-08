import React from 'react';
import { observer } from 'mobx-react';
import { withInjection } from '../Core/Providers/Injection';
import { BooksPresenter } from '../Books/BooksPresenter';

const BooksComp = observer(({ booksPresenter }) => {
    return (
        <div>
            <h1>Books</h1>
            <ul>
                {/* {booksPresenter.viewModel.books.map((book) => (
                    <li key={book.id}>{book.name}</li>
                ))} */}
            </ul>
        </div>
    )
})

export const Books = withInjection({
    booksPresenter: BooksPresenter
})(BooksComp)