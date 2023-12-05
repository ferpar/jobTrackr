import { injectable } from "inversify";

@injectable()
export class Config {
  apiUrl: string;
  constructor() {
    this.apiUrl = "https://api.logicroom.co/secure-api/ferp@protonmail.ch";
  }
}
