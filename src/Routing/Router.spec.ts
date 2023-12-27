import "reflect-metadata";
import { expect, describe, it, beforeEach } from "vitest";
import { AppPresenter } from "../AppPresenter";
import { Router } from "./Router";
import { AppTestHarness } from "../TestTools/AppTestHarness";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";

let appPresenter;
let router;

describe("routing in isolation", () => {
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
    router = testHarness.container.get(Router);
    appPresenter = testHarness.container.get(AppPresenter);
  });
  it("should have a current route", () => {
    expect(appPresenter.currentRoute).toEqual("homeLink");
  });
  it("should programmatically change route", () => {
    expect(appPresenter.currentRoute).toEqual("homeLink");
    router.goToId("aboutLink");
    expect(appPresenter.currentRoute).toEqual("aboutLink");
  });
});

// integration test w/ navigo
// testing that the RouterGateway is working as expected (w/ navigo)
// there currently is a dependency on navigo executing a callback to update router state
// as well as navigo storing the registered routes (when appPresenter.load() is called)
describe("routing - integrated with navigo", () => {
  beforeEach(async () => {
    // instantiate IOC container w/ common bindings
    const testHarness = new AppTestHarness();
    testHarness.init("integration-test");
    const loginRegisterPresenter = await testHarness.setupLogin(
      GetSuccessfulUserLoginStub
    );
    loginRegisterPresenter.email = "a@b.com";
    loginRegisterPresenter.password = "1234";
    loginRegisterPresenter.option = "login";
    await loginRegisterPresenter.login();
    testHarness.bootstrap();
    router = testHarness.container.get(Router);
    appPresenter = testHarness.container.get(AppPresenter);
  });
  it("should have a current route", () => {
    expect(appPresenter.currentRoute).toEqual("homeLink");
  });
  it("should programmatically change route", () => {
    router.registerRoutes(() => {});
    expect(appPresenter.currentRoute).toEqual("homeLink");
    router.goToId("aboutLink");
    expect(appPresenter.currentRoute).toEqual("aboutLink");
  });
});
