import { injectable } from 'inversify'
import IStorageGateway from './IStorageGateway'

@injectable()
export class LocalStorageGateway implements IStorageGateway {

  get = (key) => {
    return localStorage.getItem(key)
  }

  set = (key, value) => {
    localStorage.setItem(key, value)
  }

  remove = (key) => {
    localStorage.removeItem(key)
  }
}