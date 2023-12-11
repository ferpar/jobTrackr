import React from 'react'
import { observer } from 'mobx-react'
import { BooksPresenter } from '../BooksPresenter'
import { withInjection } from '../../Core/Providers/Injection'
import { useValidation } from '../../Core/Providers/Validation'

export const AddBooksComp = observer(({ presenter }) => {
    const [, updateClientValidationMessages] = useValidation()

    const formValid = () => {
        const clientValidationMessages: string[] = []
        if (presenter.newBookTitle === '') {
            clientValidationMessages.push('No book name')
        } 
        updateClientValidationMessages(clientValidationMessages)
        return clientValidationMessages.length === 0
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (formValid()) {
            presenter.addBook()
        }
    }

    const onChange = (event) => {
        presenter.newBookTitle = event.target.value
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input 
                        type="text"
                        value={presenter.newBookTitle}
                        placeholder='Enter book name'
                        onChange={onChange}
                    />
                    <button type="submit">Add Book</button>
                </label>
            </form>
        </div>    
    )
})

export const AddBooks = withInjection({
    presenter: BooksPresenter
})(AddBooksComp)