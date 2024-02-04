import { inject, injectable } from "inversify";
import { makeObservable, computed, action } from "mobx";
import { MessagesRepository } from "../Core/Messages/MessagesRepository";
import { RouterRepository, Route } from "./RouterRepository";
import { UserModel } from "../Authentication/UserModel";

@injectable()
export class Router {
  @inject(RouterRepository)
  routerRepository: RouterRepository;

  @inject(UserModel)
  userModel: UserModel;

  @inject(MessagesRepository)
  messagesRepository: MessagesRepository;

  get currentRoute(): { routeId: string | null } {
    return this.routerRepository.currentRoute;
  }

  constructor() {
    makeObservable(this, {
      currentRoute: computed,
      updateCurrentRoute: action,
    });
  }

  updateCurrentRoute = async (
    newRouteId: Route["routeId"], 
    params?: Route["params"],
    query?: Route["query"]
  ) => {
    const oldRoute = this.routerRepository.findRoute(this.currentRoute.routeId);
    const newRoute = this.routerRepository.findRoute(newRouteId);
    const hasToken = !!this.userModel.token;
    const routeChanged = oldRoute.routeId !== newRoute.routeId;
    const protectedOrUnauthenticatedRoute =
      (newRoute.routeDef.isSecure && hasToken === false) ||
      newRoute.routeDef.path === "*";
    const publicOrAuthenticatedRoute =
      (newRoute.routeDef.isSecure && hasToken === true) ||
      newRoute.routeDef.isSecure === false;

    if (routeChanged) {
      // if user is authenticated and the route is not found, redirect to home
      if (newRoute.routeDef.path === "*" && hasToken === true) {
        this.routerRepository.goToId("homeLink");
        return;
      }

      // if user is authenticated and tries to go to login, redirect to home
      if (newRoute.routeDef.path === "/login" && hasToken === true) {
        this.routerRepository.goToId("homeLink");
        return;
      }

      if (this.routerRepository.onRouteChanged) {
        this.routerRepository.onRouteChanged();
      }

      if (protectedOrUnauthenticatedRoute) {
        this.routerRepository.goToId("loginLink");
      } else if (publicOrAuthenticatedRoute) {
        if (oldRoute.onLeave) oldRoute.onLeave();
        if (newRoute.onEnter) newRoute.onEnter();
        this.routerRepository.currentRoute.routeId = newRoute.routeId;
        this.routerRepository.currentRoute.routeDef = newRoute.routeDef;
        this.routerRepository.currentRoute.params = params;
        this.routerRepository.currentRoute.query = query;
      }
    }
  };

  registerRoutes = (onRouteChange: () => Promise<void>) => {
    this.routerRepository.registerRoutes(
      this.updateCurrentRoute,
      onRouteChange
    );
  };

  goToId: (routeId: string, params?: object, query?: object) => Promise<void> =
    async (routeId) => {
      this.routerRepository.goToId(routeId);
    };

  goToPath = async (path: string) => {
    this.routerRepository.goToPath(path);
  };
}
