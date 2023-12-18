import { observer } from 'mobx-react';
import { withInjection } from '../../Core/Providers/withInjection';
import { BookListPresenter } from './BookListPresenter';

const BookListComp = observer( ({presenter}) => {
    return (
        <ul>
            {presenter.viewModel.map((book, idx) => (
                <li key={idx}>{book.name}</li>
            )
            )}
        </ul>
    )
})

export const BookList = withInjection({
    presenter: BookListPresenter
})(BookListComp)