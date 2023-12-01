import { injectable } from "inversify"
import Navigo from "navigo"
import IRouterGateway from "./IRouterGateway"

@injectable()
export class RouterGateway implements IRouterGateway {
    private navigo: Navigo
    
    constructor() {
        this.navigo = new Navigo("/")
    }
    
    async registerRoutes(routeConfig: object): Promise<void> {
        // this is a hack to prevent the navigo from being initialized twice
        if (this.navigo.routes.length) return new Promise( resolve => setTimeout(resolve, 0))
        this.navigo.on(routeConfig)
        .notFound(() => {})
        .resolve()

        return new Promise( resolve => setTimeout(resolve, 0))
    }
    
    unload(): void {
        this.navigo.destroy()
    }
    
    // the query object can be used to pass data to the route
    async goToId(routeId: string, queryObject?: object): Promise<boolean> {
        return this.navigo.navigateByName(routeId, queryObject)
    }
    
    async goToPath(path: string): Promise<void> {
        return this.navigo.navigate(path)
    }
}