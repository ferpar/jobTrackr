import { injectable, inject } from "inversify";
import { makeObservable, action } from "mobx";
import { Types } from "../Core/Types";
import { Router } from "../Routing/Router";
import { UserModel } from "../Authentication/UserModel";
import { MessagePacking } from "../Core/Messages/MessagePacking";
import type IStorageGateway from "../Core/LocalStorage/IStorageGateway";
import type { AuthGateway } from "../Core/AuthGateway";

@injectable()
export class AuthenticationRepository {
  @inject(Router)
  router: Router;

  @inject(Types.IAuthGateway)
  authGateway: AuthGateway;

  @inject(Types.ILocalStorageGateway)
  localStorageGateway: IStorageGateway;

  @inject(UserModel)
  userModel: UserModel;

  constructor() {
    makeObservable(this, {
      login: action,
    });
  }

  login = async (email: string, password: string) => {
    const loginDto = await this.authGateway.post("/login", {
      email: email,
      password: password,
    });

    if (loginDto.success === true) {
      this.userModel.email = email;
      this.userModel.token = loginDto.result.token;
      this.localStorageGateway.set("token", loginDto.result.token);
      this.localStorageGateway.set("email", loginDto.result.email);
    }

    return MessagePacking.unpackServerDtoToPm(loginDto);
  };

  register = async (email: string, password: string) => {
    const registerDto = await this.authGateway.post("/register", {
      email: email,
      password: password,
    });

    return MessagePacking.unpackServerDtoToPm(registerDto);
  };

  logOut = async () => {
    this.userModel.email = "";
    this.userModel.token = "";
    this.localStorageGateway.remove("token");
    this.localStorageGateway.remove("email");
  };
}
