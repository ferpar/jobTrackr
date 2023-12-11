import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { BooksRepository } from './BooksRepository'

@injectable()
export class BooksPresenter {
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
        makeObservable(this, {
            newBookTitle: observable,
            lastAddedBook: observable,
            viewModel: computed,
            messagePm: computed
        })
        this.reset()
    }

    reset = () => {
        this.newBookTitle = ''
    }

    addBook = async () => {
        this.lastAddedBook = this.newBookTitle
        await this.booksRepository.addBook(this.newBookTitle)
    }

}