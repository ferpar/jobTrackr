import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'

@injectable()
export class AuthorsRepository {
    baseUrl: string | null = null

    @inject(Types.IDataGateway)
    dataGateway

    @inject(UserModel)
    userModel

    @inject(Config)
    config

    messagePm = 'UNSET'

    authors = []

    constructor() {
        makeObservable(this, {
            messagePm: observable,
            authors: observable
        })
    }

    load = async () => {
        this.messagePm = 'LOADING'
        const authorResponse = await this.dataGateway.get('/authors?emailOwnerId=' + this.userModel.email)
        this.authors = authorResponse.result
        this.messagePm = 'LOADED'
    }

    reset = () => {
        this.messagePm = 'RESET'
    }

    // addAuthor = async (title: string) => {
    //     this.messagePm = 'ADDING'
    //     const addAuthorPm = await this.dataGateway.post('/authors', { 
    //         name: title,
    //         emailOwnerId: this.userModel.email,
    //     })
    //     await this.load()
    //     this.messagePm = 'ADDED'
    //     return addAuthorPm
    // }
}