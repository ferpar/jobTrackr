import { injectable } from 'inversify'
import { makeObservable, observable } from 'mobx'

export type AppMessage = {
  message: string
  success: boolean
}
@injectable()
export class MessagesRepository {
  appMessages: Array<AppMessage> | null = null

  constructor() {
    makeObservable(this, {
      appMessages: observable
    })
    this.reset()
  }

  reset = () => {
    this.appMessages = []
  }
}
