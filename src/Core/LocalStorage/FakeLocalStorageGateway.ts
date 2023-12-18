import { injectable } from "inversify";

@injectable()
export class FakeLocalStorageGateway {
  get = () => {};

  set = () => {};

  remove = () => {};
}
