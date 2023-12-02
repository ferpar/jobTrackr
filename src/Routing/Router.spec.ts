import "reflect-metadata";
import { expect, describe, it, beforeEach, vi, should } from "vitest";
import { Types } from "../Core/Types";
import { BaseIOC } from "../BaseIOC";
import { AppPresenter } from "../AppPresenter";
import { Router } from "./Router";
import { RouterGateway } from "./RouterGateway";
import { FakeRouterGateway } from "./FakeRouterGateway";

let container;
let appPresenter;
let router;

describe("routing in isolation", () => {
  beforeEach(() => {
    // instantiate IOC container w/ common bindings
    container = new BaseIOC().buildBaseTemplate();
    // replace RouterGateway binding w/ FakeRouterGateway
    container.bind(Types.IRouterGateway).to(FakeRouterGateway);

    // get dependencies
    appPresenter = container.get(AppPresenter);
    router = container.get(Router);

    // mock out the goToId method
    router.routerRepository.routerGateway.goToId = vi
      .fn()
      .mockImplementation(async (routeId) => {
        await Promise.resolve(router.updateCurrentRoute(routeId));
      });

    // load app reactive core
    appPresenter.load(() => {});
  });
  it("should have a current route", () => {
    expect(appPresenter.currentRoute).toEqual(null);
  });
  it("should have a current route after registering routes", () => {
    router.registerRoutes(() => {});
    // registerRoutes is a dummy method in FakeRouterGateway
    // hence the currentRoute is still null
    expect(appPresenter.currentRoute).toEqual(null);
  });
  it("should programmatically change route", () => {
    expect(appPresenter.currentRoute).toEqual(null);
    router.goToId("aboutLink");
    expect(appPresenter.currentRoute).toEqual("aboutLink");
  });
});

// we are also testing that the IOC container is wired up correctly
// and that the RouterGateway is working as expected (w/ navigo)
// there currently is a dependency on navigo executing a callback to update router state
// as well as navigo storing the registered routes (when appPresenter.load() is called)
describe("routing - integrated with navigo", () => {
  beforeEach(() => {
    // instantiate IOC container w/ common bindings
    container = new BaseIOC().buildBaseTemplate();
    // replace RouterGateway binding w/ FakeRouterGateway
    container.bind(Types.IRouterGateway).to(RouterGateway);

    // get dependencies
    appPresenter = container.get(AppPresenter);
    router = container.get(Router);

    // load app reactive core
    appPresenter.load(() => {});
  });

  it("should have a current route", () => {
    expect(appPresenter.currentRoute).toEqual("homeLink");
  });

  it("should have a current route after registering routes", () => {
    router.registerRoutes(() => {});
    expect(appPresenter.currentRoute).toEqual("homeLink");
  });
  it("should programmatically change route", () => {
    router.registerRoutes(() => {});
    expect(appPresenter.currentRoute).toEqual("homeLink");
    router.goToId("aboutLink");
    expect(appPresenter.currentRoute).toEqual("aboutLink");
  });
});
