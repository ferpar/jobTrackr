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

    newAuthorName: string | null = null

    toggleShowBooks: boolean = true

    get viewModel() {
        return this.authorsRepository.authors
    }

    get messagePm() {
        return this.authorsRepository.messagePm
    }

    constructor() {
        super()
        makeObservable(this, {
            newAuthorName: observable,
            toggleShowBooks: observable,
            viewModel: computed,
            messagePm: computed
        })
        this.init()
        this.reset()
    }

    reset = () => {
        this.newAuthorName = ''
    }

    load = async () => {
        await this.authorsRepository.load()
    }

    // addAuthor = async () => {}
}