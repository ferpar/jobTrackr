import "reflect-metadata";
import { describe, it, beforeEach, expect } from "vitest";
import { AppTestHarness } from "../TestTools/AppTestHarness";
import { Router } from "../Routing/Router";
import { RouterRepository } from "../Routing/RouterRepository";
import { RouterGateway } from "../Routing/RouterGateway";
import { LoginRegisterPresenter } from "./LoginRegisterPresenter";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";
import { GetFailedUserLoginStub } from "../TestTools/GetFailedUserLoginStub";
import { GetSuccessfulRegistrationStub } from "../TestTools/GetSuccessfulRegistrationStub";
import { GetFailedRegistrationStub } from "../TestTools/GetFailedRegistrationStub";

let testHarness: AppTestHarness | null = null;
let loginRegisterPresenter: LoginRegisterPresenter | null = null;
let router: Router | null = null;
let routerRepository: RouterRepository | null = null;
let routerGateway: RouterGateway | null = null;
let onRouteChange: (() => void) | null = null;

describe("init", () => {
  beforeEach(async () => {
    testHarness = new AppTestHarness();
    testHarness.init();
    router = testHarness.container.get(Router);
    routerRepository = testHarness.container.get(RouterRepository);
    routerGateway = router?.routerRepository.routerGateway;
    loginRegisterPresenter = testHarness.container.get(LoginRegisterPresenter);
    onRouteChange = () => {};

    testHarness?.bootstrap(onRouteChange);
  });

  it("should initially be a null route", () => {
    expect(routerRepository?.currentRoute.routeId).toBe(null);
  });

  describe("bootstrap", () => {
    describe("routing", () => {
      it("should block wildcard *(default) routes when not logged in", () => {
        router?.goToId("default");

        expect(routerGateway?.goToId).toHaveBeenLastCalledWith("loginLink");
      });

      it("should block secure routes when not logged in", async () => {
        await loginRegisterPresenter?.logOut();
        router?.goToId("homeLink");

        expect(routerGateway?.goToId).toHaveBeenLastCalledWith("loginLink");
      });

      it("should allow public route when not logged in", () => {
        router?.goToId("authorPolicyLink");

        expect(routerGateway?.goToId).toHaveBeenLastCalledWith(
          "authorPolicyLink"
        );
      });
    });

    describe("register", () => {
      it("should show successful user message on successful register", async () => {
        // get the loginRegisterPresenter from the function call to make sure it's the same one (transient)
        const loginRegisterPresenter = await testHarness?.setupRegister(GetSuccessfulRegistrationStub);
        expect(loginRegisterPresenter?.showValidationWarning).toBe(false);
        expect(loginRegisterPresenter?.messages).toEqual(["User registered"]);
      });
      it("should show failed user message on failed register", async () => {
        const loginRegisterPresenter = await testHarness?.setupRegister(GetFailedRegistrationStub);
        expect(loginRegisterPresenter?.messages).toEqual([
          "Failed: credentials not valid must be (email and >3 chars on password).",
        ]);
        expect(loginRegisterPresenter?.showValidationWarning).toBe(true);
      })
    });
    describe("login", () => {
      it("should start at loginLink if not logged in", () => {
        // this represents the user accessing the app for the first time (no token)
        router?.goToId("homeLink");
        // gets redirected to the login if going to a secure route
        expect(routerRepository?.currentRoute.routeId).toBe("loginLink");
      });

      // would start at null route, but not logged in
      it("should start at home route, when authenticated", async () => {
        await testHarness?.setupLogin(GetSuccessfulUserLoginStub);
        expect(routerRepository?.currentRoute.routeId).toBe("homeLink");
      });
    });
  });
});
