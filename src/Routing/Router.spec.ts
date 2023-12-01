import "reflect-metadata";
import { expect, describe, it, beforeEach } from "vitest";
import { Types } from "../Core/Types";
import { BaseIOC } from "../BaseIOC";
import { AppPresenter } from "../AppPresenter";
import { RouterRepository } from "./RouterRepository";
import { Router } from "./Router";
import { RouterGateway } from "./RouterGateway";

let container;
let appPresenter;
let router;
let routerRepository;

// we are also testing that the IOC container is wired up correctly
// and that the RouterGateway is working as expected (w/ navigo)
describe("routing", () => {
  beforeEach(() => {
    // instantiate IOC container w/ common bindings
    container = new BaseIOC().buildBaseTemplate();
    // replace RouterGateway binding w/ FakeRouterGateway
    container.bind(Types.IRouterGateway).to(RouterGateway);

    // get dependencies
    appPresenter = container.get(AppPresenter);
    routerRepository = container.get(RouterRepository);
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
    expect(routerRepository.currentRoute).toEqual({
      routeId: "aboutLink",
    });
  })
});
