import { injectable } from "inversify";
import IStorageGateway from "./IStorageGateway";

@injectable()
export class FakeLocalStorageGateway implements IStorageGateway {
  get = () => {
    return "not implemented";
  };

  set = () => {};

  remove = () => {};
}
