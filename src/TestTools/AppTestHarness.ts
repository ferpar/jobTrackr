import { Types } from "../Core/Types";
import { BaseIOC } from "../BaseIOC";

import { AppPresenter } from "../AppPresenter";
import { Router } from "../Routing/Router";
import { FakeRouterGateway } from "../Routing/FakeRouterGateway";
import { RouterGateway } from "../Routing/RouterGateway";
import { FakeHttpGateway } from "../Core/FakeHttpGateway";
import { UserModel } from "../Authentication/UserModel";
import { LoginRegisterPresenter } from "../Authentication/LoginRegisterPresenter";
import { vi } from "vitest";

export class AppTestHarness {
  container;
  authGateway;
  loginRegisterPresenter;
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
    this.loginRegisterPresenter = this.container.get(LoginRegisterPresenter);
    this.authGateway = this.loginRegisterPresenter.authenticationRepository.dataGateway;
    this.authGateway.post = vi.fn().mockImplementation( async () => {
        return await Promise.resolve(loginStub())
    })
    this.loginRegisterPresenter.email = "a@b.com"
    this.loginRegisterPresenter.password = "123"
    this.loginRegisterPresenter.option = "login"
    await this.loginRegisterPresenter.login()
    return this.loginRegisterPresenter
  };
}
