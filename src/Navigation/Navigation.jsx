import React from "react";
import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/withInjection";
import { Router } from "../Routing/Router";
import { NavigationPresenter } from "./NavigationPresenter";

const NavigationComp = observer(({ router, presenter }) => {
  return (
    <div className="nav-menu">
      {presenter.viewModel.menuItems.map( item => {
        return (
          <a key={item.id} onClick={() => router.goToId(item.id)}><h2>{item.visibleName}</h2></a>
        );
      })}
      {presenter.viewModel.showBack && <a onClick={() => presenter.back()}><h2>Back</h2></a>}
    </div>
  );
});

export const Navigation = withInjection({
  presenter: NavigationPresenter,
  router: Router,
})(NavigationComp);
