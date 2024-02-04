import { injectable, inject } from "inversify";
import TreeModel from "tree-model";
// import { AuthenticationRepository } from '../Authentication/AuthenticationRepository'
import { Router } from "../Routing/Router";
import { makeObservable, computed, action } from "mobx";

type NavigationModel = {
  id: string;
  type: "root" | "link";
  text: string;
  children: NavigationModel[];
};

export type NavigationNode = TreeModel.Node<NavigationModel>; 

@injectable()
export class NavigationRepository {
  //   @inject(AuthenticationRepository)
  //   authenticationRepository

  @inject(Router)
  router: Router;

  get currentNode(): NavigationNode {
    return this.getTree().all((node) => {
      return node.model.id === this.router.currentRoute.routeId;
    })[0];
  }

  constructor() {
    makeObservable(this, {
      currentNode: computed,
      back: action,
    });
  }

  getTree() {
    const tree = new TreeModel();

    const root = tree.parse({
      id: "homeLink",
      type: "root",
      text: "Home",
      children: [
        {
          id: "applications",
          type: "link",
          text: "Applications",
          children: [],
        },
        {
          id: "contactLink",
          type: "link",
          text: "Contact",
          children: [],
        },
        {
          id: "aboutLink",
          type: "link",
          text: "About",
          children: [],
        },
      ],
    });

    return root;
  }

  back = () => {
    const currentNode = this.currentNode;
    this.router.goToId(currentNode.parent.model.id);
  };
}
