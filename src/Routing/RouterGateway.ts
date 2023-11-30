import { injectable } from "inversify"
import Navigo from "navigo"
import IRouterGateway from "./IRouterGateway"

@injectable()
export class RouterGateway implements IRouterGateway {
    private router: Navigo
    private routesSet: boolean = false
    
    constructor() {
        this.router = new Navigo("/")
    }
    
    async registerRoutes(routeConfig: object): Promise<void> {
        // this is a hack to prevent the router from being initialized twice
        if (this.routesSet) return new Promise( resolve => setTimeout(resolve, 0))
        this.router.on(routeConfig)
        .notFound(() => {})
        .resolve()

        return new Promise( resolve => setTimeout(resolve, 0))
    }
    
    unload(): void {
        this.router.destroy()
    }
    
    // the query object can be used to pass data to the route
    async goToId(routeId: string, queryObject?: object): Promise<void> {
        this.router.navigateByName(routeId, queryObject)
    }
}