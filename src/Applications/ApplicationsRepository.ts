import { injectable, inject } from  'inversify';
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types, JobApplication } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'

@injectable()
export class ApplicationsRepository {
    @inject(Types.IDataGateway)
    dataGateway

    @inject(UserModel)
    userModel

    @inject(Config)
    config

    messagePm = 'UNSET'

    applications: JobApplication[] = []

    constructor() {
        makeObservable(this, {
            messagePm: observable,
            applications: observable,
        })
    }

    load = async () => {
        this.messagePm = 'LOADING'
        const applicationsResponse = await this.dataGateway.get('/applications')
        this.applications = applicationsResponse.result.data
        this.messagePm = 'LOADED'
    }

    reset = () => {
        this.messagePm = 'RESET'
        this.applications = []
    }

    addApplication = async (application: object) => {
        this.messagePm = 'ADDING'
        const addApplicationPm = await this.dataGateway.post('/applications', application)
        this.messagePm = 'ADDED'
        await this.load()
        return addApplicationPm
    }

    removeApplication = async (applicationId: number) => {
        this.messagePm = 'DELETING'
        const removeApplicationPm = await this.dataGateway.delete('/applications/' + String(applicationId) )
        this.messagePm = 'DELETED'
        await this.load()
        return removeApplicationPm
    }
}