import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { BooksRepository } from './BooksRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

@injectable()
export class BooksPresenter extends MessagesPresenter{
    @inject(BooksRepository)
    booksRepository

    newBookTitle: string | null = null

    lastAddedBook: string | null = null

    get viewModel() {
        return this.booksRepository.books
    }

    get messagePm() {
        return this.booksRepository.messagePm
    }

    constructor () {
        super()
        makeObservable(this, {
            newBookTitle: observable,
            lastAddedBook: observable,
            viewModel: computed,
            messagePm: computed
        })
        this.init()
        this.reset()
    }

    reset = () => {
        this.newBookTitle = ''
    }

    addBook = async () => {
        this.lastAddedBook = this.newBookTitle
        const addBookPm = await this.booksRepository.addBook(this.newBookTitle)
        this.unpackRepositoryPmToVm(addBookPm, 'Book added')
    }

}