import "reflect-metadata";
import { expect, describe, it, beforeEach } from "vitest";
import { Types } from "../Core/Types";
import { BaseIOC } from "../BaseIOC";
import { AppPresenter } from "../AppPresenter";
import { Router } from "./Router";
import { RouterGateway } from "./RouterGateway";

let container;
let appPresenter;
let router;

// we are also testing that the IOC container is wired up correctly
// and that the RouterGateway is working as expected (w/ navigo)
// there currently is a dependency on navigo executing a callback to update router state
describe("routing", () => {
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
    expect(appPresenter.currentRoute).toEqual({
      routeId: "homeLink",
    });
  });

  it("should have a current route after registering routes", () => {
    router.registerRoutes(() => {});
    expect(appPresenter.currentRoute).toEqual({
      routeId: "homeLink",
    });
  })
  it("should programmatically change route", () => {
    router.registerRoutes(() => {});
    router.goToId("aboutLink");
    expect(router.currentRoute).toEqual({
      routeId: "aboutLink",
    });
  })
});
