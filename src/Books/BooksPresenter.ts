import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { BooksRepository } from './BooksRepository'

@injectable()
export class BooksPresenter {
    @inject(BooksRepository)
    booksRepository

    newBookTitle: string | null = null

    get viewModel() {
        return this.booksRepository.books
    }

    constructor () {
        makeObservable(this, {
            newBookTitle: observable,
            viewModel: computed,
        })
    }

    reset = () => {
        this.newBookTitle = ''
    }

}