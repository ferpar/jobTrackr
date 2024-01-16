import { injectable } from "inversify";
const API_URL = import.meta.env.VITE_DEV_API_URL;
const AUTH_API_URL = import.meta.env.VITE_DEV_AUTH_API_URL;

@injectable()
export class Config {
  apiUrl: string;
  authApiUrl: string;
  constructor() {
    // this.apiUrl = "https://api.logicroom.co/secure-api/ferp@protonmail.ch";
    this.apiUrl = API_URL || "http://localhost:3001"
    this.authApiUrl = AUTH_API_URL || "http://localhost:3002"
  }
}
