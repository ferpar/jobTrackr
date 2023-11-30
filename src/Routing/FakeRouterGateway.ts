import { injectable } from "inversify";
import IRouterGateway from "./IRouterGateway";

@injectable()
export class FakeRouterGateway implements IRouterGateway {
  async registerRoutes(): Promise<void> {}

  unload(): void {}

  async goToId(): Promise<void> {}
}
