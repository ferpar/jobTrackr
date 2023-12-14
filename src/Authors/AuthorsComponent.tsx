import React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { AuthorList } from './AuthorList/AuthorList'
// import { AddAuthorComponent } from './AddAuthorComponent'
// import { AddBooks } from '../Books/AddBooks/AddBooks'
// import { BookList } from '../Books/BookList/BookList'
import { AuthorsPresenter } from './AuthorsPresenter'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
// import { useValidation } from '../Core/Providers/Validation'

const AuthorsComp = observer( (props) => {
    // const [, updateClientValidationMessages] = useValidation()
    // const formValid = () => {
    //     const clientValidationMessages: string[] = []
    //     if (props.presenter.newAuthorName === '') clientValidationMessages.push('No Author Name')
    //     updateClientValidationMessages(clientValidationMessages)
    // }

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
        {/* <AddAuthorComponent formValid={formValid} /> */}
        <br />
        {/* <AddBooks presenter={props.presenter} formValid={formValid}/> */}
        <br />
        {/* <BookList /> */}
        <br />
        <MessagesComponent />
        </>
    )
})

export const Authors = withInjection({
    presenter: AuthorsPresenter
})(AuthorsComp)