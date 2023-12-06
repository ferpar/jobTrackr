import { injectable, inject } from 'inversify'
import { makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'

@injectable()
export class UserModel {

  email: string | null = null

  token: string | null = null

  constructor(
  @inject(Types.ILocalStorageGateway) localStorageGateway
  ) {
    // get token from local storage
    this.token = localStorageGateway.get('token')
    this.email = localStorageGateway.get('email')
    makeObservable(this, {
      email: observable,
      token: observable
    })
  }
}
