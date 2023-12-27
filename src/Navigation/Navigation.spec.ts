import "reflect-metadata";
import { describe, it, beforeEach, expect } from "vitest";

import { Router } from "../Routing/Router";
import { NavigationPresenter } from "./NavigationPresenter";

import { AppTestHarness } from "../TestTools/AppTestHarness";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";

let router;
let navigationPresenter;

describe("navigation", () => {
  beforeEach(async () => {
    // instantiate IOC container w/ common bindings
    const testHarness = new AppTestHarness();
    testHarness.init();
    const loginRegisterPresenter = await testHarness.setupLogin(
      GetSuccessfulUserLoginStub
    );
    loginRegisterPresenter.email = "a@b.com";
    loginRegisterPresenter.password = "1234";
    loginRegisterPresenter.option = "login";
    await loginRegisterPresenter.login();
    testHarness.bootstrap();
    // load the navigation presenter via ioc container (transient dependency)
    router = testHarness.container.get(Router);
    navigationPresenter = testHarness.container.get(NavigationPresenter);
  });
  it("has a default view model", () => {
    expect(navigationPresenter.viewModel).toEqual({
      currentSelectedBackTarget: {
        id: null,
        visible: false,
      },
      currentSelectedVisibleName: "Home > homeLink",
      menuItems: [
        {
          id: "booksLink",
          visibleName: "Books",
        },
        {
          id: "authorsLink",
          visibleName: "Authors",
        },
        {
          id: "contactLink",
          visibleName: "Contact",
        },
        {
          id: "aboutLink",
          visibleName: "About",
        },
      ],
      showBack: false,
    });
  });
  it("updates the view model when the route changes", async () => {
    await router.goToId("homeLink");
    expect(navigationPresenter.viewModel).toEqual({
      currentSelectedBackTarget: {
        id: null,
        visible: false,
      },
      currentSelectedVisibleName: "Home > homeLink",
      menuItems: [
        {
          id: "booksLink",
          visibleName: "Books",
        },
        {
          id: "authorsLink",
          visibleName: "Authors",
        },
        {
          id: "contactLink",
          visibleName: "Contact",
        },
        {
          id: "aboutLink",
          visibleName: "About",
        },
      ],
      showBack: false,
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
  it("should navigate down the navigation tree", async () => {
    // anchor at home
    await router.goToId("homeLink");
    expect(router.currentRoute.routeId).toEqual("homeLink");

    // pivot to authors, then author policy
    await router.goToId("authorsLink");
    expect(router.currentRoute.routeId).toEqual("authorsLink");
    await router.goToId("authorsLink-authorPolicyLink");
    expect(router.currentRoute.routeId).toEqual("authorsLink-authorPolicyLink");

    expect(navigationPresenter.viewModel).toEqual({
      currentSelectedBackTarget: {
        id: "authorsLink",
        visible: true,
      },
      currentSelectedVisibleName:
        "Authors Policy > authorsLink-authorPolicyLink",
      menuItems: [],
      showBack: true,
    });
  });
  it("should move back twice", async () => {
    // anchor at authors policy
    await router.goToId("authorsLink-authorPolicyLink");
    expect(router.currentRoute.routeId).toEqual("authorsLink-authorPolicyLink");

    // pivot to authors, then home
    await navigationPresenter.back();
    expect(router.currentRoute.routeId).toEqual("authorsLink");

    expect(navigationPresenter.viewModel).toEqual({
      currentSelectedBackTarget: {
        id: "homeLink",
        visible: true,
      },
      currentSelectedVisibleName: "Authors > authorsLink",
      menuItems: [
        {
          id: "authorsLink-authorPolicyLink",
          visibleName: "Authors Policy",
        },
        {
          id: "authorsLink-maplink",
          visibleName: "View Map",
        },
      ],
      showBack: true,
    });

    await navigationPresenter.back();
    expect(router.currentRoute.routeId).toEqual("homeLink");

    expect(navigationPresenter.viewModel).toEqual({
      currentSelectedBackTarget: {
        id: null,
        visible: false,
      },
      currentSelectedVisibleName: "Home > homeLink",
      menuItems: [
        {
          id: "booksLink",
          visibleName: "Books",
        },
        {
          id: "authorsLink",
          visibleName: "Authors",
        },
        {
          id: "contactLink",
          visibleName: "Contact",
        },
        {
          id: "aboutLink",
          visibleName: "About",
        },
      ],
      showBack: false,
    });
  });
});
