import { injectable, inject } from "inversify";
import { makeObservable, observable, action, computed } from "mobx";
import { AuthenticationRepository } from "./AuthenticationRepository";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";
import { Router } from "../Routing/Router";

@injectable()
export class AuthenticationPresenter extends MessagesPresenter {
  @inject(AuthenticationRepository)
  authenticationRepository: AuthenticationRepository;

  @inject(Router)
  router: Router;

  email: string | null = null;
  password: string | null = null;
  option: string | null = null;

  constructor() {
    super();
    makeObservable(this, {
      email: observable,
      password: observable,
      option: observable,
      reset: action,
      login: action,
      register: action,
      logOut: action,
      title: computed,
      switchButtonTitle: computed,
      submitButtonTitle: computed,
    });
    this.init();
    this.reset();
  }

  reset = () => {
    this.email = "";
    this.password = "";
    this.option = "login";
  };

  login = async () => {
    if (!this.email || !this.password) {
      console.error("Email and password are required");
      return;
    }
    const loginPm = await this.authenticationRepository.login(
      this.email,
      this.password
    );

    this.unpackRepositoryPmToVm(loginPm, "User logged in");

    if (loginPm.success) {
      this.router.goToId("homeLink");
    }
  };

  register = async () => {
    if (!this.email || !this.password) {
      console.error("Email and password are required");
      return;
    }
    const registerPm = await this.authenticationRepository.register(
      this.email,
      this.password
    );

    this.unpackRepositoryPmToVm(registerPm, "User registered");
    this.option = "login";
  };

  logOut = async () => {
    this.authenticationRepository.logOut();
    this.router.goToId("loginLink");
  };

  get title() {
    if (!this.option) {
      return "uninitialized";
    }
    return this.option === "login" ? "Welcome" : "Create new Account";
  }

  get switchButtonTitle() {
    return this.option === "login"
      ? "Have no Account?"
      : "Already have an Account?";
  }

  get submitButtonTitle() {
    return this.option === "login" ? "Login" : "Register";
  }
}
