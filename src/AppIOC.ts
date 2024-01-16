import { RouterGateway } from './Routing/RouterGateway'
import { HttpGateway } from './Core/HttpGateway'
import { AuthGateway } from './Core/AuthGateway'
import { LocalStorageGateway } from './Core/LocalStorage/LocalStorageGateway'
import { Types } from './Core/Types'
import { BaseIOC } from './BaseIOC'

export const container = new BaseIOC().buildBaseTemplate()

container.bind(Types.IDataGateway).to(HttpGateway)
container.bind(Types.IRouterGateway).to(RouterGateway)
container.bind(Types.ILocalStorageGateway).to(LocalStorageGateway)
container.bind(Types.IAuthGateway).to(AuthGateway)
