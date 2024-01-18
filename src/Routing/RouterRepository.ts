import { makeObservable, observable } from "mobx";
import { inject, injectable } from "inversify";
import type IRouterGateway from "./IRouterGateway";
import { Types } from "../Core/Types";
import { BooksRepository } from "../Books/BooksRepository";
import { AuthorsRepository } from "../Authors/AuthorsRepository";
import { ApplicationsRepository } from "../Applications/ApplicationsRepository";

type Route = {
  routeId: string;
  routeDef: {
    path: string;
    uses?: string;
    isSecure: boolean;
  };
  onEnter?: () => void;
  onLeave?: () => void;
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

  @inject(BooksRepository)
  booksRepository: BooksRepository;

  @inject(AuthorsRepository)
  authorsRepository: AuthorsRepository;

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
      routeId: "booksLink",
      routeDef: {
        path: "/books",
        isSecure: true,
      },
      onEnter:() => {
        this.booksRepository.load()
      },
      onLeave: () => {
        this.booksRepository.reset()
      },
    },
    {
      routeId: "authorsLink",
      routeDef: {
        path: "/authors",
        isSecure: true,
      },
      // onEnter: () => this.authorsRepository.load(),
      // onLeave: () => this.authorsRepository.reset(),
    },
    {
      routeId: "authorsLink-authorPolicyLink",
      routeDef: {
        path: "/authors/policy",
        isSecure: false,
      },
    },
    {
      routeId: "authorsLink-maplink",
      routeDef: {
        path: "/authors/map",
        isSecure: false,
      },
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
    this.routerGateway.goToId(routeId);
  }

  async goToPath(path: string): Promise<void> {
    this.routerGateway.goToPath(path);
  }
}
