import { Types } from "../Core/Types";
import { BaseIOC } from "../BaseIOC";

import { AppPresenter } from "../AppPresenter";
import { Router } from "../Routing/Router";
import { FakeRouterGateway } from "../Routing/FakeRouterGateway";
import { RouterGateway } from "../Routing/RouterGateway";
import { HttpGateway } from '../Core/HttpGateway'
// import { NavigationPresenter } from "./NavigationPresenter";
import { vi } from "vitest";

export class AppTestHarness {
    container
    appPresenter
    router
    navigationPresenter

    // 1. set up the app
    init = (mode="blackbox-test") => {
        
    this.container = new BaseIOC().buildBaseTemplate();

    if (mode === "blackbox-test") {
    this.container.bind(Types.IRouterGateway).to(FakeRouterGateway);
    } else { // integration test
    this.container.bind(Types.IRouterGateway).to(RouterGateway);
    }

    this.container.bind(Types.IDataGateway).to(HttpGateway).inSingletonScope()

    this.appPresenter = this.container.get(AppPresenter);
    this.router = this.container.get(Router);

    this.router.routerRepository.routerGateway.goToId = vi
        .fn()
        .mockImplementation(async (routeId) => {
        await Promise.resolve(this.router.updateCurrentRoute(routeId));
        })
    }

    // 2. bootstrap the app
    bootstrap = () => {
        this.appPresenter.load(() => {});
    }

    // 3. login or register to the app
    setupLogin = async () => {}
}