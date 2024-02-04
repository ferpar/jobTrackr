import "reflect-metadata";
import { describe, it, beforeEach, expect } from "vitest";
import { AppTestHarness } from "../TestTools/AppTestHarness";
import { Router } from "../Routing/Router";
import { RouterRepository } from "../Routing/RouterRepository";
import { RouterGateway } from "../Routing/RouterGateway";
import { AuthenticationPresenter } from "./AuthenticationPresenter";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";
import { GetFailedUserLoginStub } from "../TestTools/GetFailedUserLoginStub";
import { GetSuccessfulRegistrationStub } from "../TestTools/GetSuccessfulRegistrationStub";
import { GetFailedRegistrationStub } from "../TestTools/GetFailedRegistrationStub";

let testHarness: AppTestHarness | null = null;
let authenticationPresenter: AuthenticationPresenter | null = null;
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
    routerGateway = router?.routerRepository.routerGateway as RouterGateway;
    authenticationPresenter = testHarness.container.get(AuthenticationPresenter);
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
        await authenticationPresenter?.logOut();
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
        // get the authenticationPresenter from the function call to make sure it's the same one (transient)
        const authenticationPresenter = await testHarness?.setupRegister(
          GetSuccessfulRegistrationStub
        );
        authenticationPresenter.email = "a@c.com";
        authenticationPresenter.password = "1244";
        await authenticationPresenter.register();
        expect(authenticationPresenter?.showValidationWarning).toBe(false);
        expect(authenticationPresenter?.messages).toEqual([
          {
            message: "User registered",
            success: true,
          },
        ]);
      });
      it("should show failed user message on failed register", async () => {
        const authenticationPresenter = await testHarness?.setupRegister(
          GetFailedRegistrationStub
        );
        authenticationPresenter.email = "a@c.com";
        authenticationPresenter.password = "1244";
        await authenticationPresenter.register();
        expect(authenticationPresenter?.messages).toEqual([
          {
            message:
              "Failed: credentials not valid must be (email and >3 chars on password).",
            success: false,
          },
        ]);

        expect(authenticationPresenter?.showValidationWarning).toBe(true);
      });
      it("should set the presenter to login mode on successful register", async () => {
        const authenticationPresenter = await testHarness?.setupRegister(
          GetSuccessfulRegistrationStub
        );
        authenticationPresenter.email = "a@c.com";
        authenticationPresenter.password = "1244";
        await authenticationPresenter.register();
        expect(authenticationPresenter?.option).toBe("login");
      });
    });
    describe("login", () => {
      it("should start at loginLink if not logged in", () => {
        // this represents the user accessing the app for the first time (no token)
        router?.goToId("homeLink");
        // gets redirected to the login if going to a secure route
        const appPresenter = testHarness?.appPresenter;
        expect(appPresenter.currentRoute).toBe("loginLink");
      });

      // would start at null route, but not logged in
      it("should start at home route, when authenticated (and populate the user model)", async () => {
        const authenticationPresenter = await testHarness?.setupLogin(
          GetSuccessfulUserLoginStub
        );
        authenticationPresenter.email = "a@b.com";
        authenticationPresenter.password = "1234";
        authenticationPresenter.option = "login";
        await authenticationPresenter.login();
        const appPresenter = testHarness?.appPresenter;
        expect(appPresenter.currentRoute).toBe("homeLink");
        expect(testHarness?.userModel?.email).toBe("a@b.com");
        expect(testHarness?.userModel?.token).toBe("a@b1234.com");
      });

      it("should update the route when successfully logged in", async () => {
        // about is a private route
        const authenticationPresenter = await testHarness?.setupLogin(
          GetSuccessfulUserLoginStub
        );
        authenticationPresenter.email = "a@b.com";
        authenticationPresenter.password = "1234";
        authenticationPresenter.option = "login";
        await authenticationPresenter.login();
        router?.goToId("aboutLink");
        const appPresenter = testHarness?.appPresenter;
        expect(appPresenter.currentRoute).toBe("aboutLink");
      });

      it("should prevent access when not logged in", async () => {
        //start at login
        router?.goToId("loginLink");
        // fail login
        const authenticationPresenter = await testHarness?.setupLogin(
          GetFailedUserLoginStub
        );
        authenticationPresenter.email = "a@b.com";
        authenticationPresenter.password = "1234";
        authenticationPresenter.option = "login";
        await authenticationPresenter.login();
        // attempt to go to about
        router?.goToId("aboutLink");
        const appPresenter = testHarness?.appPresenter;
        // should still be at login
        expect(appPresenter.currentRoute).toBe("loginLink");
      });

      it("should show failed user message on failed login", async () => {
        const authenticationPresenter = await testHarness?.setupLogin(
          GetFailedUserLoginStub
        );
        authenticationPresenter.email = "a@b.com";
        authenticationPresenter.password = "1234";
        authenticationPresenter.option = "login";
        await authenticationPresenter.login();
        expect(authenticationPresenter?.messages).toEqual([
          {
            message: "Failed: no user record.",
            success: false,
          },
        ]);
        expect(authenticationPresenter?.showValidationWarning).toBe(true);
      });

      it("should clear messages on route change", async () => {
        const authenticationPresenter = await testHarness?.setupLogin(
          GetFailedUserLoginStub
        );
        authenticationPresenter.email = "a@b.com";
        authenticationPresenter.password = "1234";
        authenticationPresenter.option = "login";
        await authenticationPresenter.login();
        expect(authenticationPresenter?.messages).toEqual([
          {
            message: "Failed: no user record.",
            success: false,
          },
        ]);
        expect(authenticationPresenter?.showValidationWarning).toBe(true);
        router?.goToId("loginLink");
        expect(authenticationPresenter?.messages).toEqual([]);
      });
    });
  });
});
