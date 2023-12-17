import { injectable, inject } from  'inversify';
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types, Book } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'

// import { MessagePacking } from '../Core/Messages/MessagePacking';

@injectable()
export class BooksRepository {
    baseUrl: string | null = null

    @inject(Types.IDataGateway)
    dataGateway

    @inject(UserModel)
    userModel

    @inject(Config)
    config

    messagePm = 'UNSET'

    books: Book[] = []

    bufferMode = false
    bookBuffer: Book[] = [] // for adding authors w/ books

    constructor() {
        makeObservable(this, {
            messagePm: observable,
            books: observable,
            bookBuffer: observable,
            bufferMode: observable,
        })
    }

    load = async () => {
        this.messagePm = 'LOADING'
        const bookResponse = await this.dataGateway.get('/books?emailOwnerId=' + this.userModel.email)
        this.books = bookResponse.result
        this.messagePm = 'LOADED'
    }

    reset = () => {
        this.messagePm = 'RESET'
        this.books = []
    }

    addBook = async (title: string) => {
        this.messagePm = 'ADDING'
        const addBookPm = await this.dataGateway.post('/books', { 
            name: title,
            emailOwnerId: this.userModel.email,
        })
        await this.load()
        this.messagePm = 'ADDED'
        return addBookPm
    }

    addBookToBuffer = (title: string) => {
        this.bookBuffer.push({
            id: 0,
            name: title,
            emailOwnerId: this.userModel.email,
        })
    }

    clearBooksBuffer = () => {
        this.bookBuffer = []
    }
    
}