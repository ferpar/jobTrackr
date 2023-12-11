import React from 'react';
import { observer } from 'mobx-react';
import { withInjection } from '../../Core/Providers/Injection';
import { BookListPresenter } from './BookListPresenter';

const BookListComp = observer( ({presenter}) => {
    return (
        <ul>
            {presenter.viewModel.map((book) => (
                <li key={book.id}>{book.name}</li>
            )
            )}
        </ul>
    )
})

export const BookList = withInjection({
    presenter: BookListPresenter
})(BookListComp)