import { injectable } from "inversify";
import IStorageGateway from "./IStorageGateway";

@injectable()
export class FakeLocalStorageGateway {
  get = () => {};

  set = () => {};

  remove = () => {};
}
