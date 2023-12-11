import React from 'react';
import { observer } from 'mobx-react';
import { withInjection } from '../Core/Providers/Injection';
import { BooksPresenter } from './BooksPresenter';
import { BookList } from './BookList/BookList';
import { AddBooks } from './AddBooks/AddBooks';
import { LastAddedBook } from './LastAddedBook/LastAddedBook';

const BooksComp = observer(({ booksPresenter }) => {
    return (
        <div>
            <h1>Books</h1>
            <LastAddedBook lastAddedBook={booksPresenter.lastAddedBook} />
            <AddBooks />
            <p>{booksPresenter.messagePm}</p>
            <BookList />
        </div>
    )
})

export const Books = withInjection({
    booksPresenter: BooksPresenter
})(BooksComp)