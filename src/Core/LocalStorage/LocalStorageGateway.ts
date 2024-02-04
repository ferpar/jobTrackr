import { injectable } from 'inversify'
import IStorageGateway from './IStorageGateway'

@injectable()
export class LocalStorageGateway implements IStorageGateway {

  get = (key: string) => {
    return localStorage.getItem(key)
  }

  set = (key: string, value: string) => {
    localStorage.setItem(key, value)
  }

  remove = (key: string) => {
    localStorage.removeItem(key)
  }
}