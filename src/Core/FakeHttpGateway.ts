import { injectable } from "inversify";

@injectable()
export class FakeHttpGateway {
  /**
   * fake get 
   * @param path 
   */
  get = async () => {};

  /**
   * fake post 
   * @param path 
   * @param requestDto 
   */
  post = async () => {};

  /**
   * fake delete
   * @param path 
   */
  delete = async () => {};
}
