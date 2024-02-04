import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AppTestHarness } from "../TestTools/AppTestHarness";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";
import { ApplicationsPresenter } from "./ApplicationsPresenter";
import { ApplicationsRepository } from "./ApplicationsRepository";
import { Router } from "../Routing/Router";
import { ApplicationsResultStub } from "../TestTools/ApplicationsResultStub";
import IDataGateway from "../Core/IDataGateway";

let testHarness: AppTestHarness | null = null;
let router: Router | null = null;
let applicationsPresenter: ApplicationsPresenter | null = null;
let applicationsRepository: ApplicationsRepository | null = null;
let dataGateway: IDataGateway | null = null;

describe("applications feature", () => {
  beforeEach(async () => {
    testHarness = new AppTestHarness();
    testHarness.init();
    applicationsPresenter = testHarness.container.get(ApplicationsPresenter);
    applicationsRepository = testHarness.container.get(ApplicationsRepository);
    dataGateway = applicationsRepository?.dataGateway as IDataGateway;
    router = testHarness.container.get(Router);

    testHarness.bootstrap();
    const authenticationPresenter = await testHarness.setupLogin(
      GetSuccessfulUserLoginStub
    );
    authenticationPresenter.email = "a@b.com";
    authenticationPresenter.password = "1234";
    authenticationPresenter.option = "login";
    await authenticationPresenter.login();
    // stub: succesfully loading applications
    dataGateway.get = vi.fn().mockImplementation(async () => {
      return await Promise.resolve(ApplicationsResultStub());
    });
  });
  it("should have an accessible screen", async () => {
    //act
    await router?.goToId("applications");
    //assert
    expect(router?.currentRoute.routeId).toBe("applications");
  });
  it("should have a list of applications when loaded", async () => {
    //act
    await router?.goToId("applications");
    expect(applicationsPresenter?.viewModel.length).toBe(0);
    await vi.waitUntil(() => applicationsPresenter?.messagePm === "LOADED");

    //assert
    expect(applicationsPresenter?.viewModel.length).toBe(1);

  })
});
