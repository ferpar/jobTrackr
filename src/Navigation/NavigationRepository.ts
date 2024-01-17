import { injectable, inject } from "inversify";
import TreeModel from "tree-model";
// import { AuthenticationRepository } from '../Authentication/AuthenticationRepository'
import { Router } from "../Routing/Router";
import { makeObservable, computed, action } from "mobx";

@injectable()
export class NavigationRepository {
  //   @inject(AuthenticationRepository)
  //   authenticationRepository

  @inject(Router)
  router;

  get currentNode() {
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
          id: "booksLink",
          type: "link",
          text: "Books",
          children: [],
        },
        {
          id: "authorsLink",
          type: "link",
          text: "Authors",
          children: [
            {
              id: "authorsLink-authorPolicyLink",
              type: "link",
              text: "Authors Policy",
              children: [],
            },
            {
              id: "authorsLink-maplink",
              type: "link",
              text: "View Map",
              children: [],
            },
          ],
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
