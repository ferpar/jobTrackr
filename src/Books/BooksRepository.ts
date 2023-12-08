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

    constructor() {
        makeObservable(this, {
            messagePm: observable,
        })
    }

    load = async () => {
        await Promise.resolve(
            setTimeout(() => {
                this.messagePm = 'LOADED'
            }, 800)
        )
    }

    reset = () => {
        this.messagePm = 'RESET'
    }
}