import { makeObservable, observable } from "mobx";
import { inject, injectable } from "inversify";
import type IRouterGateway from "./IRouterGateway";
import { Types } from "../Core/Types";
import { ApplicationsRepository } from "../Applications/ApplicationsRepository";

export type Route = {
  routeId: string | null;
  routeDef: {
    path: string;
    uses?: string;
    isSecure: boolean;
  };
  onEnter?: () => void;
  onLeave?: () => void;
  params?: {
    [key: string]: string;
  };
  query?: {
    [key: string]: string;
  };
};

type RouteConfig = {
  [key: string]: {
    as: string | null;
    uses?: () => void;
    hooks: {
      before: (done: () => void) => void;
    };
  };
};

@injectable()
export class RouterRepository {
  currentRoute: Route = { routeId: null, routeDef: { path: "", isSecure: false }};

  @inject(Types.IRouterGateway)
  routerGateway: IRouterGateway;

  @inject(ApplicationsRepository)
  applicationsRepository: ApplicationsRepository;

  onRouteChanged: (() => Promise<void>) | null = null;

  routes: Route[] = [
    {
      routeId: "loginLink",
      routeDef: {
        path: "/login",
        isSecure: false,
      },
    },
    {
      routeId: "homeLink",
      routeDef: {
        path: "/",
        isSecure: true,
      },
    },
    {
      routeId: "aboutLink",
      routeDef: {
        path: "/about",
        isSecure: true,
      },
    },
    {
      routeId: "contactLink",
      routeDef: {
        path: "/contact",
        isSecure: true,
      },
    },
    {
      routeId: "applications",
      routeDef: {
        path: "/applications",
        isSecure: true,
      },
      onEnter: () => {
        this.applicationsRepository.load();
      },
      onLeave: () => {
        this.applicationsRepository.reset();
      }
    },
    {
      routeId: "default",
      routeDef: {
        path: "*",
        isSecure: false,
      },
    },
  ];

  constructor() {
    makeObservable(this, {
      currentRoute: observable,
    });
  }

  async registerRoutes(
    updateCurrentRoute: (
    routeId: Route["routeId"],
    params?: Route["params"],
    query?: Route["query"]
    ) => Promise<void>,
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
            updateCurrentRoute(route.routeId);
            done();
          },
        },
      };
    });

    this.routerGateway.registerRoutes(routeConfig);
  }

  findRoute(routeId: string | null): Route {
    const route = this.routes.find((route) => route.routeId === routeId);

    return (
      route || {
        routeId: "loadingSpinner",
        routeDef: { path: "", uses: undefined, isSecure: false },
      }
    );
  }

  async goToId(routeId: string): Promise<void> {
    this.routerGateway.goToId(routeId);
  }

  async goToPath(path: string): Promise<void> {
    this.routerGateway.goToPath(path);
  }
}
