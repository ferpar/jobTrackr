import { injectable, inject } from 'inversify'
import { makeObservable, observable, computed } from 'mobx'
import { ApplicationsRepository } from './ApplicationsRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'
import { JobApplication } from '../Core/Types'

const defaultApplication: JobApplication = {
    jobTitle: '',
    company: '',
    location: '',
    appliedDate: new Date().toISOString(),
    contactPerson: '',
    contactEmail: '',
    notes: '',
    resumeLink: '',
    jobDescriptionLink: '',
    statuses: []
}

@injectable()
export class ApplicationsPresenter extends MessagesPresenter{
    @inject(ApplicationsRepository)
    applicationsRepository

    newApplication: JobApplication 

    preDeleteBuffer: number[] = []

    get viewModel() {
        return this.applicationsRepository.applications
    }

    get messagePm() {
        return this.applicationsRepository.messagePm
    }

    get formattedDate() {
        const year = this.newApplication.appliedDate.slice(0, 4)
        const month = this.newApplication.appliedDate.slice(5, 7)
        const day = this.newApplication.appliedDate.slice(8, 10)

        return `${year}-${month}-${day}`
    }

    constructor () {
        super()
        makeObservable(this, {
            newApplication: observable,
            preDeleteBuffer: observable,
            viewModel: computed,
            messagePm: computed,
            formattedDate: computed,
        })
        // init is inherited from MessagesPresenter
        this.init()
        this.reset()
    }

    reset = () => {
        this.newApplication = defaultApplication
    }

    load = async () => {
        const applications = await this.applicationsRepository.load()
        this.unpackRepositoryPmToVm(applications, 'Applications loaded')
    }

    addApplication = async () => {
        const addApplicationPm = await this.applicationsRepository.addApplication(this.newApplication)
        this.unpackRepositoryPmToVm(addApplicationPm, 'Application added')
        this.newApplication = defaultApplication
    }

    removeApplication = async (applicationId: number) => {
        if (!this.preDeleteBuffer.includes(applicationId)) {
            this.preDeleteBuffer.push(applicationId)
            return
        }
        const removeApplicationPm = await this.applicationsRepository.removeApplication(applicationId)
        this.unpackRepositoryPmToVm(removeApplicationPm, 'Application removed')
    }

    isPredeleted(id: number) {
        return this.preDeleteBuffer.includes(id)
    }

    getDeleteButtonText(id: number): string {
        return this.isPredeleted(id) ? 'Confirm' : 'Delete'
    }

    restorePredeleted(id: number) {
        this.preDeleteBuffer = this.preDeleteBuffer.filter((preDeletedId) => preDeletedId !== id)
    }

}