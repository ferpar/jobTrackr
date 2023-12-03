import "reflect-metadata";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { Types } from "../Core/Types";
import { BaseIOC } from "../BaseIOC";

import { AppPresenter } from "../AppPresenter";
import { Router } from "../Routing/Router";
// import { RouterGateway } from "./RouterGateway";
import { FakeRouterGateway } from "../Routing/FakeRouterGateway";
import { NavigationPresenter } from "./NavigationPresenter";

let container;
let appPresenter;
let router;
let navigationPresenter;

describe("navigation", () => {
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

    // load the navigation presenter via ioc container (transient dependency)
    navigationPresenter = container.get(NavigationPresenter);
  });

  it("has a default view model", () => {
    expect(navigationPresenter.viewModel).toEqual({
      showBack: false,
      currentSelectedVisibleName: "",
      currentSelectedBackTarget: { visible: false, id: null },
      menuItems: [],
    });
  });

  it("updates the view model when the route changes", async () => {
    await router.goToId("homeLink");
    expect(navigationPresenter.viewModel).toEqual({
      showBack: false,
      currentSelectedVisibleName: "Home > homeLink",
      currentSelectedBackTarget: { visible: false, id: null },
      menuItems: [
        { id: "aboutLink", visibleName: "About" },
        { id: "contactLink", visibleName: "Contact" },
      ],
    });
    await router.goToId("aboutLink");
    expect(navigationPresenter.viewModel).toEqual({
      showBack: true,
      currentSelectedVisibleName: "About > aboutLink",
      currentSelectedBackTarget: { visible: true, id: "homeLink" },
      menuItems: [],
    });
  });

  it("goes up a level in the navigation tree, when the back button is clicked", async () => {
    await router.goToId("aboutLink");
    await navigationPresenter.back();
    expect(router.currentRoute.routeId).toEqual("homeLink");
  });
});
