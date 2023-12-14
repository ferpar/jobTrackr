import { observer } from 'mobx-react';
import { withInjection } from '../../Core/Providers/Injection';
import { AuthorsPresenter } from '../AuthorsPresenter';

const BookListComp = observer( ({presenter}) => {
    return (
        <ul>
            {presenter.booksToAdd.map((bookName, idx) => (
                <li key={idx}>{bookName}</li>
            )
            )}
        </ul>
    )
})

export const AuthorBooksList = withInjection({
    presenter: AuthorsPresenter
})(BookListComp)