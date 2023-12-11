import { injectable, inject } from  'inversify';
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { MessagePacking } from '../Core/Messages/MessagePacking';

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

    books = []

    constructor() {
        makeObservable(this, {
            messagePm: observable,
            books: observable
        })
    }

    load = async () => {
        this.messagePm = 'LOADING'
        const bookResponse = await this.dataGateway.get('/books?emailOwnerId=a@b.com')
        this.books = bookResponse.result
        this.messagePm = 'LOADED'
    }

    reset = () => {
        this.messagePm = 'RESET'
    }

    addBook = async (title) => {
        this.messagePm = 'ADDING'
        await this.dataGateway.post('/books', { 
            title,
            emailOwnerId: this.userModel.email,
        })
        await this.load()
        this.messagePm = 'ADDED'
    }
}