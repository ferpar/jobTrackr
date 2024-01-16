import { Types } from "../Core/Types";
import { BaseIOC } from "../BaseIOC";

import { AppPresenter } from "../AppPresenter";
import { Router } from "../Routing/Router";
import { FakeRouterGateway } from "../Routing/FakeRouterGateway";
import { RouterGateway } from "../Routing/RouterGateway";
import { FakeHttpGateway } from "../Core/FakeHttpGateway";
import { FakeAuthGateway } from "../Core/FakeAuthGateway";
import { UserModel } from "../Authentication/UserModel";
import { LoginRegisterPresenter } from "../Authentication/AuthenticationPresenter";
import { vi } from "vitest";
import { FakeLocalStorageGateway } from "../Core/LocalStorage/FakeLocalStorageGateway";

export class AppTestHarness {
  container;
  authGateway;
  authenticationPresenter;
  appPresenter;
  router;
  navigationPresenter;
  userModel;

  // 1. set up the app
  init = (mode = "blackbox-test") => {
    this.container = new BaseIOC().buildBaseTemplate();

    if (mode === "blackbox-test") {
      this.container.bind(Types.IRouterGateway).to(FakeRouterGateway);
    } else {
      // integration test
      this.container.bind(Types.IRouterGateway).to(RouterGateway);
    }

    this.container.bind(Types.IDataGateway).to(FakeHttpGateway);
    this.container.bind(Types.IAuthGateway).to(FakeAuthGateway);

    this.container.bind(Types.ILocalStorageGateway).to(FakeLocalStorageGateway);

    this.appPresenter = this.container.get(AppPresenter);
    this.router = this.container.get(Router);
    this.userModel = this.container.get(UserModel);

    this.router.routerRepository.routerGateway.goToId = vi
      .fn()
      .mockImplementation(async (routeId) => {
        await Promise.resolve(this.router.updateCurrentRoute(routeId));
      });
  };

  // 2. bootstrap the app
  bootstrap = (callback = () => {}) => {
    this.appPresenter.load(callback);
  };

  // 3. login or register to the app
  setupLogin = async (loginStub) => {
    this.authenticationPresenter = this.container.get(LoginRegisterPresenter);
    this.authGateway =
      this.authenticationPresenter.authenticationRepository.authGateway;
    this.authGateway.post = vi.fn().mockImplementation(async () => {
      return await Promise.resolve(loginStub());
    });
    return this.authenticationPresenter;
  };

  setupRegister = async (registerStub) => {
    this.authenticationPresenter = this.container.get(LoginRegisterPresenter);
    this.authGateway =
      this.authenticationPresenter.authenticationRepository.authGateway;
    this.authGateway.post = vi.fn().mockImplementation(async () => {
      return await Promise.resolve(registerStub());
    });
    return this.authenticationPresenter;
  };
}
