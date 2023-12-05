import "reflect-metadata"
import { describe, it, beforeEach, expect } from 'vitest'
import { Types } from '../Core/Types'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { Router } from '../Routing/Router'
import { RouterRepository } from '../Routing/RouterRepository'
import { LoginRegisterPresenter } from './LoginRegisterPresenter'
import { UserModel } from "./UserModel"
import { GetSuccessfulUserLoginStub } from '../TestTools/GetSuccessfulUserLoginStub'
import { GetFailedUserLoginStub } from '../TestTools/GetFailedUserLoginStub'
import { GetSuccessfulRegistrationStub } from '../TestTools/GetSuccessfulRegistrationStub'
import { GetFailedRegistrationStub } from '../TestTools/GetFailedRegistrationStub0'

let testHarness = null
let loginRegisterPresenter = null
let router = null
let routerRepository = null
let routerGateway = null
let dataGateway = null
let userModel = null
let onRouteChange = null

describe('init', () => {
  beforeEach(() => {
    testHarness = new AppTestHarness()
    testHarness.init()
    router = testHarness.container.get(Router)
    routerRepository = testHarness.container.get(RouterRepository)
    routerGateway = testHarness.container.get(Types.IRouterGateway)
    dataGateway = testHarness.container.get(Types.IDataGateway)
    userModel = testHarness.container.get(UserModel)
    onRouteChange = () => {}
  })

  it('should be an null route', () => {
    expect(routerRepository.currentRoute.routeId).toBe(null)
  })

  describe('bootstrap', () => {
    beforeEach(() => {
      testHarness.bootstrap(onRouteChange)
    })

    it('should start at null route', () => {
      expect(routerRepository.currentRoute.routeId).toBe(null)
    })

    describe('routing', () => {
      it('should block wildcard *(default) routes when not logged in', () => {
        router.goToId('default')

        expect(routerGateway.goToId).toHaveBeenLastCalledWith('loginLink')
      })

      it('should block secure routes when not logged in', () => {
        router.goToId('homeLink')

        expect(routerGateway.goToId).toHaveBeenLastCalledWith('loginLink')
      })

      it('should allow public route when not logged in', () => {
        router.goToId('authorPolicyLink')

        expect(routerGateway.goToId).toHaveBeenLastCalledWith('authorPolicyLink')
      })
    })

    // describe('register', () => {})
    // describe('login', () => {})
  })
})
