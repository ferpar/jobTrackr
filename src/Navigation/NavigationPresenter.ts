import { inject, injectable } from 'inversify'
import { computed, makeObservable } from 'mobx'
import { NavigationRepository, NavigationNode } from '../Navigation/NavigationRepository'
import { RouterRepository } from '../Routing/RouterRepository'

@injectable()
export class NavigationPresenter {
  @inject(NavigationRepository)
  navigationRepository: NavigationRepository

  @inject(RouterRepository)
  routerRepository: RouterRepository

  get viewModel(): {
    showBack: boolean
    currentSelectedVisibleName: string
    currentSelectedBackTarget: { visible: boolean; id: string | null }
    menuItems: NavigationNode[]
  } {
    const vm = {
      showBack: false,
      currentSelectedVisibleName: '',
      currentSelectedBackTarget: { visible: false, id: null },
      menuItems: []
    } 

    const currentNode = this.navigationRepository.currentNode

    if (currentNode) {
      vm.currentSelectedVisibleName = this.visibleName(currentNode)
      vm.menuItems = currentNode.children.map((node: NavigationNode) => {
        return { id: node.model.id, visibleName: node.model.text }
      })

      if (currentNode.parent) {
        vm.currentSelectedBackTarget = {
          visible: true,
          id: currentNode.parent.model.id
        }
        vm.showBack = true
      }
    }

    return vm
  }

  constructor() {
    makeObservable(this, {
      viewModel: computed
    })
  }

  private visibleName = (node: NavigationNode) => {
    return node.model.text + ' > ' + node.model.id
  }

  back = () => {
    this.navigationRepository.back()
  }
}
