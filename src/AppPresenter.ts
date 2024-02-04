import { inject, injectable } from 'inversify'
import { makeObservable, computed } from 'mobx'
import { MessagesRepository } from './Core/Messages/MessagesRepository'
import { Router } from './Routing/Router'

@injectable()
export class AppPresenter {
  @inject(Router)
  router: Router

  @inject(MessagesRepository)
  messagesRepository: MessagesRepository

  get currentRoute() {
    return this.router.currentRoute.routeId
  }

  constructor() {
    makeObservable(this, {
      currentRoute: computed
    })
  }

  load = (onRouteChange: () => Promise<void>) => {
    const onRouteChangeWrapper: () => Promise<void> = async () => {
      this.messagesRepository.appMessages = []
      onRouteChange()
    }
    this.router.registerRoutes(onRouteChangeWrapper)
  }
}
