import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { BooksRepository } from '../Books/BooksRepository'
import { AuthorsRepository } from './AuthorsRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

@injectable()
export class AuthorsPresenter extends MessagesPresenter {
    @inject(AuthorsRepository)
    authorsRepository

    @inject(BooksRepository)
    booksRepository

    newAuthorTitle: string | null = null

    get viewModel() {
        return this.authorsRepository.authors
    }

    get messagePm() {
        return this.authorsRepository.messagePm
    }

    constructor() {
        super()
        makeObservable(this, {
            newAuthorTitle: observable,
            viewModel: computed,
            messagePm: computed
        })
        this.init()
        this.reset()
    }

    reset = () => {
        this.newAuthorTitle = ''
    }

    // addAuthor = async () => {}
}