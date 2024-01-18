import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { ApplicationsRepository } from './ApplicationsRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

@injectable()
export class ApplicationsPresenter extends MessagesPresenter{
    @inject(ApplicationsRepository)
    applicationsRepository

    newApplication: string | null = null

    get viewModel() {
        return this.applicationsRepository.applications
    }

    get messagePm() {
        return this.applicationsRepository.messagePm
    }

    constructor () {
        super()
        makeObservable(this, {
            newApplication: observable,
            viewModel: computed,
            messagePm: computed
        })
        // init is inherited from MessagesPresenter
        this.init()
        this.reset()
    }

    reset = () => {
        this.newApplication = ''
    }

    load = async () => {
        const applications = await this.applicationsRepository.load()
        this.unpackRepositoryPmToVm(applications, 'Applications loaded')
    }

    addApplication = async () => {
        const addApplicationPm = await this.applicationsRepository.addApplication(this.newApplication)
        this.unpackRepositoryPmToVm(addApplicationPm, 'Application added')
        this.newApplication = ''
    }

}