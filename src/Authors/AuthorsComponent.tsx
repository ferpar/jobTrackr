import React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { AuthorList } from './AuthorList/AuthorList'
import { AddAuthor } from './AddAuthor/AddAuthor'
import { AddBooks } from '../Books/AddBooks/AddBooks'
// import { BookList } from '../Books/BookList/BookList'
import { AuthorBooksList } from './AuthorBooksList/AuthorBooksList'
import { AuthorsPresenter } from './AuthorsPresenter'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'

const AuthorsComp = observer( (props) => {

    React.useEffect(() => {
        async function load() {
            await props.presenter.load()
        }
        load()
    }, [])

    return (
        <>
        <h1>Authors</h1>
        <input value="show author list" type="button" onClick={props.presenter.toggleShowBooks}/>
        <br />
        <AuthorList />
        <br />
        <AddAuthor />
        <br />
        <AddBooks presenter={props.presenter}/>
        <br />
        <AuthorBooksList />
        <br />
        <MessagesComponent />
        </>
    )
})

export const Authors = withInjection({
    presenter: AuthorsPresenter
})(AuthorsComp)