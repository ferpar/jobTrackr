import { injectable, inject } from 'inversify'
import { Config } from './Config'
import { UserModel } from '../Authentication/UserModel'
import IDataGateway from './IDataGateway'

@injectable()
export class AuthGateway implements IDataGateway{
  @inject(Config)
  config

  @inject(UserModel)
  userModel

  get = async (path) => {
    const response = await fetch(this.config.authApiUrl + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    const dto = response.json()
    return dto
  }

  post = async (path, requestDto) => {
    const response = await fetch(this.config.authApiUrl + path, {
      method: 'POST',
      body: JSON.stringify(requestDto),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    const dto = response.json()
    return dto
  }

  delete = async (path) => {
    const response = await fetch(this.config.authApiUrl + path, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.userModel.token
      }
    })
    const dto = response.json()
    return dto
  }
}
