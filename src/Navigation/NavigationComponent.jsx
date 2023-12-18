import React from "react";
import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/withInjection";
import { Router } from "../Routing/Router";
import { NavigationPresenter } from "./NavigationPresenter";

const NavigationComp = observer(({ router, presenter }) => {
  return (
    <div>
      {presenter.viewModel.menuItems.map( item => {
        return (
          <button key={item.id} onClick={() => router.goToId(item.id)}>{item.visibleName}</button>
        );
      })}
      {presenter.viewModel.showBack && <button onClick={() => presenter.back()}>Back</button>}
    </div>
  );
});

export const NavigationComponent = withInjection({
  presenter: NavigationPresenter,
  router: Router,
})(NavigationComp);
