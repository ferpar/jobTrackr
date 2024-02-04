import { injectable, inject } from "inversify";
import { Config } from "./Config";
import { UserModel } from "../Authentication/UserModel";
import IDataGateway from "./IDataGateway";

type AuthResponseDto =
  | {
      success: true;
      result: {
        message: string;
        token: string;
        email: string;
      };
    }
  | {
      success: false;
      result: { message: string };
    };
@injectable()
export class AuthGateway implements IDataGateway {
  @inject(Config)
  config: Config;

  @inject(UserModel)
  userModel: UserModel;

  get = async (path: string) => {
    const response = await fetch(this.config.authApiUrl + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.userModel.token,
      },
    });
    const dto = response.json();
    return dto;
  };

  post = async (path: string, requestDto: object): Promise<AuthResponseDto> => {
    const response = await fetch(this.config.authApiUrl + path, {
      method: "POST",
      body: JSON.stringify(requestDto),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.userModel.token,
      },
    });
    const dto = response.json();
    return dto;
  };

  delete = async (path: string) => {
    const response = await fetch(this.config.authApiUrl + path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.userModel.token,
      },
    });
    const dto = response.json();
    return dto;
  };
}
