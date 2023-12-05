import "reflect-metadata"
import { describe, it, beforeEach, expect } from 'vitest'
import { Types } from '../Core/Types'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { Router } from '../Routing/Router'
import { RouterRepository } from '../Routing/RouterRepository'
import { RouterGateway } from "../Routing/RouterGateway"
import { LoginRegisterPresenter } from './LoginRegisterPresenter'
import { UserModel } from "./UserModel"
import { GetSuccessfulUserLoginStub } from '../TestTools/GetSuccessfulUserLoginStub'
import { GetFailedUserLoginStub } from '../TestTools/GetFailedUserLoginStub'
import { GetSuccessfulRegistrationStub } from '../TestTools/GetSuccessfulRegistrationStub'
import { GetFailedRegistrationStub } from '../TestTools/GetFailedRegistrationStub0'

let testHarness: AppTestHarness | null = null
let loginRegisterPresenter: LoginRegisterPresenter | null = null
let router: Router | null = null
let routerRepository: RouterRepository | null= null
let routerGateway: RouterGateway | null = null
let dataGateway = null
let userModel: UserModel | null = null
let onRouteChange: (() => void) | null = null

describe('init', () => {
  beforeEach(() => {
    testHarness = new AppTestHarness()
    testHarness.init()
    testHarness.setupLogin(GetSuccessfulUserLoginStub)
    router = testHarness.container.get(Router)
    routerRepository = testHarness.container.get(RouterRepository)
    dataGateway = testHarness.container.get(Types.IDataGateway)
    userModel = testHarness.container.get(UserModel)
    routerGateway = router?.routerRepository.routerGateway
    onRouteChange = () => {}
  })

  it('should be an null route', () => {
    expect(routerRepository?.currentRoute.routeId).toBe(null)
  })

  describe('bootstrap', () => {
    beforeEach(() => {
      testHarness?.bootstrap(onRouteChange)
    })

    it('should start at null route', () => {
      expect(routerRepository?.currentRoute.routeId).toBe(null)
    })

    describe('routing', () => {
      it('should block wildcard *(default) routes when not logged in', () => {
        router?.goToId('default')

        expect(routerGateway?.goToId).toHaveBeenLastCalledWith('loginLink')
      })

      it('should block secure routes when not logged in', () => {
        router?.goToId('homeLink')

        expect(routerGateway?.goToId).toHaveBeenLastCalledWith('loginLink')
      })

      it('should allow public route when not logged in', () => {
        router?.goToId('authorPolicyLink')

        expect(routerGateway?.goToId).toHaveBeenLastCalledWith('authorPolicyLink')
      })
    })

    // describe('register', () => {})
    // describe('login', () => {})
  })
})
