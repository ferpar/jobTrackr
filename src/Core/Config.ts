import { injectable } from "inversify";
const API_URL = import.meta.env.VITE_DEV_API_URL;

@injectable()
export class Config {
  apiUrl: string;
  constructor() {
    // this.apiUrl = "https://api.logicroom.co/secure-api/ferp@protonmail.ch";
    this.apiUrl = API_URL || "http://localhost:3000"
  }
}
