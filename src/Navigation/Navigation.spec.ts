import "reflect-metadata";
import { describe, it, beforeEach, expect } from "vitest";

import { Router } from "../Routing/Router";
import { NavigationPresenter } from "./NavigationPresenter";

import { AppTestHarness } from "../TestTools/AppTestHarness";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";

let router;
let navigationPresenter;

describe("navigation", () => {
  beforeEach(() => {
		// instantiate IOC container w/ common bindings
		const testHarness = new AppTestHarness();
		testHarness.init();
		testHarness.bootstrap();
		testHarness.setupLogin(GetSuccessfulUserLoginStub);
    // load the navigation presenter via ioc container (transient dependency)
		router = testHarness.container.get(Router);
    navigationPresenter = testHarness.container.get(NavigationPresenter);
  });
  it.only("has a default view model", () => {
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
