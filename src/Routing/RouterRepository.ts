import { makeObservable, observable } from "mobx";
import { inject, injectable } from "inversify";
import type IRouterGateway from "./IRouterGateway";
import { Types } from "../Core/Types";

type Route = {
  routeId: string;
  routeDef: {
    path: string;
    uses?: string;
  };
};

type RouteConfig = {
  [key: string]: {
    as: string;
    hooks: {
      before: (done: () => void) => void;
    };
  };
};

@injectable()
export class RouterRepository {
  currentRoute: { routeId: string | null } = { routeId: null };

  @inject(Types.IRouterGateway)
  routerGateway: IRouterGateway;

  onRouteChanged : (() => Promise<void>) | null = null;

  routes: Route[] = [];

  constructor() {
    makeObservable(this, {
      currentRoute: observable,
    });
  }

  async registerRoutes(
    updateCurrentRoute: (routeId: string) => Promise<void>,
    onRouteChanged: () => Promise<void> 
  ): Promise<void> {
    this.onRouteChanged = onRouteChanged;
    const routeConfig: RouteConfig = {};
    this.routes.forEach((routeArg) => {
      const route: Route = this.findRoute(routeArg.routeId);
      routeConfig[route.routeDef.path] = {
        as: route.routeId,
        hooks: {
          before: (done) => {
            this.currentRoute.routeId = route.routeId;
            updateCurrentRoute(route.routeId);
            done();
          },
        },
      };
    });

    this.routerGateway.registerRoutes(routeConfig);
  }

  findRoute(routeId: string): Route {
    const route = this.routes.find((route) => route.routeId === routeId);

    return (
      route || {
        routeId: "loadingSpinner",
        routeDef: { path: "", uses: undefined },
      }
    );
  }
}
