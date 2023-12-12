import React from 'react';
import { observer } from 'mobx-react';
import { withInjection } from '../Core/Providers/Injection';
import { BooksPresenter } from './BooksPresenter';
import { BookList } from './BookList/BookList';
import { AddBooks } from './AddBooks/AddBooks';
import { LastAddedBook } from './LastAddedBook/LastAddedBook';
import { MessagesComponent } from '../Core/Messages/MessagesComponent';

const BooksComp = observer(({ booksPresenter }) => {
    console.log('books rerendered', booksPresenter.lastAddedBook)
    return (
        <div>
            <h1>Books</h1>
            <LastAddedBook lastAddedBook={booksPresenter.lastAddedBook} />
            <br/>
            <AddBooks presenter={booksPresenter}/>
            <br/>
            <BookList />
            <br/>
            <MessagesComponent />
        </div>
    )
})

export const Books = withInjection({
    booksPresenter: BooksPresenter
})(BooksComp)