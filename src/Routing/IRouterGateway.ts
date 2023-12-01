
export default interface IRouterGateway {
    registerRoutes(routeConfig: object): Promise<void>
    unload():void;
    goToId(routeId: string): Promise<boolean>
    goToPath(path: string): Promise<void>
}