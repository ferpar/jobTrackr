import { makeObservable, observable } from "mobx";
import { inject, injectable } from "inversify";
import type IRouterGateway from "./IRouterGateway";
import { Types } from "../Core/Types";

type Route = {
  routeId: string;
  routeDef: {
    path: string;
    uses?: string;
    isSecure: boolean;
  };
};

type RouteConfig = {
  [key: string]: {
    as: string;
    uses?: () => void;
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

  onRouteChanged: (() => Promise<void>) | null = null;

  routes: Route[] = [
    {
      routeId: "homeLink",
      routeDef: {
        path: "/",
        isSecure: false,
      },
    },
    {
      routeId: "aboutLink",
      routeDef: {
        path: "/about",
        isSecure: false,
      },
    },
    {
      routeId: "contactLink",
      routeDef: {
        path: "/contact",
        isSecure: false,
      },
    },
    {
        routeId: 'default',
        routeDef: {
          path: '*',
          isSecure: false
        },
      }
  ];

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
        uses: () => {},
        hooks: {
          before: (done) => {
            console.log(this.currentRoute.routeId, route.routeId)
            this.currentRoute.routeId = route.routeId;
            console.log(this.routerGateway)
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
        routeDef: { path: "", uses: undefined, isSecure: false },
      }
    );
  }

  async goToId(routeId: string): Promise<void> {
    console.log("at Repository", routeId)
    this.routerGateway.goToId(routeId);
  }
  
  async goToPath(path: string): Promise<void> {
    this.routerGateway.goToPath(path);
  }
}
