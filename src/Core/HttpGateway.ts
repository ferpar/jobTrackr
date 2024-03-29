import { injectable, inject } from 'inversify'
import { Config } from './Config'
import { UserModel } from '../Authentication/UserModel'
import IDataGateway from './IDataGateway'

@injectable()
export class HttpGateway implements IDataGateway{
  @inject(Config)
  config: Config

  @inject(UserModel)
  userModel: UserModel

  get = async (path: string) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' +this.userModel.token
      }
    })
    const dto = response.json()
    return dto
  }

  post = async (path: string, requestDto: object) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'POST',
      body: JSON.stringify(requestDto),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.userModel.token
      }
    })
    const dto = response.json()
    return dto
  }

  delete = async (path: string) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.userModel.token
      }
    })
    const dto = response.json()
    return dto
  }
}
